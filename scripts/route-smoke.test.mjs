import { describe, expect, it } from "vitest";
import {
	extractUniqueSitemapUrls,
	isHtmlContentType,
	isXmlContentType,
	validateRouteResponse
} from "./route-smoke.mjs";

describe("extractUniqueSitemapUrls", () => {
	it("rejects duplicate sitemap URLs", () => {
		const xml = `<urlset>
	<url><loc>http://localhost:4173/</loc></url>
	<url><loc>http://localhost:4173/</loc></url>
</urlset>`;

		expect(() => extractUniqueSitemapUrls(xml, "http://localhost:4173/sitemap.xml")).toThrow(
			"Sitemap contains duplicate page URLs"
		);
	});
});

describe("content type validation", () => {
	it("accepts XML media types", () => {
		expect(isXmlContentType("application/xml; charset=utf-8")).toBe(true);
		expect(isXmlContentType("application/sitemap+xml")).toBe(true);
		expect(isXmlContentType("text/html")).toBe(false);
	});

	it("accepts HTML media types", () => {
		expect(isHtmlContentType("text/html; charset=utf-8")).toBe(true);
		expect(isHtmlContentType("application/xhtml+xml")).toBe(true);
		expect(isHtmlContentType("application/json")).toBe(false);
	});
});

describe("validateRouteResponse", () => {
	it("rejects cross-origin final redirects", () => {
		expect(() =>
			validateRouteResponse("http://localhost:4173/services", {
				ok: true,
				status: 200,
				statusText: "OK",
				contentType: "text/html",
				finalUrl: "https://example.com/"
			})
		).toThrow("Route redirected outside the preview origin");
	});

	it("rejects successful non-HTML responses", () => {
		expect(() =>
			validateRouteResponse("http://localhost:4173/services", {
				ok: true,
				status: 200,
				statusText: "OK",
				contentType: "application/json",
				finalUrl: "http://localhost:4173/services"
			})
		).toThrow("Route did not return HTML");
	});
});
