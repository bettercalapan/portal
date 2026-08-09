import { describe, expect, it } from "vitest";
import { parseBenchmarkResults, renderBenchmarkSummary } from "./benchmark-summary.mjs";

const validResults = [
	{
		path: "/",
		score: 0.94,
		performance: 0.91,
		accessibility: 0.98,
		"best-practices": 0.95,
		seo: 0.93
	},
	{
		path: "/services",
		score: 0.89,
		performance: 0.88,
		accessibility: 0.96,
		"best-practices": 0.9,
		seo: 0.91
	}
];

describe("parseBenchmarkResults", () => {
	it("rejects empty reports", () => {
		expect(() => parseBenchmarkResults([])).toThrow("did not produce any route results");
	});

	it("rejects reports with missing categories", () => {
		expect(() => parseBenchmarkResults([{ ...validResults[0], seo: undefined }])).toThrow(
			"missing seo"
		);
	});
});

describe("renderBenchmarkSummary", () => {
	it("renders averages, failures, and the lowest routes", () => {
		const summary = renderBenchmarkSummary("mobile", validResults);

		expect(summary).toContain("## Lighthouse: Mobile");
		expect(summary).toContain("2 routes audited with a minimum category score of 90");
		expect(summary).toContain("| 90 | 97 | 93 | 92 |");
		expect(summary).toContain("### Budget failures (1)");
		expect(summary).toContain("| /services | 88 | 96 | 90 | 91 |");
	});

	it("reports when every route passes", () => {
		expect(renderBenchmarkSummary("desktop", validResults)).toContain(
			"All routes passed the score budget."
		);
	});
});
