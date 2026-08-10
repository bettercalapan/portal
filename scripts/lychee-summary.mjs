import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const RESULT_MAPS = [
	["success_map", "success"],
	["error_map", "error"],
	["timeout_map", "timeout"]
];

export function parseLycheeReport(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) {
		throw new Error("Lychee did not produce a valid report");
	}

	for (const field of ["total", "unique", "successful", "redirects", "errors", "timeouts"]) {
		if (!Number.isInteger(value[field]) || value[field] < 0) {
			throw new Error(`Lychee report has an invalid ${field} count`);
		}
	}

	if (value.detailed_stats !== true) {
		throw new Error("Lychee report does not contain detailed link results");
	}
	if (value.unknown !== 0 || value.unsupported !== 0) {
		throw new Error(
			`Lychee report contains ${value.unknown ?? "invalid"} unknown and ${value.unsupported ?? "invalid"} unsupported results`
		);
	}

	const links = new Map();
	for (const [mapName, kind] of RESULT_MAPS) {
		const resultMap = value[mapName];
		if (!resultMap || typeof resultMap !== "object" || Array.isArray(resultMap)) {
			throw new Error(`Lychee report is missing ${mapName}`);
		}

		for (const [source, responses] of Object.entries(resultMap)) {
			parseUrl(source, "source page");
			if (!Array.isArray(responses)) {
				throw new Error(`Lychee report contains invalid results for ${source}`);
			}
			for (const response of responses) mergeResponse(links, source, kind, response);
		}
	}

	if (links.size === 0)
		throw new Error("Lychee report does not contain any checked external links");

	return {
		total: value.total,
		unique: value.unique,
		links: [...links.values()].map((link) => ({
			url: link.url,
			kind: link.kind,
			status: link.status,
			redirects: link.redirects,
			sources: [...link.sources]
		}))
	};
}

export function renderLycheeSummary(report) {
	const links = [...report.links].sort(
		(a, b) => statusPriority(a) - statusPriority(b) || a.url.localeCompare(b.url)
	);
	const counts = {
		ok: links.filter(
			(link) => link.kind === "success" && !link.redirects && link.status.code !== 403
		).length,
		accepted: links.filter(
			(link) => link.kind === "success" && !link.redirects && link.status.code === 403
		).length,
		redirected: links.filter((link) => link.kind === "success" && link.redirects).length,
		failed: links.filter((link) => link.kind === "error").length,
		timedOut: links.filter((link) => link.kind === "timeout").length
	};

	return [
		"## Lychee: External links",
		"",
		`${links.length} unique external HTTP(S) links found across the generated sitemap pages.`,
		"",
		"| OK | Accepted 403 | Redirected | Failed | Timed out |",
		"| ---: | ---: | ---: | ---: | ---: |",
		`| ${counts.ok} | ${counts.accepted} | ${counts.redirected} | ${counts.failed} | ${counts.timedOut} |`,
		"",
		"| External URL | Status | Found on |",
		"| --- | --- | --- |",
		...links.map(renderLink),
		""
	].join("\n");
}

export async function writeLycheeSummary(
	reportPath,
	outputPath = ".lychee/summary.md",
	jobSummaryPath = process.env.GITHUB_STEP_SUMMARY,
	scanStatus = 0
) {
	let summary;
	try {
		const report = parseLycheeReport(JSON.parse(await readReport(reportPath)));
		summary = renderLycheeSummary(report);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		const detail =
			scanStatus === 0
				? `Link summary unavailable: ${message}`
				: `Lychee exited with code ${scanStatus} before it generated a complete report. See the job log for the primary error.`;
		summary = `## Lychee: External links\n\n${detail}\n`;
		await outputSummary(summary, outputPath, jobSummaryPath);
		throw error;
	}

	await outputSummary(summary, outputPath, jobSummaryPath);
}

function mergeResponse(links, source, kind, response) {
	if (!response || typeof response !== "object" || Array.isArray(response)) {
		throw new Error(`Lychee report contains an invalid ${kind} result for ${source}`);
	}

	const url = parseUrl(response.url, "external URL");
	if (!["http:", "https:"].includes(url.protocol)) {
		throw new Error(`Lychee report contains a non-HTTP result: ${url.href}`);
	}
	const status = parseStatus(response.status, url.href);
	const redirects = response.redirects ? parseRedirects(response.redirects, url.href) : undefined;
	const existing = links.get(url.href);

	if (existing) {
		if (
			existing.kind !== kind ||
			existing.status.code !== status.code ||
			(existing.status.code === undefined && existing.status.text !== status.text) ||
			(existing.redirects && redirects && !sameRedirects(existing.redirects, redirects))
		) {
			throw new Error(`Lychee report contains conflicting results for ${url.href}`);
		}
		if (existing.status.text.includes("(cached)") && !status.text.includes("(cached)")) {
			existing.status = status;
		}
		existing.redirects ??= redirects;
		existing.sources.add(source);
		return;
	}

	links.set(url.href, {
		url: url.href,
		kind,
		status,
		redirects,
		sources: new Set([source])
	});
}

function sameRedirects(left, right) {
	return JSON.stringify(left) === JSON.stringify(right);
}

function parseStatus(value, url) {
	if (
		!value ||
		typeof value !== "object" ||
		Array.isArray(value) ||
		typeof value.text !== "string"
	) {
		throw new Error(`Lychee report contains an invalid status for ${url}`);
	}
	if (value.code !== undefined && (!Number.isInteger(value.code) || value.code < 100)) {
		throw new Error(`Lychee report contains an invalid status code for ${url}`);
	}
	return { text: value.text, code: value.code };
}

function parseRedirects(value, url) {
	if (
		!value ||
		typeof value !== "object" ||
		Array.isArray(value) ||
		parseUrl(value.origin, "redirect origin").href !== url ||
		!Array.isArray(value.redirects) ||
		value.redirects.length === 0
	) {
		throw new Error(`Lychee report contains an invalid redirect chain for ${url}`);
	}

	return value.redirects.map((redirect) => {
		if (
			!redirect ||
			typeof redirect !== "object" ||
			Array.isArray(redirect) ||
			!Number.isInteger(redirect.code)
		) {
			throw new Error(`Lychee report contains an invalid redirect for ${url}`);
		}
		return { url: parseUrl(redirect.url, "redirect URL").href, code: redirect.code };
	});
}

function parseUrl(value, label) {
	try {
		return new URL(value);
	} catch {
		throw new Error(`Lychee report contains an invalid ${label}: ${value}`);
	}
}

function renderLink(link) {
	const sources = [...link.sources]
		.map(routePath)
		.sort((a, b) => a.localeCompare(b))
		.map((source) => `<code>${escapeHtml(source)}</code>`)
		.join("<br>");
	return `| <${escapeCell(link.url)}> | ${escapeCell(statusLabel(link))} | ${sources} |`;
}

function statusLabel(link) {
	if (link.kind === "error") return `Failed: ${link.status.text}`;
	if (link.kind === "timeout") return link.status.text;
	if (link.redirects) {
		const codes = link.redirects.map((redirect) => redirect.code).join(" -> ");
		return `Redirected: ${codes} -> ${link.status.text}`;
	}
	if (link.status.code === 403) return `Accepted: ${link.status.text}`;
	return link.status.text;
}

function statusPriority(link) {
	if (link.kind === "error") return 0;
	if (link.kind === "timeout") return 1;
	if (link.redirects) return 2;
	if (link.status.code === 403) return 3;
	return 4;
}

function routePath(url) {
	const parsed = new URL(url);
	return `${parsed.pathname}${parsed.search}${parsed.hash}`;
}

function escapeCell(value) {
	return String(value).replaceAll("\\", "\\\\").replaceAll("|", "\\|").replaceAll(/\r?\n/g, " ");
}

function escapeHtml(value) {
	return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

async function readReport(reportPath) {
	try {
		return await readFile(reportPath, "utf8");
	} catch (error) {
		if (error?.code === "ENOENT") {
			throw new Error(`Lychee report is missing: ${reportPath}`, { cause: error });
		}
		throw error;
	}
}

async function outputSummary(summary, outputPath, jobSummaryPath) {
	await mkdir(dirname(outputPath), { recursive: true });
	await writeFile(outputPath, `${summary}\n`);
	if (jobSummaryPath) await appendFile(jobSummaryPath, `${summary}\n`);
	else process.stdout.write(`${summary}\n`);
}
