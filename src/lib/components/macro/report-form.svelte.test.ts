import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import ReportForm from "./report-form.svelte";

type TestTurnstileOptions = {
	callback: () => void;
	"error-callback": () => void;
};

let renderWidget: ReturnType<typeof vi.fn>;

beforeEach(() => {
	renderWidget = vi.fn((_container: HTMLElement, options: TestTurnstileOptions) => {
		options.callback();
		return "widget-id";
	});
	Object.defineProperty(window, "turnstile", {
		configurable: true,
		value: {
			render: renderWidget,
			remove: vi.fn(),
			reset: vi.fn()
		}
	});
});

afterEach(() => {
	Reflect.deleteProperty(window, "turnstile");
	document.querySelector("script[data-turnstile]")?.remove();
});

describe("ReportForm", () => {
	it("shows an email fallback and disables submission when Turnstile is not configured", async () => {
		const screen = await render(ReportForm, { turnstileSiteKey: "" });

		await expect
			.element(screen.getByRole("alert"))
			.toHaveTextContent("Reporting is temporarily unavailable");
		await expect.element(screen.getByRole("button", { name: "Send report" })).toBeDisabled();
		await expect
			.element(screen.getByRole("link", { name: "reports@bettercalapan.org" }))
			.toHaveAttribute("href", "mailto:reports@bettercalapan.org");
	});

	it("renders preserved values and accessible field errors", async () => {
		const screen = await render(ReportForm, {
			turnstileSiteKey: "",
			form: {
				errors: { email: "Enter a valid email address, or leave this field blank." },
				values: {
					category: "accessibility",
					pageUrl: "/statistics",
					message: "The chart is difficult to understand.",
					email: "invalid"
				}
			}
		});

		await expect
			.element(screen.getByLabelText("Affected page (optional)"))
			.toHaveValue("/statistics");
		await expect
			.element(screen.getByLabelText("What went wrong? *"))
			.toHaveValue("The chart is difficult to understand.");
		await expect
			.element(screen.getByLabelText("Your email (optional)"))
			.toHaveAttribute("aria-invalid", "true");
		await expect
			.element(screen.getByText("Enter a valid email address, or leave this field blank."))
			.toBeVisible();
		await expect
			.element(screen.getByLabelText("Type of problem *"))
			.toHaveTextContent("Accessibility problem");
	});

	it("selects and serializes a report category", async () => {
		const screen = await render(ReportForm, { turnstileSiteKey: "" });
		const trigger = screen.getByLabelText("Type of problem *");

		await trigger.click();
		await screen.getByRole("option", { name: "Broken link or technical problem" }).click();

		await expect.element(trigger).toHaveTextContent("Broken link or technical problem");
		const form = screen.container.querySelector("form");
		expect(form).not.toBeNull();
		expect(new FormData(form ?? undefined).get("category")).toBe("technical");
	});

	it("associates category errors with the Select trigger", async () => {
		const screen = await render(ReportForm, {
			turnstileSiteKey: "",
			form: {
				errors: { category: "Choose the type of problem you found." },
				values: { category: "", pageUrl: "", message: "A report", email: "" }
			}
		});
		const trigger = screen.getByLabelText("Type of problem *");

		await expect.element(trigger).toHaveAttribute("aria-invalid", "true");
		await expect.element(trigger).toHaveAttribute("aria-describedby", "category-error");
	});

	it("resets the selected category after a successful submission", async () => {
		const screen = await render(ReportForm, {
			turnstileSiteKey: ""
		});
		const trigger = screen.getByLabelText("Type of problem *");
		await trigger.click();
		await screen.getByRole("option", { name: "Incorrect or outdated content" }).click();
		await expect.element(trigger).toHaveTextContent("Incorrect or outdated content");

		await screen.rerender({ turnstileSiteKey: "", form: { success: true } });

		await expect.element(trigger).toHaveTextContent("Choose one");
	});

	it("prefills the affected page without requiring an email", async () => {
		const screen = await render(ReportForm, {
			turnstileSiteKey: "site-key",
			initialPageUrl: "/services/business"
		});

		await expect
			.element(screen.getByLabelText("Affected page (optional)"))
			.toHaveValue("/services/business");
		await expect.element(screen.getByLabelText("Your email (optional)")).not.toBeRequired();
		await expect.element(screen.getByRole("button", { name: "Send report" })).toBeEnabled();
		expect(renderWidget).toHaveBeenCalledOnce();
		expect(renderWidget).toHaveBeenCalledWith(
			expect.any(HTMLElement),
			expect.objectContaining({ appearance: "interaction-only" })
		);
	});

	it("shows the fallback and keeps submission disabled when Turnstile fails", async () => {
		renderWidget.mockImplementation((_container: HTMLElement, options: TestTurnstileOptions) => {
			options["error-callback"]();
			return "widget-id";
		});

		const screen = await render(ReportForm, { turnstileSiteKey: "site-key" });

		await expect.element(screen.getByRole("button", { name: "Send report" })).toBeDisabled();
		await expect
			.element(screen.getByRole("alert"))
			.toHaveTextContent("Reporting is temporarily unavailable");
	});

	it("removes a script that loads without the Turnstile API", async () => {
		Reflect.deleteProperty(window, "turnstile");
		const screen = await render(ReportForm, { turnstileSiteKey: "site-key" });
		const script = document.querySelector<HTMLScriptElement>("script[data-turnstile]");

		expect(script).not.toBeNull();
		script?.dispatchEvent(new Event("load"));

		await expect
			.element(screen.getByRole("alert"))
			.toHaveTextContent("Reporting is temporarily unavailable");
		expect(document.querySelector("script[data-turnstile]")).toBeNull();
	});

	it("announces a successful submission", async () => {
		const screen = await render(ReportForm, {
			turnstileSiteKey: "site-key",
			form: { success: true }
		});

		await expect
			.element(screen.getByRole("status"))
			.toHaveTextContent("Thank you. Your report has been sent to the BetterCalapan maintainers.");
	});

	it("renders report form text at no less than 18 pixels", async () => {
		const screen = await render(ReportForm, { turnstileSiteKey: "" });
		const trigger = screen.getByLabelText("Type of problem *");
		await trigger.click();

		const elements = [
			screen.container.querySelector("label"),
			screen.container.querySelector("input[name='pageUrl']"),
			screen.container.querySelector("textarea"),
			screen.container.querySelector(".help"),
			screen.container.querySelector("button[type='submit']"),
			document.querySelector(".report-select-trigger"),
			document.querySelector(".report-select-item")
		];

		for (const element of elements) {
			expect(element).not.toBeNull();
			expect(
				Number.parseFloat(getComputedStyle(element as Element).fontSize)
			).toBeGreaterThanOrEqual(18);
		}
	});
});
