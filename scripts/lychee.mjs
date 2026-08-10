import { spawn } from "node:child_process";
import { mkdir, rm } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { writeLycheeSummary } from "./lychee-summary.mjs";

const PREVIEW_URL = "http://localhost:4173";
const PREVIEW_START_TIMEOUT = 60_000;
const XML_ENTITIES = {
	"&amp;": "&",
	"&lt;": "<",
	"&gt;": ">",
	"&quot;": '"',
	"&apos;": "'"
};

export function extractSitemapUrls(xml, sitemapUrl) {
	const sitemapOrigin = new URL(sitemapUrl).origin;
	const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => {
		const value = decodeXml(match[1].trim());
		const url = new URL(value);
		if (url.origin !== sitemapOrigin) {
			throw new Error(`Sitemap URL must use the preview origin: ${url.href}`);
		}
		return url.href;
	});

	if (urls.length === 0) throw new Error("Sitemap does not contain any page URLs");
	return urls;
}

function decodeXml(value) {
	return value.replaceAll(/&(?:amp|lt|gt|quot|apos);/g, (entity) => XML_ENTITIES[entity]);
}

function run(command, args, options = {}) {
	const { stderrFilter, ...spawnOptions } = options;
	return new Promise((resolve) => {
		const child = spawn(command, args, {
			...spawnOptions,
			stdio: stderrFilter ? ["inherit", "inherit", "pipe"] : "inherit"
		});
		if (stderrFilter) pipeFilteredLines(child.stderr, stderrFilter);
		child.on("error", (error) => {
			console.error(`Failed to run ${command}: ${error.message}`);
			resolve(1);
		});
		child.on("exit", (code) => resolve(code ?? 1));
	});
}

function pipeFilteredLines(stream, shouldWrite) {
	let pending = "";
	stream.setEncoding("utf8");
	stream.on("data", (chunk) => {
		const lines = `${pending}${chunk}`.split("\n");
		pending = lines.pop();
		for (const line of lines) {
			if (shouldWrite(line)) process.stderr.write(`${line}\n`);
		}
	});
	stream.on("end", () => {
		if (pending && shouldWrite(pending)) process.stderr.write(pending);
	});
}

async function waitForPreview() {
	const deadline = Date.now() + PREVIEW_START_TIMEOUT;
	while (Date.now() < deadline) {
		try {
			const response = await fetch(PREVIEW_URL);
			if (response.ok) return;
		} catch {
			// server not up yet
		}
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}
	throw new Error(`Preview server did not start at ${PREVIEW_URL}`);
}

async function getSitemapUrls() {
	const sitemapUrl = `${PREVIEW_URL}/sitemap.xml`;
	const response = await fetch(sitemapUrl);
	if (!response.ok)
		throw new Error(`Failed to load sitemap: ${response.status} ${response.statusText}`);
	return extractSitemapUrls(await response.text(), sitemapUrl);
}

async function main() {
	const mode = process.argv[2] ?? "local";
	if (!["local", "ci"].includes(mode)) {
		console.error(`Unknown Lychee mode: ${mode}`);
		process.exit(1);
	}

	const buildStatus = await run("pnpm", ["build"]);
	if (buildStatus !== 0) process.exit(buildStatus);

	const preview = spawn("pnpm", ["preview"], { stdio: "inherit", detached: true });

	function stopPreview() {
		if (!preview.pid) return;
		try {
			process.kill(-preview.pid, "SIGTERM");
		} catch (error) {
			if (error.code !== "ESRCH") console.error(`Failed to stop preview: ${error.message}`);
		}
	}

	function handleSignal(exitCode) {
		stopPreview();
		process.exit(exitCode);
	}

	const handleSigint = () => handleSignal(130);
	const handleSigterm = () => handleSignal(143);
	process.once("SIGINT", handleSigint);
	process.once("SIGTERM", handleSigterm);

	let status;
	try {
		await waitForPreview();
		const urls = await getSitemapUrls();
		console.log(`\nChecking external links across ${urls.length} sitemap pages...\n`);
		const args = ["--config", "lychee.toml"];
		const reportPath = ".lychee/results.json";
		if (mode === "ci") {
			await rm(".lychee", { recursive: true, force: true });
			await mkdir(".lychee");
			args.push("-v", "--no-progress", "--format", "json", "--output", reportPath);
		}
		status = await run("lychee", [...args, ...urls], {
			stderrFilter: mode === "ci" ? (line) => !line.includes("[EXCLUDED]") : undefined
		});

		if (mode === "ci") {
			try {
				await writeLycheeSummary(reportPath, ".lychee/summary.md", undefined, status);
			} catch (error) {
				console.error(error instanceof Error ? error.message : error);
				if (status === 0) status = 1;
			}
		}
	} catch (error) {
		console.error(error instanceof Error ? error.message : error);
		status = 1;
	} finally {
		process.off("SIGINT", handleSigint);
		process.off("SIGTERM", handleSigterm);
		stopPreview();
	}

	process.exit(status);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
