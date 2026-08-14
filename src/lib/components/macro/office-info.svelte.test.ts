import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import OfficeInfo from "./office-info.svelte";

describe("OfficeInfo", () => {
	it("renders office contacts as links", async () => {
		const screen = await render(OfficeInfo, {
			office: {
				id: "test-office",
				name: "Test Office",
				address: "Test address",
				hours: "Weekdays",
				contacts: [
					{ kind: "email", value: "office@example.com" },
					{ kind: "phone", value: "(043) 288-2412", phoneType: "landline" }
				],
				source: {
					sources: [{ name: "Test source", url: "https://example.com" }],
					lastVerified: "2026-08-14"
				}
			}
		});

		await expect
			.element(screen.getByRole("link", { name: "office@example.com" }))
			.toHaveAttribute("href", "mailto:office@example.com");
		await expect
			.element(screen.getByRole("link", { name: "(043) 288-2412" }))
			.toHaveAttribute("href", "tel:0432882412");
	});
});
