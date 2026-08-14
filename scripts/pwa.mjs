import assert from "node:assert/strict";
import { once } from "node:events";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const PREVIEW_HOST = "127.0.0.1";
const PREVIEW_START_TIMEOUT = 60_000;

function run(command, args) {
	return new Promise((resolve) => {
		const child = spawn(command, args, { stdio: "inherit" });
		child.on("error", (error) => {
			console.error(`Failed to run ${command}: ${error.message}`);
			resolve(1);
		});
		child.on("exit", (code) => resolve(code ?? 1));
	});
}

function getAvailablePort() {
	return new Promise((resolve, reject) => {
		const server = createServer();
		server.once("error", reject);
		server.listen(0, PREVIEW_HOST, () => {
			const address = server.address();
			if (!address || typeof address === "string") {
				server.close();
				reject(new Error("Could not determine an available port"));
				return;
			}

			server.close((error) => {
				if (error) reject(error);
				else resolve(address.port);
			});
		});
	});
}

async function waitForPreview(previewUrl) {
	const deadline = Date.now() + PREVIEW_START_TIMEOUT;
	while (Date.now() < deadline) {
		try {
			const response = await fetch(previewUrl);
			if (response.ok) return;
		} catch {
			// The preview server is not accepting requests yet.
		}
		await new Promise((resolve) => setTimeout(resolve, 1_000));
	}
	throw new Error(`Preview server did not start at ${previewUrl}`);
}

async function waitForServiceWorker(page) {
	await page.evaluate(async () => {
		await navigator.serviceWorker.ready;
		if (navigator.serviceWorker.controller) return;
		await new Promise((resolve) =>
			navigator.serviceWorker.addEventListener("controllerchange", resolve, { once: true })
		);
	});
}

async function getCachedPaths(page) {
	return page.evaluate(async () => {
		const paths = [];
		for (const cacheName of await caches.keys()) {
			const cache = await caches.open(cacheName);
			for (const request of await cache.keys()) paths.push(new URL(request.url).pathname);
		}
		return paths;
	});
}

async function stopPreview(preview) {
	if (!preview.pid || preview.exitCode !== null || preview.signalCode !== null) return;
	const exited = once(preview, "exit");
	preview.kill("SIGTERM");
	await exited;
}

async function main() {
	const buildStatus = await run("pnpm", ["build"]);
	if (buildStatus !== 0) return buildStatus;

	const wrangler = fileURLToPath(
		new URL("../node_modules/wrangler/bin/wrangler.js", import.meta.url)
	);
	const port = await getAvailablePort();
	const previewUrl = `http://${PREVIEW_HOST}:${port}`;
	const preview = spawn(
		process.execPath,
		[wrangler, "dev", ".svelte-kit/cloudflare/_worker.js", "--port", String(port)],
		{ stdio: "inherit" }
	);

	let browser;
	try {
		await waitForPreview(previewUrl);
		browser = await chromium.launch({ headless: true });
		const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
		let page = await context.newPage();

		const initialResponse = await page.goto(previewUrl, { waitUntil: "networkidle" });
		assert.match(
			initialResponse?.headers().link ?? "",
			/<[^>]+\.woff2>; rel="preload"; as="font"/,
			"the Figtree font should be preloaded"
		);
		await waitForServiceWorker(page);
		await page.reload({ waitUntil: "networkidle" });
		await waitForServiceWorker(page);

		const manifestResponse = await page.request.get(`${previewUrl}/manifest.webmanifest`);
		assert.equal(manifestResponse.ok(), true, "manifest request failed");
		assert.match(
			manifestResponse.headers()["content-type"] ?? "",
			/^application\/manifest\+json\b/,
			"manifest has the wrong content type"
		);
		const manifest = await manifestResponse.json();
		assert.equal(manifest.name, "BetterCalapan");
		assert.equal(manifest.display, "standalone");
		assert.equal(manifest.background_color, "#ff5500");
		assert.equal(manifest.theme_color, "#ff5500");
		assert.deepEqual(
			manifest.icons.map((icon) => icon.sizes),
			["192x192", "512x512", "512x512"]
		);

		const session = await context.newCDPSession(page);
		const { errors } = await session.send("Page.getAppManifest");
		assert.deepEqual(errors, [], "Chrome reported manifest errors");
		const { installabilityErrors } = await session.send("Page.getInstallabilityErrors");
		assert.deepEqual(installabilityErrors, [], "Chrome reported installability errors");

		const cachedPaths = await getCachedPaths(page);
		assert.equal(cachedPaths.includes("/contact"), true, "contact page was not cached");
		assert.equal(
			cachedPaths.some((path) => path.endsWith(".js")),
			true,
			"JavaScript was not cached"
		);
		assert.equal(
			cachedPaths.includes("/pwa/figtree-variable.woff2"),
			true,
			"offline Figtree font was not cached"
		);

		await context.setOffline(true);
		const contactResponse = await page.goto(`${previewUrl}/contact?offline-test`, {
			waitUntil: "domcontentloaded"
		});
		assert.equal(contactResponse?.status(), 200, "offline contact navigation failed");
		assert.equal(await page.getByRole("heading", { name: "Contact" }).isVisible(), true);

		await page.goto(`${previewUrl}/search`, { waitUntil: "domcontentloaded" });
		const searchInput = page.getByRole("textbox", { name: "Search BetterCalapan.org" });
		await searchInput.fill("business");
		await Promise.all([
			page.waitForURL("**/search?term=business"),
			searchInput.press("Enter")
		]);
		assert.equal(
			await page.getByRole("link", { name: "Business Permit", exact: true }).isVisible(),
			true
		);

		const offlineResponse = await page.goto(`${previewUrl}/not-cached`, {
			waitUntil: "domcontentloaded"
		});
		assert.equal(offlineResponse?.status(), 200, "offline fallback navigation failed");
		assert.equal(await page.getByRole("heading", { name: "You're offline" }).isVisible(), true);
		assert.equal(
			await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
			true,
			"offline fallback overflows a mobile viewport"
		);

		await context.setOffline(false);

		await page.evaluate(async () => {
			const cache = await caches.open("bettercalapan-pwa-obsolete");
			await cache.put("/obsolete", new Response("obsolete"));
			const registration = await navigator.serviceWorker.getRegistration();
			await registration?.unregister();
		});
		await page.close();
		page = await context.newPage();
		await page.goto(previewUrl, { waitUntil: "networkidle" });
		await waitForServiceWorker(page);
		assert.equal(
			await page.evaluate(() => caches.has("bettercalapan-pwa-obsolete")),
			false,
			"an obsolete BetterCalapan cache was not removed"
		);

		await context.close();
		console.log("PWA checks passed.");
	} finally {
		await browser?.close();
		await stopPreview(preview);
	}

	return 0;
}

process.exitCode = await main();
