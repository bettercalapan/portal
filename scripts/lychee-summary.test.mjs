import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parseLycheeReport, renderLycheeSummary, writeLycheeSummary } from "./lychee-summary.mjs";

const report = {
	total: 10,
	unique: 6,
	successful: 4,
	unknown: 0,
	unsupported: 0,
	timeouts: 1,
	redirects: 1,
	errors: 1,
	detailed_stats: true,
	success_map: {
		"http://localhost:4173/": [
			{ url: "https://example.com/", status: { text: "200 OK", code: 200 } },
			{ url: "https://blocked.example/", status: { text: "403 Forbidden", code: 403 } },
			{
				url: "http://redirect.example/",
				status: { text: "200 OK", code: 200 },
				redirects: {
					origin: "http://redirect.example/",
					redirects: [{ url: "https://redirect.example/", code: 301 }]
				}
			}
		],
		"http://localhost:4173/sitemap": [
			{ url: "https://example.com/", status: { text: "200 OK", code: 200 } },
			{
				url: "http://redirect.example/",
				status: { text: "OK (cached)", code: 200 }
			}
		]
	},
	error_map: {
		"http://localhost:4173/statistics": [
			{ url: "https://missing.example/", status: { text: "404 Not Found", code: 404 } }
		]
	},
	timeout_map: {
		"http://localhost:4173/contact": [
			{
				url: "https://slow.example/",
				status: { text: "Timeout", details: "Request timed out" }
			}
		]
	}
};

describe("parseLycheeReport", () => {
	it("deduplicates links and aggregates their source pages", () => {
		const parsed = parseLycheeReport(report);
		const example = parsed.links.find((link) => link.url === "https://example.com/");
		const redirected = parsed.links.find((link) => link.url === "http://redirect.example/");

		expect(parsed.links).toHaveLength(5);
		expect(example.sources).toEqual(["http://localhost:4173/", "http://localhost:4173/sitemap"]);
		expect(redirected).toMatchObject({
			status: { text: "200 OK", code: 200 },
			sources: ["http://localhost:4173/", "http://localhost:4173/sitemap"]
		});
	});

	it("requires detailed results without unknown or unsupported links", () => {
		expect(() => parseLycheeReport({ ...report, detailed_stats: false })).toThrow(
			"does not contain detailed link results"
		);
		expect(() => parseLycheeReport({ ...report, unknown: 1 })).toThrow(
			"contains 1 unknown and 0 unsupported results"
		);
	});
});

describe("renderLycheeSummary", () => {
	it("lists every unique link with its status and source pages", () => {
		const summary = renderLycheeSummary(parseLycheeReport(report));

		expect(summary).toContain("5 unique external HTTP(S) links");
		expect(summary).toContain("| 1 | 1 | 1 | 1 | 1 |");
		expect(summary).toContain(
			"| <https://missing.example/> | Failed: 404 Not Found | <code>/statistics</code> |"
		);
		expect(summary).toContain("Accepted: 403 Forbidden");
		expect(summary).toContain("Redirected: 301 -> 200 OK");
		expect(summary).toContain("<code>/</code><br><code>/sitemap</code>");
	});
});

describe("writeLycheeSummary", () => {
	it("writes the Markdown report and appends the GitHub job summary", async () => {
		const directory = await mkdtemp(join(tmpdir(), "lychee-summary-"));
		const reportPath = join(directory, "results.json");
		const outputPath = join(directory, "summary.md");
		const jobSummaryPath = join(directory, "job-summary.md");

		try {
			await writeFile(reportPath, JSON.stringify(report));
			await writeLycheeSummary(reportPath, outputPath, jobSummaryPath);

			expect(await readFile(outputPath, "utf8")).toContain("5 unique external HTTP(S) links");
			expect(await readFile(jobSummaryPath, "utf8")).toContain("5 unique external HTTP(S) links");
		} finally {
			await rm(directory, { recursive: true, force: true });
		}
	});

	it("publishes an unavailable summary when the JSON report is missing", async () => {
		const directory = await mkdtemp(join(tmpdir(), "lychee-summary-"));
		const outputPath = join(directory, "summary.md");
		const jobSummaryPath = join(directory, "job-summary.md");

		try {
			await expect(
				writeLycheeSummary(join(directory, "missing.json"), outputPath, jobSummaryPath, 2)
			).rejects.toThrow("Lychee report is missing");
			expect(await readFile(outputPath, "utf8")).toContain(
				"Lychee exited with code 2 before it generated a complete report"
			);
		} finally {
			await rm(directory, { recursive: true, force: true });
		}
	});
});
