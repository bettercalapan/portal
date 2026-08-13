import { describe, expect, it } from "vitest";
import {
	formatPhoneNumber,
	googleMapsDirectionsHref,
	googleMapsSearchHref,
	splitPhoneNumbers
} from "./contact";

describe("contact utilities", () => {
	it("formats local mobile, landline, and emergency numbers", () => {
		expect(formatPhoneNumber("09123456789", "mobile")).toBe("0912 345 6789");
		expect(formatPhoneNumber("0432887508", "landline")).toBe("(043) 288-7508");
		expect(formatPhoneNumber("911", "landline")).toBe("911");
	});

	it("splits legacy combined phone values and encodes Google Maps URLs", () => {
		expect(splitPhoneNumbers("09123456789/09198765432")).toEqual(["09123456789", "09198765432"]);
		expect(googleMapsSearchHref("Calapan City Hall")).toContain("Calapan%20City%20Hall");
		expect(googleMapsDirectionsHref("Calapan City Hall")).toContain(
			"destination=Calapan%20City%20Hall"
		);
	});

	it("selects the first phone number from a legacy combined value", () => {
		expect(splitPhoneNumbers("09123456789/09198765432")[0]).toBe("09123456789");
	});
});
