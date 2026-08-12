import { describe, expect, it } from "vitest";
import { emergencyHotlines, medicalEmergencyHotlines } from "./contact.data";
import { barangays, departments, executive, legislative, officials } from "./government.data";
import { business, certificates, serviceSources } from "./services.data";
import {
	barangayPopulation,
	cityIncomeSource,
	competitivenessSource,
	currentPopulation,
	populationGrowth,
	populationSource
} from "./statistics.data";
import type { DataSource } from "$lib/types/source.types";

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
			expect(barangay.phoneNumber.trim()).not.toBe("");
		}
	});

	it("provides sources for every published service", () => {
		const publishedServices = [...certificates.data, ...business.data];
		const sourceRecords = Object.values(serviceSources);

		expect(publishedServices).toHaveLength(13);
		expect(sourceRecords).toHaveLength(publishedServices.length);
		for (const source of sourceRecords) expectCompleteSource(source);
	});

	it("publishes only complete hotline organizations with sources", () => {
		const organizations = [...emergencyHotlines, ...medicalEmergencyHotlines];

		expect(organizations.length).toBeGreaterThan(0);
		for (const organization of organizations) {
			expect(organization.name.trim()).not.toBe("");
			expect(organization.contact.length).toBeGreaterThan(0);
			for (const contact of organization.contact) {
				expect(contact.name.trim()).not.toBe("");
				expect(["landline", "mobile"]).toContain(contact.type);
			}
			expectCompleteSource(organization.source);
		}
	});
});
