import { describe, expect, it } from "vitest";
import { index } from "./index";

describe("search index", () => {
	it("has unique canonical record ids", () => {
		expect(new Set(index.map((record) => record.id)).size).toBe(index.length);
	});

	it("includes government and emergency civic records", () => {
		expect(index.some((record) => record.title === "Doy C. Leachon")).toBe(true);
		expect(index.some((record) => record.title === "Balingayan")).toBe(true);
		expect(index.some((record) => record.title.includes("Business Permit"))).toBe(true);
		expect(index.some((record) => record.title === "CDRRMD (Rescue/Fire)")).toBe(true);
	});
});
