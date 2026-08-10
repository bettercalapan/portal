import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Header from "./header.svelte";

describe("Header search", () => {
	it("closes when focus leaves the search widget", async () => {
		const screen = await render(Header);
		const toggle = screen.getByRole("button", { name: "Toggle search input" });
		const input = screen.getByRole("textbox", { name: "Search BetterCalapan.org" });
		const form = screen.container.querySelector("form.search-input-wrapper") as HTMLFormElement;

		await toggle.click();
		await input.fill("business permit");
		expect(form.hasAttribute("inert")).toBe(false);

		(screen.container.querySelector(".back-home") as HTMLAnchorElement).focus();

		await expect.poll(() => form.hasAttribute("inert")).toBe(true);
	});

	it("stays open while focus moves between search controls", async () => {
		const screen = await render(Header);
		const toggle = screen.getByRole("button", { name: "Toggle search input" });
		const input = screen.getByRole("textbox", { name: "Search BetterCalapan.org" });

		await toggle.click();
		await input.fill("business permit");
		(screen.container.querySelector(".search-input-button") as HTMLButtonElement).focus();

		await expect.element(input).toBeVisible();
	});

	it("still opens and closes from the toggle", async () => {
		const screen = await render(Header);
		const toggle = screen.getByRole("button", { name: "Toggle search input" });
		const form = screen.container.querySelector("form.search-input-wrapper") as HTMLFormElement;

		await toggle.click();
		expect(form.hasAttribute("inert")).toBe(false);

		await toggle.click();

		expect(form.hasAttribute("inert")).toBe(true);
	});
});
