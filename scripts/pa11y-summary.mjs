import { appendFile, readFile } from "node:fs/promises";

const ISSUE_TYPES = new Set(["error", "warning", "notice"]);

export function parsePa11yReport(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) {
		throw new Error("Pa11y did not produce a valid report");
	}

	for (const field of ["total", "passes", "errors"]) {
		if (!Number.isInteger(value[field]) || value[field] < 0) {
			throw new Error(`Pa11y report has an invalid ${field} count`);
		}
	}

	if (!value.results || typeof value.results !== "object" || Array.isArray(value.results)) {
		throw new Error("Pa11y report is missing route results");
	}

	const entries = Object.entries(value.results);
	if (value.total === 0 || entries.length !== value.total) {
		throw new Error("Pa11y report route count does not match its results");
	}

	const routes = entries.map(([url, issues]) => {
		try {
			new URL(url);
		} catch {
			throw new Error(`Pa11y report contains an invalid route URL: ${url}`);
		}

		if (!Array.isArray(issues)) {
			throw new Error(`Pa11y report contains invalid results for ${url}`);
		}

		return {
			url,
			issues: issues.map((issue) => parseIssue(url, issue))
		};
	});

	const passes = routes.filter((route) => route.issues.length === 0).length;
	if (passes !== value.passes) {
		throw new Error("Pa11y report pass count does not match its results");
	}

	const errors = routes.reduce(
		(total, route) => total + route.issues.filter((issue) => issue.kind === "accessibility").length,
		0
	);
	if (errors !== value.errors) {
		throw new Error("Pa11y report error count does not match its results");
	}

	return { total: value.total, passes, errors, routes };
}

export function renderPa11ySummary(device, report) {
	if (!["mobile", "desktop"].includes(device)) {
		throw new Error(`Unknown Pa11y device: ${device}`);
	}

	const label = device[0].toUpperCase() + device.slice(1);
	const failingRoutes = report.routes.filter((route) => route.issues.length > 0);
	const accessibilityRoutes = failingRoutes.filter((route) =>
		route.issues.some((issue) => issue.kind === "accessibility")
	);
	const technicalRoutes = failingRoutes.filter((route) =>
		route.issues.some((issue) => issue.kind === "technical")
	);
	const technicalFailures = technicalRoutes.reduce(
		(total, route) => total + route.issues.filter((issue) => issue.kind === "technical").length,
		0
	);
	const lines = [
		`## Pa11y: ${label}`,
		"",
		`${report.total} routes audited against WCAG 2 AA with axe and HTML CodeSniffer.`,
		"",
		"| Passed routes | Failed routes | Accessibility errors | Technical failures |",
		"| ---: | ---: | ---: | ---: |",
		`| ${report.passes} | ${failingRoutes.length} | ${report.errors} | ${technicalFailures} |`,
		""
	];

	if (failingRoutes.length === 0) {
		lines.push("All routes passed the accessibility checks.", "");
	}

	if (accessibilityRoutes.length > 0) {
		lines.push(
			`### Accessibility failures (${accessibilityRoutes.length})`,
			"",
			"| Route | Errors | Rules |",
			"| --- | ---: | --- |",
			...accessibilityRoutes.map(renderAccessibilityRoute),
			"",
			"See the job log for selectors, HTML context, and remediation links.",
			""
		);
	}

	if (technicalRoutes.length > 0) {
		lines.push(
			`### Technical failures (${technicalFailures})`,
			"",
			"| Route | Error |",
			"| --- | --- |",
			...technicalRoutes.flatMap((route) =>
				route.issues
					.filter((issue) => issue.kind === "technical")
					.map((issue) => `| ${escapeCell(routePath(route.url))} | ${escapeCell(issue.message)} |`)
			),
			""
		);
	}

	return lines.join("\n");
}

export async function writePa11ySummary(
	device,
	reportPath,
	summaryPath = process.env.GITHUB_STEP_SUMMARY,
	scanStatus = 0
) {
	try {
		const report = parsePa11yReport(JSON.parse(await readReport(reportPath)));
		await outputSummary(renderPa11ySummary(device, report), summaryPath);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		const label = device[0].toUpperCase() + device.slice(1);
		const summaryMessage =
			scanStatus === 0
				? `Accessibility summary unavailable: ${message}`
				: `Pa11y exited with code ${scanStatus} before it generated a report. See the job log for the primary error.`;
		await outputSummary(`## Pa11y: ${label}\n\n${summaryMessage}\n`, summaryPath);
		throw error;
	}
}

function parseIssue(url, issue) {
	if (!issue || typeof issue !== "object" || Array.isArray(issue)) {
		throw new Error(`Pa11y report contains an invalid issue for ${url}`);
	}

	if (
		typeof issue.code === "string" &&
		typeof issue.message === "string" &&
		typeof issue.runner === "string" &&
		ISSUE_TYPES.has(issue.type)
	) {
		return {
			kind: "accessibility",
			code: issue.code,
			message: issue.message,
			runner: issue.runner,
			type: issue.type
		};
	}

	if (typeof issue.message === "string") {
		return { kind: "technical", message: issue.message };
	}

	throw new Error(`Pa11y report contains an invalid issue for ${url}`);
}

function renderAccessibilityRoute(route) {
	const issues = route.issues.filter((issue) => issue.kind === "accessibility");
	const rules = [...new Set(issues.map((issue) => `${issue.runner}: ${issue.code}`))];
	const displayedRules = rules.slice(0, 3);
	if (rules.length > displayedRules.length)
		displayedRules.push(`+${rules.length - displayedRules.length} more`);

	return `| ${escapeCell(routePath(route.url))} | ${issues.length} | ${displayedRules.map(escapeCell).join("<br>")} |`;
}

function routePath(url) {
	const parsed = new URL(url);
	return `${parsed.pathname}${parsed.search}${parsed.hash}`;
}

function escapeCell(value) {
	return String(value).replaceAll("\\", "\\\\").replaceAll("|", "\\|").replaceAll(/\r?\n/g, " ");
}

async function readReport(reportPath) {
	try {
		return await readFile(reportPath, "utf8");
	} catch (error) {
		if (error?.code === "ENOENT") {
			throw new Error(`Pa11y report is missing: ${reportPath}`, { cause: error });
		}
		throw error;
	}
}

async function outputSummary(summary, summaryPath) {
	if (summaryPath) await appendFile(summaryPath, `${summary}\n`);
	else process.stdout.write(`${summary}\n`);
}
