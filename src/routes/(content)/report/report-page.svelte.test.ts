import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import ReportPage from "./+page.svelte";

describe("Report page", () => {
	it("shows policy and support links as related content", async () => {
		const screen = await render(ReportPage, {
			data: { initialPageUrl: "", turnstileSiteKey: "" },
			form: null
		});

		const relatedContent = screen.container.querySelector("aside");
		expect(relatedContent?.querySelector("h2")?.textContent).toBe("Related content");
		expect(
			relatedContent?.querySelector<HTMLAnchorElement>('a[href="/accessibility"]')?.textContent
		).toContain("Accessibility");
		expect(
			relatedContent?.querySelector<HTMLAnchorElement>('a[href="/privacy-policy"]')?.textContent
		).toContain("Privacy Policy");
		expect(
			relatedContent?.querySelector<HTMLAnchorElement>('a[href="/contact"]')?.textContent
		).toContain("Contact");
	});
});
