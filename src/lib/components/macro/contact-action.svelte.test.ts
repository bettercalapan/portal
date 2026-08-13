import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import ContactAction from "./contact-action.svelte";

describe("ContactAction", () => {
	it("shows a checkmark confirmation after copying", async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		Object.defineProperty(navigator, "clipboard", {
			configurable: true,
			value: { writeText }
		});

		const screen = await render(ContactAction, {
			phone: "09123456789",
			phoneType: "mobile"
		});
		const button = screen.getByRole("button", { name: "Copy 0912 345 6789" });

		await button.click();

		expect(writeText).toHaveBeenCalledWith("09123456789");
		await expect.element(screen.getByRole("button", { name: "Copied" })).toBeVisible();
		await expect.element(screen.getByText("Copied to clipboard.")).toBeInTheDocument();
	});
});
