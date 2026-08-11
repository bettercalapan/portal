import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const runtimeEnv = vi.hoisted(() => ({
	TURNSTILE_HOSTNAMES: "bettercalapan.org",
	TURNSTILE_SECRET: "secret",
	TURNSTILE_SITE_KEY: "site-key"
}));

vi.mock("$env/dynamic/private", () => ({ env: runtimeEnv }));

import { actions } from "./+page.server";

const action = actions.default;
type ActionEvent = Parameters<typeof action>[0];

function createEmail({ fails = false } = {}) {
	const messages: EmailMessageBuilder[] = [];
	const send = vi.fn(async (message: EmailMessage | EmailMessageBuilder) => {
		if (fails) throw new Error("email unavailable");
		if ("subject" in message) messages.push(message);
		return { messageId: "message-id" };
	});
	return { binding: { send } satisfies SendEmail, messages, send };
}

function createEvent(
	fields: Record<string, string>,
	email: SendEmail | null = createEmail().binding
): ActionEvent {
	return {
		getClientAddress: () => "192.0.2.1",
		platform: email ? { env: { EMAIL: email } } : undefined,
		request: new Request("https://bettercalapan.org/report", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams(fields)
		})
	} as ActionEvent;
}

function validFields(): Record<string, string> {
	return {
		category: "technical",
		pageUrl: "/services",
		message: "A link is broken.",
		email: "",
		"cf-turnstile-response": "valid-token"
	};
}

describe("report form action", () => {
	beforeEach(() => {
		vi.stubGlobal(
			"fetch",
			vi.fn(
				async () =>
					new Response(
						JSON.stringify({ success: true, action: "report", hostname: "bettercalapan.org" })
					)
			)
		);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	it("sends a valid, verified report", async () => {
		const email = createEmail();

		const result = await action(createEvent(validFields(), email.binding));

		expect(result).toEqual({ success: true });
		expect(email.send).toHaveBeenCalledOnce();
		expect(email.messages[0]).toEqual(expect.objectContaining({ to: "reports@bettercalapan.org" }));
	});

	it("silently discards honeypot submissions before verification", async () => {
		const email = createEmail();

		const result = await action(
			createEvent({ ...validFields(), company: "Spam Incorporated" }, email.binding)
		);

		expect(result).toEqual({ success: true });
		expect(fetch).not.toHaveBeenCalled();
		expect(email.send).not.toHaveBeenCalled();
	});

	it("does not verify or email invalid reports", async () => {
		const email = createEmail();

		const result = await action(createEvent({ category: "technical", message: "" }, email.binding));

		expect(result).toMatchObject({ status: 400, data: { success: false } });
		expect(fetch).not.toHaveBeenCalled();
		expect(email.send).not.toHaveBeenCalled();
	});

	it("does not send email when Turnstile rejects the submission", async () => {
		vi.mocked(fetch).mockResolvedValueOnce(
			new Response(
				JSON.stringify({ success: false, action: "report", hostname: "bettercalapan.org" })
			)
		);
		const email = createEmail();

		const result = await action(createEvent(validFields(), email.binding));

		expect(result).toMatchObject({
			status: 400,
			data: { errors: { verification: expect.any(String) } }
		});
		expect(email.send).not.toHaveBeenCalled();
	});

	it("returns a service error when the email binding is unavailable", async () => {
		const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);

		const result = await action(createEvent(validFields(), null));

		expect(result).toMatchObject({
			status: 503,
			data: { errors: { form: expect.any(String) } }
		});
		expect(consoleError).toHaveBeenCalled();
	});

	it("returns a form error when email delivery fails", async () => {
		const email = createEmail({ fails: true });
		const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);

		const result = await action(createEvent(validFields(), email.binding));

		expect(result).toMatchObject({
			status: 500,
			data: { errors: { form: expect.any(String) } }
		});
		expect(consoleError).toHaveBeenCalled();
	});
});
