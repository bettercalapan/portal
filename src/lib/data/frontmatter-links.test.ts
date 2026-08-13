import { describe, expect, it } from "vitest";

const pages = import.meta.glob("/src/routes/**/+page.svx", {
	eager: true,
	query: "?raw",
	import: "default"
});

describe("content frontmatter links", () => {
	it("uses public paths rather than route-group paths", () => {
		for (const [path, source] of Object.entries(pages)) {
			expect(source, path).not.toMatch(/url:\s*\/\(content\)/);
		}
	});
});
