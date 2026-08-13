import type { ContactMethod, DataSource } from "$lib/types/civic.types";

export type ContactOrganization = {
	name: string;
	contacts: readonly ContactMethod[];
	source: DataSource;
};

export type { ContactMethod } from "$lib/types/civic.types";

export type ContactSection = {
	id: string;
	heading: string;
	organizations: readonly ContactOrganization[];
	showLocationActions?: boolean;
};

export const generalContacts = [
	{ kind: "email", value: "mbscalapanofficial@gmail.com" },
	{ kind: "phone", value: "043-288-7508", phoneType: "landline" }
] as const satisfies readonly ContactMethod[];

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

const emergencyHotlines: readonly ContactOrganization[] = [
	{
		name: "National Emergency Hotline",
		contacts: [{ kind: "phone", value: "911", phoneType: "landline" }],
		source: cityEmergencySource
	},
	{
		name: "City Health and Sanitation Department",
		contacts: [
			{ kind: "phone", value: "(043) 288-7408", phoneType: "landline" },
			{ kind: "phone", value: "0908-366-1556", phoneType: "mobile" }
		],
		source: cityEmergencySource
	},
	{
		name: "CDRRMD (Rescue/Fire)",
		contacts: [
			{ kind: "phone", value: "0999-735-6447", phoneType: "mobile" },
			{ kind: "phone", value: "0915-744-9698", phoneType: "mobile" },
			{ kind: "phone", value: "0966-029-9777", phoneType: "mobile" },
			{ kind: "phone", value: "(043) 288-6111", phoneType: "landline" },
			{ kind: "phone", value: "(043) 288-7521", phoneType: "landline" }
		],
		source: cityEmergencySource
	},
	{
		name: "Calapan City Police Station (PNP)",
		contacts: [
			{ kind: "phone", value: "0998-598-5813", phoneType: "mobile" },
			{ kind: "phone", value: "0906-179-1105", phoneType: "mobile" }
		],
		source: cityEmergencySource
	},
	{
		name: "Calapan City Fire Station (BFP)",
		contacts: [
			{ kind: "phone", value: "0915-603-1561", phoneType: "mobile" },
			{ kind: "phone", value: "(043) 288-7777", phoneType: "landline" }
		],
		source: cityEmergencySource
	},
	{
		name: "Tamaraw Fire Volunteer",
		contacts: [
			{ kind: "phone", value: "0917-534-2419", phoneType: "mobile" },
			{ kind: "phone", value: "0917-136-4603", phoneType: "mobile" },
			{ kind: "phone", value: "0925-812-9639", phoneType: "mobile" }
		],
		source: cityEmergencySource
	},
	{
		name: "PNP EOD K9 Unit (Explosives Related Incident)",
		contacts: [{ kind: "phone", value: "0916-695-0155", phoneType: "mobile" }],
		source: legacyDirectorySource
	}
];

const medicalEmergencyHotlines: readonly ContactOrganization[] = [
	{
		name: "Oriental Mindoro Provincial Hospital",
		contacts: [
			{ kind: "phone", value: "0963-783-2169", phoneType: "mobile" },
			{ kind: "phone", value: "(043) 288-3077", phoneType: "landline" },
			{ kind: "phone", value: "(043) 288-7193", phoneType: "landline" }
		],
		source: provincialHospitalSource
	},
	{
		name: "MMG Hospital",
		contacts: [
			{ kind: "phone", value: "0923-709-5439", phoneType: "mobile" },
			{ kind: "phone", value: "(043) 288-2275", phoneType: "landline" }
		],
		source: legacyDirectorySource
	},
	{
		name: "Maria Estrella General Hospital",
		contacts: [
			{ kind: "phone", value: "0917-702-5210", phoneType: "mobile" },
			{ kind: "phone", value: "(043) 286-7386", phoneType: "landline" }
		],
		source: legacyDirectorySource
	},
	{
		name: "Luna Goco Medical Center",
		contacts: [
			{ kind: "phone", value: "0919-097-9155", phoneType: "mobile" },
			{ kind: "phone", value: "0947-897-0588", phoneType: "mobile" },
			{ kind: "phone", value: "(043) 286-7208", phoneType: "landline" }
		],
		source: legacyDirectorySource
	},
	{
		name: "Mindoro Medical Center",
		contacts: [{ kind: "phone", value: "0917-567-8102", phoneType: "mobile" }],
		source: legacyDirectorySource
	}
];

export const contactSections = [
	{ id: "emergency-hotlines", heading: "Emergency Hotlines", organizations: emergencyHotlines },
	{
		id: "medical-emergency-hotlines",
		heading: "Medical Emergency Hotlines",
		organizations: medicalEmergencyHotlines,
		showLocationActions: true
	}
] as const satisfies readonly ContactSection[];
