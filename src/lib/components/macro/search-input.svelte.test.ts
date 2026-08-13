import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import SearchInput from "./search-input.svelte";

const SEARCH_DURATION = 500;

describe("SearchInput", () => {
	it("hides results when focus leaves the search widget", async () => {
		const screen = await render(SearchInput, { term: "", showResults: false });
		const input = screen.getByRole("textbox", { name: "Search BetterCalapan.org" });

		await input.fill("business permit");
		await expect
			.element(screen.getByRole("link", { name: "Business Permit service", exact: true }))
			.toBeVisible();

		(screen.container.querySelector("input") as HTMLInputElement).blur();

		await expect
			.element(screen.getByRole("link", { name: "Business Permit service", exact: true }))
			.not.toBeInTheDocument();
	});

	it("does not show pending results after losing focus", async () => {
		const screen = await render(SearchInput, { term: "", showResults: false });
		const input = screen.getByRole("textbox", { name: "Search BetterCalapan.org" });

		await input.fill("business permit");
		(screen.container.querySelector("input") as HTMLInputElement).blur();
		await new Promise((resolve) => setTimeout(resolve, SEARCH_DURATION + 50));

		await expect
			.element(screen.getByRole("link", { name: "Business Permit service", exact: true }))
			.not.toBeInTheDocument();
	});

	it("keeps results open while focus moves to a result", async () => {
		const screen = await render(SearchInput, { term: "", showResults: false });
		const input = screen.getByRole("textbox", { name: "Search BetterCalapan.org" });

		await input.fill("business permit");
		const result = screen.getByRole("link", { name: "Business Permit service", exact: true });
		await expect.element(result).toBeVisible();

		(screen.container.querySelector("a") as HTMLAnchorElement).focus();

		await expect.element(result).toBeVisible();
	});

	it("restores matching results when refocused", async () => {
		const screen = await render(SearchInput, { term: "", showResults: false });
		const input = screen.getByRole("textbox", { name: "Search BetterCalapan.org" });
		const inputElement = screen.container.querySelector("input") as HTMLInputElement;

		await input.fill("business permit");
		const result = screen.getByRole("link", { name: "Business Permit service", exact: true });
		await expect.element(result).toBeVisible();
		inputElement.blur();
		await expect.element(result).not.toBeInTheDocument();

		inputElement.focus();

		await expect.element(result).toBeVisible();
	});
});
