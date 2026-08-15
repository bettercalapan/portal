import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Layout from "./root-layout.test-harness.svelte";

describe("root layout skip link", () => {
	it("links to and focuses the main content region", async () => {
		const screen = await render(Layout);
		const skipLink = screen.getByRole("link", { name: "Skip to main content" });
		const main = screen.container.querySelector("main");

		expect(skipLink.element().getAttribute("href")).toBe("#main-content");
		expect(main).not.toBeNull();
		expect(main?.id).toBe("main-content");
		expect(main?.getAttribute("tabindex")).toBe("-1");

		(skipLink.element() as HTMLAnchorElement).click();

		expect(main?.ownerDocument.activeElement).toBe(main);
		expect(main?.ownerDocument.defaultView?.getComputedStyle(main).outlineStyle).toBe("none");
	});
});
