import { describe, expect, it } from "vitest";
import { extractSitemapUrls } from "./lychee.mjs";

describe("extractSitemapUrls", () => {
	it("extracts local page URLs and decodes XML entities", () => {
		const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url><loc>http://localhost:4173/</loc></url>
	<url><loc>http://localhost:4173/search?term=health&amp;office=city</loc></url>
</urlset>`;

		expect(extractSitemapUrls(xml, "http://localhost:4173/sitemap.xml")).toEqual([
			"http://localhost:4173/",
			"http://localhost:4173/search?term=health&office=city"
		]);
	});

	it("rejects page URLs outside the preview origin", () => {
		const xml = "<urlset><url><loc>https://bettercalapan.org/</loc></url></urlset>";

		expect(() => extractSitemapUrls(xml, "http://localhost:4173/sitemap.xml")).toThrow(
			"Sitemap URL must use the preview origin"
		);
	});

	it("rejects an empty sitemap", () => {
		expect(() =>
			extractSitemapUrls("<urlset></urlset>", "http://localhost:4173/sitemap.xml")
		).toThrow("Sitemap does not contain any page URLs");
	});
});
