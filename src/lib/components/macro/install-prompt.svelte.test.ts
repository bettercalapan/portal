import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import InstallPrompt from "./install-prompt.svelte";

type BeforeInstallPromptEvent = Event & {
	prompt: ReturnType<typeof vi.fn>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function createInstallEvent(outcome: "accepted" | "dismissed" = "dismissed") {
	const event = new Event("beforeinstallprompt", { cancelable: true }) as BeforeInstallPromptEvent;
	event.prompt = vi.fn().mockResolvedValue(undefined);
	event.userChoice = Promise.resolve({ outcome, platform: "web" });
	return event;
}

describe("InstallPrompt", () => {
	beforeEach(() => {
		sessionStorage.clear();
		vi.restoreAllMocks();
	});

	it("shows a custom prompt when the browser makes installation available", async () => {
		const screen = await render(InstallPrompt);
		const event = createInstallEvent();

		window.dispatchEvent(event);

		expect(event.defaultPrevented).toBe(false);
		await expect
			.element(screen.getByText("Install BetterCalapan for quick access to services."))
			.toBeVisible();
	});

	it("keeps the prompt open after a cancelled install", async () => {
		const screen = await render(InstallPrompt);
		const event = createInstallEvent();
		window.dispatchEvent(event);

		await screen.getByRole("button", { name: "Install", exact: true }).click();

		expect(event.prompt).toHaveBeenCalledOnce();
		await expect
			.element(screen.getByRole("button", { name: "Try again", exact: true }))
			.toBeVisible();
	});

	it("hides and persists when dismissed", async () => {
		const screen = await render(InstallPrompt);
		window.dispatchEvent(createInstallEvent());

		await screen.getByRole("button", { name: "Dismiss install prompt" }).click();

		await expect
			.element(screen.getByText("Install BetterCalapan for quick access to services."))
			.not.toBeInTheDocument();
	});

	it("shows again after a refresh when it was not dismissed", async () => {
		const firstRender = await render(InstallPrompt);
		window.dispatchEvent(createInstallEvent());
		await firstRender.unmount();

		const secondRender = await render(InstallPrompt);
		const event = createInstallEvent();
		window.dispatchEvent(event);

		expect(event.defaultPrevented).toBe(false);
		await expect
			.element(secondRender.getByRole("button", { name: "Install", exact: true }))
			.toBeVisible();
	});

	it("does not show again after dismissal in the same session", async () => {
		const firstRender = await render(InstallPrompt);
		window.dispatchEvent(createInstallEvent());
		await firstRender.getByRole("button", { name: "Dismiss install prompt" }).click();
		await firstRender.unmount();

		const screen = await render(InstallPrompt);
		const event = createInstallEvent();
		window.dispatchEvent(event);

		expect(event.defaultPrevented).toBe(false);
		expect(screen.container.querySelector(".install-prompt")).toBeNull();
	});

	it("shows again after a new browser session", async () => {
		const firstRender = await render(InstallPrompt);
		window.dispatchEvent(createInstallEvent());
		await firstRender.getByRole("button", { name: "Dismiss install prompt" }).click();
		await firstRender.unmount();
		sessionStorage.clear();

		const screen = await render(InstallPrompt);
		window.dispatchEvent(createInstallEvent());

		await expect
			.element(screen.getByRole("button", { name: "Install", exact: true }))
			.toBeVisible();
	});

	it("hides after installation succeeds", async () => {
		const screen = await render(InstallPrompt);
		window.dispatchEvent(createInstallEvent("accepted"));

		await screen.getByRole("button", { name: "Install", exact: true }).click();

		await expect
			.element(screen.getByText("Install BetterCalapan for quick access to services."))
			.not.toBeInTheDocument();
	});

	it("does not show in standalone mode", async () => {
		vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true } as MediaQueryList);
		const screen = await render(InstallPrompt);
		const event = createInstallEvent();

		window.dispatchEvent(event);

		expect(event.defaultPrevented).toBe(false);
		expect(screen.container.querySelector(".install-prompt")).toBeNull();
	});
});
