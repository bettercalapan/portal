import { spawn } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { extractSitemapUrls } from "./lychee.mjs";

const PREVIEW_URL = "http://localhost:4173";
const PREVIEW_START_TIMEOUT = 60_000;
const ROUTE_CONCURRENCY = 8;

export function extractUniqueSitemapUrls(xml, sitemapUrl) {
	const urls = extractSitemapUrls(xml, sitemapUrl);
	if (new Set(urls).size !== urls.length) throw new Error("Sitemap contains duplicate page URLs");
	return urls;
}

export function isXmlContentType(contentType) {
	const mediaType = contentType?.split(";", 1)[0].trim().toLowerCase();
	return mediaType === "application/xml" || mediaType === "text/xml" || mediaType?.endsWith("+xml");
}

export function isHtmlContentType(contentType) {
	const mediaType = contentType?.split(";", 1)[0].trim().toLowerCase();
	return mediaType === "text/html" || mediaType === "application/xhtml+xml";
}

export function validateRouteResponse(routeUrl, response) {
	if (!response.ok) {
		throw new Error(`Route returned ${response.status} ${response.statusText}: ${routeUrl}`);
	}
	if (!isHtmlContentType(response.contentType)) {
		throw new Error(
			`Route did not return HTML (${response.contentType ?? "missing Content-Type"}): ${routeUrl}`
		);
	}

	const finalUrl = new URL(response.finalUrl);
	if (finalUrl.origin !== new URL(routeUrl).origin) {
		throw new Error(`Route redirected outside the preview origin: ${routeUrl} -> ${finalUrl.href}`);
	}
}

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

async function waitForPreview() {
	const deadline = Date.now() + PREVIEW_START_TIMEOUT;
	while (Date.now() < deadline) {
		try {
			const response = await fetch(PREVIEW_URL);
			if (response.ok) return;
		} catch {
			// The preview server is not accepting requests yet.
		}
		await new Promise((resolve) => setTimeout(resolve, 1_000));
	}
	throw new Error(`Preview server did not start at ${PREVIEW_URL}`);
}

async function getSitemapUrls() {
	const sitemapUrl = `${PREVIEW_URL}/sitemap.xml`;
	const response = await fetch(sitemapUrl);
	if (!response.ok) {
		throw new Error(`Failed to load sitemap: ${response.status} ${response.statusText}`);
	}
	if (!isXmlContentType(response.headers.get("content-type"))) {
		throw new Error(
			`Sitemap did not return XML (${response.headers.get("content-type") ?? "missing Content-Type"})`
		);
	}
	return extractUniqueSitemapUrls(await response.text(), sitemapUrl);
}

async function checkRoutes(urls) {
	const failures = [];
	let nextIndex = 0;

	async function worker() {
		while (nextIndex < urls.length) {
			const url = urls[nextIndex++];
			try {
				const response = await fetch(url);
				validateRouteResponse(url, {
					ok: response.ok,
					status: response.status,
					statusText: response.statusText,
					contentType: response.headers.get("content-type"),
					finalUrl: response.url
				});
				console.log(`PASS ${new URL(url).pathname}`);
			} catch (error) {
				failures.push(error instanceof Error ? error.message : String(error));
			}
		}
	}

	await Promise.all(Array.from({ length: Math.min(ROUTE_CONCURRENCY, urls.length) }, worker));
	if (failures.length > 0) throw new Error(`Route smoke failures:\n${failures.join("\n")}`);
}

async function main() {
	const buildStatus = await run("pnpm", ["build"]);
	if (buildStatus !== 0) return buildStatus;

	const wrangler = fileURLToPath(
		new URL("../node_modules/wrangler/bin/wrangler.js", import.meta.url)
	);
	const preview = spawn(
		process.execPath,
		[wrangler, "dev", ".svelte-kit/cloudflare/_worker.js", "--port", "4173"],
		{
			stdio: "inherit"
		}
	);
	async function stopPreview() {
		if (preview.exitCode !== null || preview.signalCode !== null) return;
		preview.kill("SIGTERM");
		await new Promise((resolve) => preview.once("exit", resolve));
	}

	function handleSignal(exitCode) {
		void stopPreview().finally(() => process.exit(exitCode));
	}

	const handleSigint = () => handleSignal(130);
	const handleSigterm = () => handleSignal(143);
	process.once("SIGINT", handleSigint);
	process.once("SIGTERM", handleSigterm);

	let status = 0;
	try {
		await waitForPreview();
		const urls = await getSitemapUrls();
		console.log(
			`\nChecking ${urls.length} sitemap routes with concurrency ${ROUTE_CONCURRENCY}...\n`
		);
		await checkRoutes(urls);
	} catch (error) {
		console.error(error instanceof Error ? error.message : error);
		status = 1;
	} finally {
		process.off("SIGINT", handleSigint);
		process.off("SIGTERM", handleSigterm);
		await stopPreview();
	}

	return status;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	process.exitCode = await main();
}
