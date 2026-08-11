import { describe, expect, it, vi } from "vitest";
import { parseReportForm, readReportFormData, sendReportEmail, verifyTurnstile } from "./report";

function validFormData(): FormData {
	const formData = new FormData();
	formData.set("category", "technical");
	formData.set("pageUrl", " /services ");
	formData.set("message", " The link does not open. ");
	formData.set("email", " reporter@example.com ");
	formData.set("cf-turnstile-response", "token");
	return formData;
}

describe("parseReportForm", () => {
	it("normalizes a valid report", () => {
		const result = parseReportForm(validFormData());

		expect(result.values).toEqual({
			category: "technical",
			pageUrl: "/services",
			message: "The link does not open.",
			email: "reporter@example.com"
		});
		expect(result.errors).toEqual({});
		expect(result.turnstileToken).toBe("token");
	});

	it("rejects invalid fields and retains safe values", () => {
		const formData = new FormData();
		formData.set("category", "unknown");
		formData.set("pageUrl", "x".repeat(501));
		formData.set("message", "");
		formData.set("email", "not-an-email");

		const result = parseReportForm(formData);

		expect(result.errors).toEqual({
			category: "Choose the type of problem you found.",
			pageUrl: "Keep the page address under 500 characters.",
			message: "Describe the problem you found.",
			email: "Enter a valid email address, or leave this field blank."
		});
		expect(result.values.email).toBe("not-an-email");
	});

	it("captures the honeypot without adding it to report values", () => {
		const formData = validFormData();
		formData.set("company", "Spam Incorporated");

		const result = parseReportForm(formData);

		expect(result.honeypot).toBe("Spam Incorporated");
		expect(result.values).not.toHaveProperty("company");
	});
});

describe("readReportFormData", () => {
	it("reads the report's URL-encoded request body", async () => {
		const request = new Request("https://bettercalapan.org/report", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: "category=technical&message=Broken+link"
		});

		const formData = await readReportFormData(request);

		expect(formData.get("category")).toBe("technical");
		expect(formData.get("message")).toBe("Broken link");
	});

	it("rejects unsupported form encodings", async () => {
		const request = new Request("https://bettercalapan.org/report", {
			method: "POST",
			headers: { "Content-Type": "multipart/form-data" },
			body: "form body"
		});

		await expect(readReportFormData(request)).rejects.toMatchObject({ status: 415 });
	});

	it("rejects oversized bodies even without a Content-Length header", async () => {
		const body = new ReadableStream<Uint8Array>({
			start(controller) {
				controller.enqueue(new TextEncoder().encode(`message=${"x".repeat(66_000)}`));
				controller.close();
			}
		});
		const request = new Request("https://bettercalapan.org/report", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body,
			duplex: "half"
		} as RequestInit);

		await expect(readReportFormData(request)).rejects.toMatchObject({ status: 413 });
	});
});

describe("verifyTurnstile", () => {
	it("accepts only the expected action and an allowed hostname", async () => {
		const fetcher = vi
			.fn<typeof fetch>()
			.mockResolvedValue(
				new Response(
					JSON.stringify({ success: true, action: "report", hostname: "bettercalapan.org" })
				)
			);

		const result = await verifyTurnstile({
			token: "valid-token",
			secret: "secret",
			remoteIp: "192.0.2.1",
			hostnames: new Set(["bettercalapan.org"]),
			fetcher
		});

		expect(result).toBe(true);
		expect(fetcher).toHaveBeenCalledOnce();
		const request = fetcher.mock.calls[0]?.[1];
		expect(request?.method).toBe("POST");
		expect(request?.body?.toString()).toContain("remoteip=192.0.2.1");
	});

	it.each([
		{ success: false, action: "report", hostname: "bettercalapan.org" },
		{ success: true, action: "login", hostname: "bettercalapan.org" },
		{ success: true, action: "report", hostname: "attacker.example" }
	])("rejects an untrusted verification response", async (responseBody) => {
		const result = await verifyTurnstile({
			token: "token",
			secret: "secret",
			hostnames: new Set(["bettercalapan.org"]),
			fetcher: async () => new Response(JSON.stringify(responseBody))
		});

		expect(result).toBe(false);
	});

	it("fails closed without complete configuration", async () => {
		const fetcher = vi.fn<typeof fetch>();

		const result = await verifyTurnstile({
			token: "token",
			secret: "",
			hostnames: new Set(),
			fetcher
		});

		expect(result).toBe(false);
		expect(fetcher).not.toHaveBeenCalled();
	});

	it("fails closed when Siteverify is unavailable", async () => {
		const result = await verifyTurnstile({
			token: "token",
			secret: "secret",
			hostnames: new Set(["bettercalapan.org"]),
			fetcher: async () => {
				throw new Error("network failure");
			}
		});

		expect(result).toBe(false);
	});
});

describe("sendReportEmail", () => {
	it("sends an escaped report to the fixed recipient with an optional reply-to", async () => {
		const messages: EmailMessageBuilder[] = [];
		const send = vi.fn(async (message: EmailMessage | EmailMessageBuilder) => {
			if ("subject" in message) messages.push(message);
			return { messageId: "message-id" };
		});
		const email = { send } satisfies SendEmail;

		await sendReportEmail(email, {
			category: "content",
			pageUrl: "https://bettercalapan.org/<services>",
			message: "<script>alert('xss')</script>\nIncorrect office hours",
			email: "reporter@example.com"
		});

		expect(send).toHaveBeenCalledOnce();
		expect(send).toHaveBeenCalledWith(
			expect.objectContaining({
				to: "reports@bettercalapan.org",
				from: { email: "website@bettercalapan.org", name: "BetterCalapan website" },
				replyTo: "reporter@example.com",
				subject: "[Website report] Incorrect or outdated content"
			})
		);
		const message = messages[0];
		expect(message?.html).toContain("&lt;script&gt;alert(&#039;xss&#039;)&lt;/script&gt;");
		expect(message?.html).not.toContain("<script>");
		expect(message?.text).toContain("Incorrect office hours");
	});

	it("omits reply-to when a report is anonymous", async () => {
		const messages: EmailMessageBuilder[] = [];
		const send = vi.fn(async (message: EmailMessage | EmailMessageBuilder) => {
			if ("subject" in message) messages.push(message);
			return { messageId: "message-id" };
		});
		const email = { send } satisfies SendEmail;

		await sendReportEmail(email, {
			category: "other",
			pageUrl: "",
			message: "A general issue",
			email: ""
		});

		expect(messages[0]).not.toHaveProperty("replyTo");
	});

	it("propagates email delivery failures to the form action", async () => {
		const email = {
			send: vi.fn(async (message: EmailMessage | EmailMessageBuilder) => {
				void message;
				throw new Error("provider unavailable");
			})
		} satisfies SendEmail;

		await expect(
			sendReportEmail(email, {
				category: "technical",
				pageUrl: "/services",
				message: "A link is broken",
				email: ""
			})
		).rejects.toThrow("provider unavailable");
	});
});
