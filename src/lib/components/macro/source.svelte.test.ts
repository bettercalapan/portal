import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Source from "./source.svelte";

describe("Source", () => {
	it("uses singular wording for one source", async () => {
		const screen = await render(Source, {
			source: {
				sources: [{ name: "Example source", url: "https://example.gov.ph/data" }],
				lastVerified: "2026-08-12",
				asOf: "1 July 2024",
				methodology: "Official published count."
			}
		});

		const region = screen.getByRole("complementary", {
			name: "Data source and verification"
		});
		const source = screen.getByRole("link", { name: "Example source" });

		await expect.element(region).toBeVisible();
		await expect.element(source).toHaveAttribute("href", "https://example.gov.ph/data");
		await expect.element(source).toHaveAttribute("target", "_blank");
		await expect.element(screen.getByText("Source from Example source.")).toBeVisible();
	});

	it("uses plural wording for multiple sources", async () => {
		const screen = await render(Source, {
			source: {
				sources: [
					{ name: "First source", url: "https://example.gov.ph/first" },
					{ name: "Second source", url: "https://example.gov.ph/second" }
				],
				lastVerified: "2026-08-12"
			}
		});

		await expect.element(screen.getByText("Sources: First source, Second source.")).toBeVisible();
		await expect
			.element(screen.getByRole("link", { name: "First source" }))
			.toHaveAttribute("href", "https://example.gov.ph/first");
		await expect
			.element(screen.getByRole("link", { name: "Second source" }))
			.toHaveAttribute("href", "https://example.gov.ph/second");
	});
});
