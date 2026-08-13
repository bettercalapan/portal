import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import ContactAction from "./contact-action.svelte";

describe("ContactAction", () => {
	it("renders email as copyable text rather than a link", async () => {
		const screen = await render(ContactAction, {
			method: { kind: "email", value: "contact@example.com" }
		});

		await expect.element(screen.getByText("contact@example.com")).toBeVisible();
		expect(screen.container.querySelector('a[href="mailto:contact@example.com"]')).toBeNull();
	});

	it("renders formatted phone text rather than a telephone link", async () => {
		const screen = await render(ContactAction, {
			method: { kind: "phone", value: "(043) 288-7508", phoneType: "landline" }
		});

		await expect.element(screen.getByText("(043) 288-7508")).toBeVisible();
		expect(screen.container.querySelector('a[href="tel:0432887508"]')).toBeNull();
	});

	it("shows a checkmark confirmation after copying", async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		Object.defineProperty(navigator, "clipboard", {
			configurable: true,
			value: { writeText }
		});

		const screen = await render(ContactAction, {
			method: { kind: "phone", value: "09123456789", phoneType: "mobile" }
		});
		const button = screen.getByRole("button", { name: "Copy 0912 345 6789" });

		await button.click();

		expect(writeText).toHaveBeenCalledWith("09123456789");
		await expect.element(screen.getByRole("button", { name: "Copied" })).toBeVisible();
		await expect.element(screen.getByText("Copied to clipboard.")).toBeInTheDocument();
	});
});
