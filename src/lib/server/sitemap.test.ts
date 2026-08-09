import { describe, expect, it } from "vitest";
import { createSitemapXml, getSitemapOrigin, getSitemapPaths } from "./sitemap";

describe("getSitemapPaths", () => {
	it("converts SvelteKit page files into sorted public routes", () => {
		expect(
			getSitemapPaths([
				"/workspace/src/routes/(app)/(content)/services/+page.svx",
				"/workspace/src/routes/(app)/search/+page.svelte",
				"/workspace/src/routes/(app)/+page.svelte",
				"/workspace/src/routes/+error.svelte",
				"/workspace/src/routes/api/+server.ts"
			])
		).toEqual(["/", "/search", "/services"]);
	});

	it("rejects routes that need concrete parameter values", () => {
		expect(() =>
			getSitemapPaths(["/workspace/src/routes/(app)/services/[service]/+page.svelte"])
		).toThrow("Sitemap route requires concrete parameters");
	});

	it("rejects duplicate public routes", () => {
		expect(() =>
			getSitemapPaths([
				"/workspace/src/routes/(app)/about/+page.svelte",
				"/workspace/src/routes/(marketing)/about/+page.svx"
			])
		).toThrow("Multiple page files resolve to the same sitemap URL");
	});
});

describe("getSitemapOrigin", () => {
	it("uses the request origin for local previews", () => {
		expect(getSitemapOrigin(new URL("http://localhost:4173/sitemap.xml"))).toBe(
			"http://localhost:4173"
		);
	});

	it("uses the canonical origin for deployed previews", () => {
		expect(getSitemapOrigin(new URL("https://preview.example.workers.dev/sitemap.xml"))).toBe(
			"https://bettercalapan.org"
		);
	});
});

describe("createSitemapXml", () => {
	it("renders absolute, escaped sitemap locations", () => {
		const xml = createSitemapXml(["/", "/search?term=health&office=city"], "https://example.com");

		expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
		expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
		expect(xml).toContain("<loc>https://example.com/</loc>");
		expect(xml).toContain("<loc>https://example.com/search?term=health&amp;office=city</loc>");
	});
});
