import { spawn } from "node:child_process";
import { once } from "node:events";
import { rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { writeBenchmarkSummary } from "./benchmark-summary.mjs";

const PREVIEW_URL = "http://localhost:4173";
const PREVIEW_START_TIMEOUT = 60_000;
const mode = process.argv[2] ?? "mobile";
const ciDevice = process.argv[3];

if (!["mobile", "desktop", "ci"].includes(mode)) {
	console.error(`Unknown benchmark mode: ${mode}`);
	process.exit(1);
}

if (ciDevice && (mode !== "ci" || !["mobile", "desktop"].includes(ciDevice))) {
	console.error(`Unknown CI benchmark device: ${ciDevice}`);
	process.exit(1);
}

function run(command, args, options = {}) {
	return new Promise((resolve) => {
		const child = spawn(command, args, { stdio: "inherit", ...options });
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
			// server not up yet
		}
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}
	throw new Error(`Preview server did not start at ${PREVIEW_URL}`);
}

const buildStatus = await run("pnpm", ["build"]);
if (buildStatus !== 0) process.exit(buildStatus);

const wrangler = fileURLToPath(
	new URL("../node_modules/wrangler/bin/wrangler.js", import.meta.url)
);
const preview = spawn(
	process.execPath,
	[wrangler, "dev", ".svelte-kit/cloudflare/_worker.js", "--port", "4173"],
	{ stdio: "inherit" }
);

async function stopPreview() {
	if (!preview.pid || preview.exitCode !== null || preview.signalCode !== null) return;
	try {
		const exited = once(preview, "exit");
		preview.kill("SIGTERM");
		await exited;
	} catch (error) {
		if (error.code !== "ESRCH") console.error(`Failed to stop preview: ${error.message}`);
	}
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
	const devices = mode === "ci" ? (ciDevice ? [ciDevice] : ["mobile", "desktop"]) : [mode];
	const command = mode === "ci" ? "unlighthouse-ci" : "unlighthouse";
	for (const device of devices) {
		if (mode === "ci") await rm(`.unlighthouse/${device}`, { recursive: true, force: true });
		const scanStatus = await run("pnpm", ["exec", command], {
			env: { ...process.env, UNLIGHTHOUSE_DEVICE: device }
		});
		if (scanStatus !== 0) status = scanStatus;
		if (mode === "ci") {
			try {
				await writeBenchmarkSummary(device, `.unlighthouse/${device}/ci-result.json`);
			} catch (error) {
				console.error(error instanceof Error ? error.message : error);
				status = 1;
			}
		}
	}
} catch (error) {
	console.error(error instanceof Error ? error.message : error);
	status = 1;
} finally {
	process.off("SIGINT", handleSigint);
	process.off("SIGTERM", handleSigterm);
	await stopPreview();
}

process.exit(status);
