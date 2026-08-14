export type PhoneType = "mobile" | "landline";

export function splitPhoneNumbers(value: string) {
	return value
		.split("/")
		.map((number) => number.trim())
		.filter(Boolean);
}

export function formatPhoneNumber(value: string, type: PhoneType) {
	const digits = value.replace(/\D/g, "");

	if (digits === "911") return digits;

	if (type === "mobile") {
		const local = digits.startsWith("63") ? `0${digits.slice(2)}` : digits;
		return local.replace(/^(\d{4})(\d{3})(\d{4})$/, "$1 $2 $3");
	}

	const local = digits.startsWith("63") ? `0${digits.slice(2)}` : digits;
	return local.replace(/^(\d{3})(\d{3})(\d{4})$/, "($1) $2-$3");
}

export function contactHref(method: { kind: "email" | "phone"; value: string }) {
	if (method.kind === "email") return `mailto:${method.value}`;
	return `tel:${method.value.replace(/[^\d+]/g, "")}`;
}

export function googleMapsSearchHref(query: string) {
	return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function googleMapsDirectionsHref(destination: string) {
	return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}
