import { describe, expect, it } from "vitest";
import { contactSections } from "$lib/data/contact.data";
import { barangays, departments, executive, legislative } from "$lib/data/government.data";
import { publishedPages } from "$lib/data/site.data";
import { serviceRecords } from "$lib/data/services.data";
import { index } from "./index";

describe("search index", () => {
	it("has unique canonical record ids", () => {
		expect(new Set(index.map((record) => record.id)).size).toBe(index.length);
	});

	it("includes every published page and canonical civic record", () => {
		for (const page of publishedPages)
			expect(index.some((record) => record.url === page.href)).toBe(true);
		for (const service of Object.values(serviceRecords)) {
			expect(index.some((record) => record.id === `service:${service.id}`)).toBe(true);
		}
		for (const official of [...executive, ...legislative]) {
			expect(index.some((record) => record.title === official.name)).toBe(true);
		}
		for (const department of departments.data) {
			expect(index.some((record) => record.title === department)).toBe(true);
		}
		for (const barangay of barangays.data) {
			expect(index.some((record) => record.title === barangay.name)).toBe(true);
		}
		for (const organization of contactSections.flatMap((section) => section.organizations)) {
			expect(index.some((record) => record.title === organization.name)).toBe(true);
		}
	});

	it("indexes service requirements, fees, aliases, and offices", () => {
		const businessPermit = index.find((record) => record.id === "service:business-permit");
		expect(businessPermit?.keywords).toContain("Unified Application Form");
		expect(businessPermit?.keywords).toContain("Business Permit and Licensing Office");
		expect(businessPermit?.keywords.some((keyword) => keyword.includes("Taxes, fees"))).toBe(true);
	});
});
