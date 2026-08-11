import {
	reportCategories,
	type ReportCategory,
	type ReportErrors,
	type ReportValues
} from "$lib/report";

const MAX_PAGE_URL_LENGTH = 500;
const MAX_MESSAGE_LENGTH = 5000;
const MAX_EMAIL_LENGTH = 254;
const MAX_TURNSTILE_TOKEN_LENGTH = 2048;
const MAX_REQUEST_BODY_LENGTH = 65_536;
const TURNSTILE_ACTION = "report";
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const categoryValues = new Set<string>(reportCategories.map(({ value }) => value));

type ParsedReport = {
	values: ReportValues;
	errors: ReportErrors;
	honeypot: string;
	turnstileToken: string;
};

type ValidReport = ReportValues & {
	category: ReportCategory;
};

type TurnstileResponse = {
	success?: boolean;
	hostname?: string;
	action?: string;
};

function getString(formData: FormData, name: string): string {
	const value = formData.get(name);
	return typeof value === "string" ? value.trim() : "";
}

export async function readReportFormData(request: Request): Promise<FormData> {
	const contentType = request.headers.get("Content-Type")?.split(";", 1)[0].trim().toLowerCase();
	if (contentType !== "application/x-www-form-urlencoded") {
		throw new ReportRequestError(415, "Use the website form to submit a report.");
	}

	const declaredLength = Number(request.headers.get("Content-Length"));
	if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BODY_LENGTH) {
		throw new ReportRequestError(413, "The report is too large to submit.");
	}

	const reader = request.body?.getReader();
	if (!reader) throw new ReportRequestError(400, "The report form was empty.");

	const chunks: Uint8Array[] = [];
	let totalLength = 0;
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		totalLength += value.byteLength;
		if (totalLength > MAX_REQUEST_BODY_LENGTH) {
			await reader.cancel();
			throw new ReportRequestError(413, "The report is too large to submit.");
		}
		chunks.push(value);
	}

	const body = new Uint8Array(totalLength);
	let offset = 0;
	for (const chunk of chunks) {
		body.set(chunk, offset);
		offset += chunk.byteLength;
	}

	const formData = new FormData();
	for (const [name, value] of new URLSearchParams(new TextDecoder().decode(body))) {
		formData.append(name, value);
	}
	return formData;
}

export class ReportRequestError extends Error {
	constructor(
		readonly status: number,
		message: string
	) {
		super(message);
	}
}

export function parseReportForm(formData: FormData): ParsedReport {
	const values: ReportValues = {
		category: getString(formData, "category"),
		pageUrl: getString(formData, "pageUrl"),
		message: getString(formData, "message"),
		email: getString(formData, "email")
	};
	const errors: ReportErrors = {};

	if (!categoryValues.has(values.category)) {
		errors.category = "Choose the type of problem you found.";
	}
	if (values.pageUrl.length > MAX_PAGE_URL_LENGTH) {
		errors.pageUrl = `Keep the page address under ${MAX_PAGE_URL_LENGTH} characters.`;
	}
	if (!values.message) {
		errors.message = "Describe the problem you found.";
	} else if (values.message.length > MAX_MESSAGE_LENGTH) {
		errors.message = `Keep the report under ${MAX_MESSAGE_LENGTH} characters.`;
	}
	if (values.email.length > MAX_EMAIL_LENGTH) {
		errors.email = "Enter an email address under 254 characters.";
	} else if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
		errors.email = "Enter a valid email address, or leave this field blank.";
	}

	return {
		values,
		errors,
		honeypot: getString(formData, "company"),
		turnstileToken: getString(formData, "cf-turnstile-response")
	};
}

export function isValidReport(values: ReportValues): values is ValidReport {
	return categoryValues.has(values.category);
}

export async function verifyTurnstile({
	token,
	secret,
	remoteIp,
	hostnames,
	fetcher = fetch
}: {
	token: string;
	secret: string;
	remoteIp?: string;
	hostnames: Set<string>;
	fetcher?: typeof fetch;
}): Promise<boolean> {
	if (!token || token.length > MAX_TURNSTILE_TOKEN_LENGTH || !secret || hostnames.size === 0) {
		return false;
	}

	const body = new URLSearchParams({ secret, response: token });
	if (remoteIp) body.set("remoteip", remoteIp);

	try {
		const response = await fetcher(TURNSTILE_VERIFY_URL, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body,
			signal: AbortSignal.timeout(10_000)
		});
		if (!response.ok) return false;

		const result = (await response.json()) as TurnstileResponse;
		return (
			result.success === true &&
			result.action === TURNSTILE_ACTION &&
			typeof result.hostname === "string" &&
			hostnames.has(result.hostname)
		);
	} catch {
		return false;
	}
}

function escapeHtml(value: string): string {
	return value.replace(
		/[&<>"']/g,
		(character) =>
			({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character] ??
			character
	);
}

export async function sendReportEmail(email: SendEmail, report: ValidReport): Promise<void> {
	const category = reportCategories.find(({ value }) => value === report.category)?.label;
	const pageUrl = report.pageUrl || "Not provided";
	const reporterEmail = report.email || "Not provided";
	const submittedAt = new Date().toISOString();

	await email.send({
		to: "reports@bettercalapan.org",
		from: { email: "website@bettercalapan.org", name: "BetterCalapan website" },
		...(report.email ? { replyTo: report.email } : {}),
		subject: `[Website report] ${category}`,
		text: [
			`Category: ${category}`,
			`Affected page: ${pageUrl}`,
			`Reporter email: ${reporterEmail}`,
			`Submitted: ${submittedAt}`,
			"",
			report.message
		].join("\n"),
		html: [
			`<p><strong>Category:</strong> ${escapeHtml(category ?? report.category)}</p>`,
			`<p><strong>Affected page:</strong> ${escapeHtml(pageUrl)}</p>`,
			`<p><strong>Reporter email:</strong> ${escapeHtml(reporterEmail)}</p>`,
			`<p><strong>Submitted:</strong> ${escapeHtml(submittedAt)}</p>`,
			`<p><strong>Report:</strong></p><p>${escapeHtml(report.message).replace(/\n/g, "<br>")}</p>`
		].join("")
	});
}
