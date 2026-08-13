import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Source from "./source.svelte";

describe("Source", () => {
	it("renders source links without provenance metadata", async () => {
		const screen = await render(Source, {
			source: {
				sources: [{ name: "Example source", url: "https://example.gov.ph/data" }],
				lastVerified: "2026-08-12",
				asOf: "1 July 2024",
				methodology: "Official published count.",
				note: "Figures may change after publication."
			}
		});

		const region = screen.getByRole("complementary", { name: "Data source" });
		const source = screen.getByRole("link", { name: "Example source" });

		await expect.element(region).toBeVisible();
		await expect.element(source).toHaveAttribute("href", "https://example.gov.ph/data");
		await expect.element(source).toHaveAttribute("target", "_blank");
		await expect.element(screen.getByText("Source from Example source.")).toBeVisible();
		expect(screen.container.textContent).not.toContain("Last verified");
		expect(screen.container.textContent).not.toContain("1 July 2024");
		expect(screen.container.textContent).not.toContain("Official published count.");
		expect(screen.container.textContent).not.toContain("Figures may change after publication.");
	});

	it("renders multiple source links inline", async () => {
		const screen = await render(Source, {
			source: {
				sources: [
					{ name: "First source", url: "https://example.gov.ph/first" },
					{ name: "Second source", url: "https://example.gov.ph/second" }
				],
				lastVerified: "2026-08-12"
			}
		});

		await expect.element(screen.getByText("Sources:")).toBeVisible();
		await expect
			.element(screen.getByRole("link", { name: "First source" }))
			.toHaveAttribute("href", "https://example.gov.ph/first");
		await expect
			.element(screen.getByRole("link", { name: "Second source" }))
			.toHaveAttribute("href", "https://example.gov.ph/second");
	});
});
