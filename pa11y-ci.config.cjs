const isMobile = process.env.PA11Y_DEVICE === "mobile";
const reportPath = process.env.PA11Y_REPORT_PATH;
const chromePath = process.env.PA11Y_CHROME_PATH;

module.exports = {
	defaults: {
		...(chromePath ? { chromeLaunchConfig: { executablePath: chromePath } } : {}),
		concurrency: 1,
		levelCapWhenNeedsReview: "warning",
		reporters: reportPath ? ["cli", ["json", { fileName: reportPath }]] : ["cli"],
		runners: ["axe", "htmlcs"],
		standard: "WCAG2AA",
		timeout: 60_000,
		useIncognitoBrowserContext: false,
		viewport: isMobile
			? { width: 390, height: 844, deviceScaleFactor: 1, isMobile: true }
			: { width: 1280, height: 1024, deviceScaleFactor: 1, isMobile: false }
	}
};
