const CANONICAL_ORIGIN = "https://bettercalapan.org";
const PAGE_FILE_PATTERN = /\/\+page\.(?:svelte|svx)$/;
const ROUTE_GROUP_PATTERN = /^\([^)]+\)$/;

export function getSitemapPaths(routeFiles: string[]): string[] {
	const paths = routeFiles
		.filter((routeFile) => PAGE_FILE_PATTERN.test(routeFile))
		.map((routeFile) => {
			const route = routeFile.replace(/^.*\/src\/routes/, "").replace(PAGE_FILE_PATTERN, "");
			const segments = route
				.split("/")
				.filter(Boolean)
				.filter((segment) => !ROUTE_GROUP_PATTERN.test(segment));

			if (segments.some((segment) => segment.includes("[") || segment.includes("]"))) {
				throw new Error(`Sitemap route requires concrete parameters: ${routeFile}`);
			}

			return segments.length === 0 ? "/" : `/${segments.map(encodeURIComponent).join("/")}`;
		});

	const uniquePaths = [...new Set(paths)].sort((a, b) => a.localeCompare(b));
	if (uniquePaths.length !== paths.length)
		throw new Error("Multiple page files resolve to the same sitemap URL");

	return uniquePaths;
}

export function expectRegisteredPaths(
	paths: readonly string[],
	registeredPaths: readonly string[]
) {
	const actual = [...paths].sort((a, b) => a.localeCompare(b));
	const expected = [...registeredPaths].sort((a, b) => a.localeCompare(b));
	if (actual.join("\n") !== expected.join("\n")) {
		throw new Error("Published page registry does not match sitemap routes");
	}
}

export function getSitemapOrigin(requestUrl: URL): string {
	if (["localhost", "127.0.0.1", "[::1]"].includes(requestUrl.hostname)) return requestUrl.origin;
	return CANONICAL_ORIGIN;
}

export function createSitemapXml(paths: string[], origin: string): string {
	const urls = paths
		.map((path) => `  <url><loc>${escapeXml(new URL(path, origin).href)}</loc></url>`)
		.join("\n");

	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

function escapeXml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;");
}
