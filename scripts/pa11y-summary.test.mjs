import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parsePa11yReport, renderPa11ySummary, writePa11ySummary } from "./pa11y-summary.mjs";

const passingReport = {
	total: 2,
	passes: 2,
	errors: 0,
	results: {
		"http://localhost:4173/": [],
		"http://localhost:4173/services": []
	}
};

const failingReport = {
	total: 3,
	passes: 1,
	errors: 3,
	results: {
		"http://localhost:4173/": [],
		"http://localhost:4173/services": [
			{
				code: "color-contrast",
				message: "Elements must meet color contrast requirements",
				runner: "axe",
				type: "error"
			},
			{
				code: "color-contrast",
				message: "Another element misses color contrast",
				runner: "axe",
				type: "error"
			},
			{
				code: "WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail",
				message: "This element has insufficient contrast",
				runner: "htmlcs",
				type: "error"
			}
		],
		"http://localhost:4173/contact?source=a|b": [{ message: "Navigation | timeout" }]
	}
};

describe("parsePa11yReport", () => {
	it("normalizes passing route results", () => {
		const report = parsePa11yReport(passingReport);

		expect(report).toMatchObject({ total: 2, passes: 2, errors: 0 });
		expect(report.routes).toHaveLength(2);
	});

	it("rejects inconsistent route and error counts", () => {
		expect(() => parsePa11yReport({ ...passingReport, total: 3 })).toThrow(
			"route count does not match"
		);
		expect(() => parsePa11yReport({ ...failingReport, errors: 2 })).toThrow(
			"error count does not match"
		);
	});
});

describe("renderPa11ySummary", () => {
	it("renders a successful audit", () => {
		const summary = renderPa11ySummary("mobile", parsePa11yReport(passingReport));

		expect(summary).toContain("## Pa11y: Mobile");
		expect(summary).toContain("| 2 | 0 | 0 | 0 |");
		expect(summary).toContain("All routes passed the accessibility checks.");
	});

	it("renders accessibility and technical failures compactly", () => {
		const summary = renderPa11ySummary("desktop", parsePa11yReport(failingReport));

		expect(summary).toContain("| 1 | 2 | 3 | 1 |");
		expect(summary).toContain("| /services | 3 | axe: color-contrast<br>htmlcs:");
		expect(summary).toContain("| /contact?source=a\\|b | Navigation \\| timeout |");
	});
});

describe("writePa11ySummary", () => {
	it("publishes an unavailable summary when the report is missing", async () => {
		const directory = await mkdtemp(join(tmpdir(), "pa11y-summary-"));
		const summaryPath = join(directory, "summary.md");

		try {
			await expect(
				writePa11ySummary("mobile", join(directory, "missing.json"), summaryPath)
			).rejects.toThrow("Pa11y report is missing");
			expect(await readFile(summaryPath, "utf8")).toContain("Accessibility summary unavailable");
		} finally {
			await rm(directory, { recursive: true, force: true });
		}
	});

	it("publishes the scan exit status when Pa11y fails before reporting", async () => {
		const directory = await mkdtemp(join(tmpdir(), "pa11y-summary-"));
		const summaryPath = join(directory, "summary.md");

		try {
			await expect(
				writePa11ySummary("desktop", join(directory, "missing.json"), summaryPath, 1)
			).rejects.toThrow("Pa11y report is missing");
			expect(await readFile(summaryPath, "utf8")).toContain(
				"Pa11y exited with code 1 before it generated a report"
			);
		} finally {
			await rm(directory, { recursive: true, force: true });
		}
	});
});
