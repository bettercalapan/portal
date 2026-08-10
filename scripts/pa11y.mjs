import { spawn } from "node:child_process";
import { rm } from "node:fs/promises";
import { writePa11ySummary } from "./pa11y-summary.mjs";

const PREVIEW_URL = "http://localhost:4173";
const PREVIEW_START_TIMEOUT = 60_000;
const mode = process.argv[2] ?? "all";
const ciDevice = process.argv[3];

if (!["all", "mobile", "desktop", "ci"].includes(mode)) {
	console.error(`Unknown Pa11y mode: ${mode}`);
	process.exit(1);
}

if (ciDevice && (mode !== "ci" || !["mobile", "desktop"].includes(ciDevice))) {
	console.error(`Unknown CI Pa11y device: ${ciDevice}`);
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

let status = 0;
try {
	await waitForPreview();
	const devices =
		mode === "ci"
			? ciDevice
				? [ciDevice]
				: ["mobile", "desktop"]
			: mode === "all"
				? ["mobile", "desktop"]
				: [mode];

	for (const device of devices) {
		console.log(`\nRunning Pa11y for ${device} pages...\n`);
		const reportDirectory = `.pa11y/${device}`;
		const reportPath = `${reportDirectory}/results.json`;
		const env = { ...process.env, PA11Y_DEVICE: device };
		if (mode === "ci") {
			await rm(reportDirectory, { recursive: true, force: true });
			env.PA11Y_REPORT_PATH = reportPath;
		}

		const scanStatus = await run(
			"pnpm",
			[
				"exec",
				"pa11y-ci",
				"--config",
				"pa11y-ci.config.cjs",
				"--sitemap",
				`${PREVIEW_URL}/sitemap.xml`,
				"--threshold",
				"0"
			],
			{ env }
		);
		if (scanStatus !== 0) status = scanStatus;

		if (mode === "ci") {
			try {
				await writePa11ySummary(device, reportPath, undefined, scanStatus);
			} catch (error) {
				if (scanStatus === 0) {
					console.error(error instanceof Error ? error.message : error);
					status = 1;
				} else {
					console.error(`Pa11y exited with code ${scanStatus} before report generation`);
				}
			}
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
