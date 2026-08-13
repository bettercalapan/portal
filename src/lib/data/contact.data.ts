import type { DataSource } from "$lib/types/source.types";

export type Contact = {
	name: string;
	type: "mobile" | "landline";
};

export type ContactOrganization = {
	name: string;
	contact: readonly Contact[];
	source: DataSource;
};

export const generalContacts = {
	email: "mbscalapanofficial@gmail.com",
	phone: { name: "043-288-7508", type: "landline" }
} as const;

const cityEmergencySource = {
	sources: [
		{
			name: "City of Calapan Ligtas Undas 2025 emergency hotlines",
			url: "https://cityofcalapan.gov.ph/2025/11/01/ligtas-undas-2025/"
		}
	],
	lastVerified: "2026-08-12",
	asOf: "1 November 2025"
} as const satisfies DataSource;

const provincialHospitalSource = {
	sources: [
		{
			name: "Province of Oriental Mindoro contact directory",
			url: "https://ormindoro.gov.ph/contact-us/"
		}
	],
	lastVerified: "2026-08-12"
} as const satisfies DataSource;

const holyCrossSource = {
	sources: [
		{
			name: "Hospital of the Holy Cross contact page",
			url: "https://hospitaloftheholycross.com/contactus"
		}
	],
	lastVerified: "2026-08-12"
} as const satisfies DataSource;

const legacyDirectorySource = {
	sources: [
		{
			name: "City of Calapan official website",
			url: "https://cityofcalapan.gov.ph/"
		}
	],
	lastVerified: "2026-08-12",
	note: "Retained from the previous BetterCalapan contact directory; confirm the number with the organization before relying on it."
} as const satisfies DataSource;

export const emergencyHotlines: readonly ContactOrganization[] = [
	{
		name: "National Emergency Hotline",
		contact: [{ name: "911", type: "landline" }],
		source: cityEmergencySource
	},
	{
		name: "City Health and Sanitation Department",
		contact: [
			{ name: "(043) 288-7408", type: "landline" },
			{ name: "0908-366-1556", type: "mobile" }
		],
		source: cityEmergencySource
	},
	{
		name: "CDRRMD (Rescue/Fire)",
		contact: [
			{ name: "0999-735-6447", type: "mobile" },
			{ name: "0915-744-9698", type: "mobile" },
			{ name: "0966-029-9777", type: "mobile" },
			{ name: "(043) 288-6111", type: "landline" },
			{ name: "(043) 288-7521", type: "landline" }
		],
		source: cityEmergencySource
	},
	{
		name: "Calapan City Police Station (PNP)",
		contact: [
			{ name: "0998-598-5813", type: "mobile" },
			{ name: "0906-179-1105", type: "mobile" }
		],
		source: cityEmergencySource
	},
	{
		name: "Calapan City Fire Station (BFP)",
		contact: [
			{ name: "0915-603-1561", type: "mobile" },
			{ name: "(043) 288-7777", type: "landline" }
		],
		source: cityEmergencySource
	},
	{
		name: "Tamaraw Fire Volunteer",
		contact: [
			{ name: "0917-534-2419", type: "mobile" },
			{ name: "0917-136-4603", type: "mobile" },
			{ name: "0925-812-9639", type: "mobile" }
		],
		source: cityEmergencySource
	},
	{
		name: "PNP EOD K9 Unit (Explosives Related Incident)",
		contact: [{ name: "0916-695-0155", type: "mobile" }],
		source: legacyDirectorySource
	}
];

export const medicalEmergencyHotlines: readonly ContactOrganization[] = [
	{
		name: "Oriental Mindoro Provincial Hospital",
		contact: [
			{ name: "0963-783-2169", type: "mobile" },
			{ name: "(043) 288-3077", type: "landline" },
			{ name: "(043) 288-7193", type: "landline" }
		],
		source: provincialHospitalSource
	},
	{
		name: "MMG Hospital",
		contact: [
			{ name: "0923-709-5439", type: "mobile" },
			{ name: "(043) 288-2275", type: "landline" }
		],
		source: legacyDirectorySource
	},
	{
		name: "Maria Estrella General Hospital",
		contact: [
			{ name: "0917-702-5210", type: "mobile" },
			{ name: "(043) 286-7386", type: "landline" }
		],
		source: legacyDirectorySource
	},
	{
		name: "Luna Goco Medical Center",
		contact: [
			{ name: "0919-097-9155", type: "mobile" },
			{ name: "0947-897-0588", type: "mobile" },
			{ name: "(043) 286-7208", type: "landline" }
		],
		source: legacyDirectorySource
	},
	{
		name: "Mindoro Medical Center",
		contact: [{ name: "0917-567-8102", type: "mobile" }],
		source: legacyDirectorySource
	}
];
