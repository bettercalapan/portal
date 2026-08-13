import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { access, chmod, mkdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const LYCHEE_VERSION = "0.24.2";
const PROJECT_ROOT = fileURLToPath(new URL("../", import.meta.url));
const RELEASE_URL = `https://github.com/lycheeverse/lychee/releases/download/lychee-v${LYCHEE_VERSION}`;
const ASSETS = {
	"darwin/arm64": {
		archive: "lychee-aarch64-apple-darwin.tar.gz",
		sha256: "c9d3740ea2d891854d37116c9fba840f37b6e7c89d330e7db84ac333631c4977"
	},
	"darwin/x64": {
		archive: "lychee-x86_64-apple-darwin.tar.gz",
		sha256: "887503a9cff667d322b8d0892b40bf49976eb9507af8483220a3706cdad55978"
	},
	"linux/arm64": {
		archive: "lychee-aarch64-unknown-linux-gnu.tar.gz",
		sha256: "91a7bd65685da41b90ccb9bc867a3d649a7818042dae04ff405e55a25bddee4c"
	},
	"linux/x64": {
		archive: "lychee-x86_64-unknown-linux-musl.tar.gz",
		sha256: "73657a111819a30c47c08352896796f23d64e4eb2b3ed39b6d32149241566fc5"
	},
	"win32/x64": {
		archive: "lychee-x86_64-pc-windows-msvc.zip",
		sha256: "32975d1493ee1a975d6bb41e4fb56fe419cb442ded628bb772ba2e614acfacad"
	}
};

export function getLycheeAsset(platform = process.platform, arch = process.arch) {
	const asset = ASSETS[`${platform}/${arch}`];
	if (!asset) throw new Error(`Lychee does not support ${platform}/${arch} in this project.`);
	return asset;
}

function run(command, args) {
	return new Promise((resolve, reject) => {
		const child = spawn(command, args, { stdio: "inherit" });
		child.on("error", reject);
		child.on("exit", (code) => {
			if (code === 0) resolve();
			else reject(new Error(`${command} exited with code ${code ?? "unknown"}`));
		});
	});
}

async function extract(archivePath, destination, isZip) {
	if (isZip) {
		await run("powershell", [
			"-NoProfile",
			"-Command",
			"Expand-Archive -LiteralPath $args[0] -DestinationPath $args[1] -Force",
			archivePath,
			destination
		]);
		return;
	}
	await run("tar", ["-xzf", archivePath, "-C", destination]);
}

export async function getLycheeBinary() {
	const asset = getLycheeAsset();
	const destination = `${PROJECT_ROOT}node_modules/.cache/bettercalapan/lychee/${LYCHEE_VERSION}`;
	const extractedDirectory = asset.archive.replace(/\.(tar\.gz|zip)$/, "");
	const binary = `${destination}/${extractedDirectory}/${process.platform === "win32" ? "lychee.exe" : "lychee"}`;

	try {
		await access(binary);
		return binary;
	} catch {
		// The binary is downloaded on first use and cached with installed dependencies.
	}

	await mkdir(destination, { recursive: true });
	const archivePath = `${destination}/${asset.archive}`;
	try {
		const response = await fetch(`${RELEASE_URL}/${asset.archive}`);
		if (!response.ok)
			throw new Error(`Failed to download Lychee: ${response.status} ${response.statusText}`);

		const archive = Buffer.from(await response.arrayBuffer());
		const checksum = createHash("sha256").update(archive).digest("hex");
		if (checksum !== asset.sha256)
			throw new Error("Downloaded Lychee binary failed checksum verification.");

		await writeFile(archivePath, archive);
		await extract(archivePath, destination, asset.archive.endsWith(".zip"));
		if (process.platform !== "win32") await chmod(binary, 0o755);
		return binary;
	} finally {
		await rm(archivePath, { force: true });
	}
}
