import { appendFile, readFile } from "node:fs/promises";

const CATEGORY_LABELS = {
	performance: "Performance",
	accessibility: "Accessibility",
	"best-practices": "Best practices",
	seo: "SEO"
};
const BUDGETS = { mobile: 90, desktop: 70 };

export function parseBenchmarkResults(value) {
	if (!Array.isArray(value) || value.length === 0) {
		throw new Error("Unlighthouse did not produce any route results");
	}

	return value.map((result) => {
		if (!result || typeof result.path !== "string") {
			throw new Error("Unlighthouse produced a result without a route path");
		}

		for (const category of Object.keys(CATEGORY_LABELS)) {
			if (
				typeof result[category] !== "number" ||
				!Number.isFinite(result[category]) ||
				result[category] < 0 ||
				result[category] > 1
			) {
				throw new Error(`Unlighthouse result for ${result.path} is missing ${category}`);
			}
		}

		return result;
	});
}

export function renderBenchmarkSummary(device, results) {
	const budget = BUDGETS[device];
	if (!budget) throw new Error(`Unknown benchmark device: ${device}`);

	const categories = Object.keys(CATEGORY_LABELS);
	const averages = Object.fromEntries(
		categories.map((category) => [
			category,
			results.reduce((total, result) => total + result[category], 0) / results.length
		])
	);
	const failingRoutes = results.filter((result) =>
		categories.some((category) => result[category] * 100 < budget)
	);
	const lowestRoutes = [...results]
		.sort(
			(a, b) =>
				lowestScore(a, categories) - lowestScore(b, categories) || a.path.localeCompare(b.path)
		)
		.slice(0, 5);

	const lines = [
		`## Lighthouse: ${device[0].toUpperCase()}${device.slice(1)}`,
		"",
		`${results.length} routes audited with a minimum category score of ${budget}.`,
		"",
		"| Performance | Accessibility | Best practices | SEO |",
		"| ---: | ---: | ---: | ---: |",
		`| ${categories.map((category) => toPercent(averages[category])).join(" | ")} |`,
		""
	];

	if (failingRoutes.length === 0) {
		lines.push("All routes passed the score budget.", "");
	} else {
		lines.push(
			`### Budget failures (${failingRoutes.length})`,
			"",
			...renderRouteTable(failingRoutes, categories),
			""
		);
	}

	lines.push("### Lowest scoring routes", "", ...renderRouteTable(lowestRoutes, categories), "");
	return lines.join("\n");
}

export async function writeBenchmarkSummary(
	device,
	resultPath,
	summaryPath = process.env.GITHUB_STEP_SUMMARY
) {
	try {
		const results = parseBenchmarkResults(JSON.parse(await readResult(resultPath)));
		await outputSummary(renderBenchmarkSummary(device, results), summaryPath);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		const label = device[0].toUpperCase() + device.slice(1);
		await outputSummary(
			`## Lighthouse: ${label}\n\nBenchmark summary unavailable: ${message}\n`,
			summaryPath
		);
		throw error;
	}
}

async function readResult(resultPath) {
	try {
		return await readFile(resultPath, "utf8");
	} catch (error) {
		if (error?.code === "ENOENT") {
			throw new Error(`Unlighthouse result is missing: ${resultPath}`, { cause: error });
		}
		throw error;
	}
}

async function outputSummary(summary, summaryPath) {
	if (summaryPath) await appendFile(summaryPath, `${summary}\n`);
	else process.stdout.write(`${summary}\n`);
}

function renderRouteTable(results, categories) {
	return [
		`| Route | ${categories.map((category) => CATEGORY_LABELS[category]).join(" | ")} |`,
		`| --- | ${categories.map(() => "---:").join(" | ")} |`,
		...results.map(
			(result) =>
				`| ${result.path.replaceAll("|", "\\|")} | ${categories
					.map((category) => toPercent(result[category]))
					.join(" | ")} |`
		)
	];
}

function lowestScore(result, categories) {
	return Math.min(...categories.map((category) => result[category]));
}

function toPercent(score) {
	return Math.round(score * 100);
}
