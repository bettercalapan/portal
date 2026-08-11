import { env } from "$env/dynamic/private";
import { fail } from "@sveltejs/kit";
import {
	isValidReport,
	parseReportForm,
	readReportFormData,
	ReportRequestError,
	sendReportEmail,
	verifyTurnstile
} from "$lib/server/report";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ url }) => ({
	initialPageUrl: url.searchParams.get("page")?.slice(0, 500) ?? "",
	turnstileSiteKey: env.TURNSTILE_SITE_KEY ?? ""
});

export const actions = {
	default: async ({ getClientAddress, platform, request }) => {
		let formData: FormData;
		try {
			formData = await readReportFormData(request);
		} catch (error) {
			if (!(error instanceof ReportRequestError)) throw error;
			return fail(error.status, {
				success: false,
				errors: { form: error.message }
			});
		}
		const parsed = parseReportForm(formData);

		if (parsed.honeypot) return { success: true };
		if (Object.keys(parsed.errors).length > 0 || !isValidReport(parsed.values)) {
			return fail(400, { success: false, values: parsed.values, errors: parsed.errors });
		}

		const hostnames = new Set(
			(env.TURNSTILE_HOSTNAMES ?? "")
				.split(",")
				.map((hostname) => hostname.trim())
				.filter(Boolean)
		);
		const verified = await verifyTurnstile({
			token: parsed.turnstileToken,
			secret: env.TURNSTILE_SECRET ?? "",
			remoteIp: request.headers.get("CF-Connecting-IP") ?? getClientAddress(),
			hostnames
		});

		if (!verified) {
			return fail(400, {
				success: false,
				values: parsed.values,
				errors: { verification: "Verification failed. Complete the check and try again." }
			});
		}

		if (!platform?.env.EMAIL) {
			console.error("Report email binding is unavailable");
			return fail(503, {
				success: false,
				values: parsed.values,
				errors: { form: "Reporting is temporarily unavailable. Please try again later." }
			});
		}

		try {
			await sendReportEmail(platform.env.EMAIL, parsed.values);
			return { success: true };
		} catch (error) {
			console.error("Failed to send website report", error);
			return fail(500, {
				success: false,
				values: parsed.values,
				errors: { form: "We could not send your report. Please try again later." }
			});
		}
	}
} satisfies Actions;
