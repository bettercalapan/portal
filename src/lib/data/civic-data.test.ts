import { describe, expect, it } from "vitest";
import { contactSections, generalContacts } from "./contact.data";
import { barangays, departments, executive, legislative, officials } from "./government.data";
import { offices } from "./offices.data";
import { publishedPages } from "./site.data";
import { business, certificates, serviceRecords } from "./services.data";
import {
	barangayPopulation,
	cityIncomeSource,
	cityIncomeStatistics,
	competitivenessSource,
	currentPopulation,
	generalStatistics,
	populationDistribution,
	populationGrowth,
	populationSource
} from "./statistics.data";
import type { DataSource } from "$lib/types/source.types";
import { formatPhoneNumber, splitPhoneNumbers } from "$lib/utils/contact";

const verificationDate = /^\d{4}-\d{2}-\d{2}$/;

function expectCompleteSource(dataSource: DataSource) {
	expect(dataSource.sources.length).toBeGreaterThan(0);
	for (const source of dataSource.sources) {
		expect(source.name.trim()).not.toBe("");
		expect(() => new URL(source.url)).not.toThrow();
		expect(source.url.startsWith("https://")).toBe(true);
	}

	expect(dataSource.lastVerified).toMatch(verificationDate);
	const verifiedAt = new Date(`${dataSource.lastVerified}T00:00:00Z`);
	expect(Number.isNaN(verifiedAt.valueOf())).toBe(false);
	expect(verifiedAt.valueOf()).toBeLessThanOrEqual(Date.now());
}

describe("civic data integrity", () => {
	it("keeps the population summary, observations, and barangay total consistent", () => {
		const latestPopulation = populationGrowth.at(-1);
		const barangayTotal = barangayPopulation.reduce(
			(total, barangay) => total + barangay.population,
			0
		);

		expect(populationGrowth).toEqual([
			{ year: 2020, population: 145_786 },
			{ year: 2024, population: 148_558 }
		]);
		expect(latestPopulation?.population).toBe(currentPopulation);
		expect(barangayTotal).toBe(currentPopulation);
	});

	it("maps every population row to exactly one canonical barangay", () => {
		const directoryNames = barangays.data.map(({ name }) => name);
		const populationNames = barangayPopulation.map(({ barangay }) => barangay);

		expect(new Set(directoryNames).size).toBe(62);
		expect(new Set(populationNames).size).toBe(62);
		expect([...populationNames].sort()).toEqual([...directoryNames].sort());

		const salong = barangays.data.find(({ name }) => name === "Salong");
		expect(salong).toMatchObject({
			psgc: "1705205048",
			aliases: ["San Rafael", "San Rafael-Salong"]
		});
	});

	it("provides sources for government and statistics datasets", () => {
		const datasets = [
			officials.source,
			departments.source,
			barangays.source,
			populationSource,
			cityIncomeSource,
			competitivenessSource
		];

		for (const source of datasets) expectCompleteSource(source);
	});

	it("derives statistic headlines and distribution rows from canonical data", () => {
		expect(generalStatistics.slice(0, 2)).toEqual([
			{ value: currentPopulation, label: "Population", format: "number" },
			{ value: barangayPopulation.length, label: "Barangays", format: "number" }
		]);
		expect(populationDistribution).toHaveLength(barangayPopulation.length);
		expect(populationDistribution[0]?.population).toBe(
			Math.max(...barangayPopulation.map(({ population }) => population))
		);
		expect(cityIncomeStatistics).toMatchObject([
			{ value: 1_470_000_000, label: "Annual Income" },
			{ value: 1_170_000_000, label: "National Tax Allotment" },
			{ value: 79.4, label: "NTA Dependency" }
		]);
	});

	it("keeps government directory records complete and unique", () => {
		const officialNames = [...executive, ...legislative].map(({ name }) => name);
		expect(new Set(officialNames).size).toBe(officialNames.length);
		for (const official of [...executive, ...legislative]) {
			expect(official.name.trim()).not.toBe("");
			expect(official.title.trim()).not.toBe("");
		}

		expect(new Set(departments.data).size).toBe(departments.data.length);
		for (const department of departments.data) expect(department.trim()).not.toBe("");

		for (const barangay of barangays.data) {
			expect(barangay.name.trim()).not.toBe("");
			expect(barangay.captain.trim()).not.toBe("");
			for (const phone of splitPhoneNumbers(barangay.phoneNumber)) {
				expect(formatPhoneNumber(phone, "mobile")).toMatch(/^09\d{2} \d{3} \d{4}$/);
			}
		}
	});

	it("publishes complete canonical service records", () => {
		const publishedServices = [...certificates.data, ...business.data];
		const records = Object.values(serviceRecords);

		expect(publishedServices).toHaveLength(13);
		expect(records).toHaveLength(publishedServices.length);
		expect(new Set(records.map((service) => service.id)).size).toBe(records.length);
		expect(new Set(records.map((service) => service.href)).size).toBe(records.length);
		for (const service of records) {
			expect(service.id.trim()).not.toBe("");
			expect(service.title.trim()).not.toBe("");
			expect(service.href).toMatch(/^\/services\//);
			expect(["certificates", "business"]).toContain(service.category);
			expect(service.summary.trim()).not.toBe("");
			expect(service.aliases.length).toBeGreaterThan(0);
			expect(service.requirements.length).toBeGreaterThan(0);
			expect(["fixed", "free", "variable", "unknown"]).toContain(service.fee.status);
			expect(service.fee.details.trim()).not.toBe("");
			expect("office" in service || "locationMode" in service).toBe(true);
			expectCompleteSource(service.source);
		}
	});

	it("publishes only complete hotline organizations with sources", () => {
		const organizations = contactSections.flatMap(({ organizations }) => organizations);

		expect(organizations.length).toBeGreaterThan(0);
		for (const organization of organizations) {
			expect(organization.name.trim()).not.toBe("");
			expect(organization.contacts.length).toBeGreaterThan(0);
			for (const contact of organization.contacts) {
				expect(contact.value.trim()).not.toBe("");
				if (contact.kind === "phone") expect(["landline", "mobile"]).toContain(contact.phoneType);
			}
			expectCompleteSource(organization.source);
		}
	});

	it("publishes complete general contacts", () => {
		const email = generalContacts.find((contact) => contact.kind === "email");
		const phone = generalContacts.find((contact) => contact.kind === "phone");

		expect(email?.value).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
		expect(phone?.value).not.toBe("");
	});

	it("publishes complete office records", () => {
		for (const office of Object.values(offices)) {
			expect(office.id.trim()).not.toBe("");
			expect(office.name.trim()).not.toBe("");
			expect(office.address.trim()).not.toBe("");
			expect(office.hours.trim()).not.toBe("");
			expectCompleteSource(office.source);
			for (const contact of office.contacts) {
				expect(contact.value.trim()).not.toBe("");
				if (contact.kind === "phone") expect(contact.phoneType).toMatch(/^(mobile|landline)$/);
			}
		}
	});

	it("uses unique public paths for every registered page", () => {
		expect(new Set(publishedPages.map((page) => page.id)).size).toBe(publishedPages.length);
		expect(new Set(publishedPages.map((page) => page.href)).size).toBe(publishedPages.length);
		for (const page of publishedPages) {
			expect(page.title.trim()).not.toBe("");
			expect(page.href).toMatch(/^\//);
			expect(page.href).not.toContain("(content)");
			expect(page.keywords.length).toBeGreaterThan(0);
		}
	});
});
