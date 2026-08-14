import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import ContactAction from "./contact-action.svelte";

describe("ContactAction", () => {
	it("renders email as a mailto link", async () => {
		const screen = await render(ContactAction, {
			method: { kind: "email", value: "contact@example.com" }
		});

		await expect
			.element(screen.getByRole("link", { name: "contact@example.com" }))
			.toHaveAttribute("href", "mailto:contact@example.com");
	});

	it("renders formatted phone text as a telephone link", async () => {
		const screen = await render(ContactAction, {
			method: { kind: "phone", value: "(043) 288-7508", phoneType: "landline" }
		});

		await expect
			.element(screen.getByRole("link", { name: "(043) 288-7508" }))
			.toHaveAttribute("href", "tel:0432887508");
	});

	it("preserves the plus sign in international phone links", async () => {
		const screen = await render(ContactAction, {
			method: { kind: "phone", value: "+63432882496", phoneType: "landline" }
		});

		await expect
			.element(screen.getByRole("link", { name: "(043) 288-2496" }))
			.toHaveAttribute("href", "tel:+63432882496");
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
