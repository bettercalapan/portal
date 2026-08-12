import type { Link } from "$lib/types/link.types";
import type { DataSource } from "$lib/types/source.types";

const servicePrefix = "/(content)/services";
export const services: {
	heading: string;
	description: string;
	data: Link[];
} = {
	heading: "Services",
	description: "See all the services offered in Calapan, divided into categories.",
	data: [
		{
			name: "Certificates",
			url: `${servicePrefix}/certificates`
		},
		{
			name: "Business",
			url: `${servicePrefix}/business`
		}
	]
};

const certificatePrefix = `${servicePrefix}/certificates`;
export const certificates: {
	heading: string;
	description: string;
	data: Link[];
} = {
	heading: "Certificates",
	description: "Official documents for birth, marriage, death, and other vital records.",
	data: [
		{
			name: "Birth Certificate",
			url: `${certificatePrefix}/birth-certificate`
		},
		{
			name: "Marriage Certificate",
			url: `${certificatePrefix}/marriage-certificate`
		},
		{
			name: "Death Certificate",
			url: `${certificatePrefix}/death-certificate`
		},
		{
			name: "Barangay Clearance",
			url: `${certificatePrefix}/barangay-clearance`
		},
		{
			name: "Barangay ID",
			url: `${certificatePrefix}/barangay-id`
		},
		{
			name: "Police Clearance",
			url: `${certificatePrefix}/police-clearance`
		},
		{
			name: `Driver's License`,
			url: `${certificatePrefix}/drivers-license`
		}
	]
};

const businessPrefix = `${servicePrefix}/business`;
export const business: {
	heading: string;
	description: string;
	data: Link[];
} = {
	heading: "Business",
	description: "Business permits, licenses, and trade registration services.",
	data: [
		{
			name: "Business Permit",
			url: `${businessPrefix}/business-permit`
		},
		{
			name: "Special Permit",
			url: `${businessPrefix}/special-permit`
		},
		{
			name: "Business Status Certificate",
			url: `${businessPrefix}/business-status-certificate`
		},
		{
			name: "Certified True Copy of Business License & Mayor's Permit",
			url: `${businessPrefix}/ctc-business-license`
		},
		{
			name: "Occupational Permit",
			url: `${businessPrefix}/occupational-permit`
		},
		{
			name: "Safety Seal Certificate",
			url: `${businessPrefix}/safety-seal-certificate`
		}
	]
};

const civilRegistrySource = {
	sources: [
		{
			name: "Official government website",
			url: "https://cityofcalapan.gov.ph/downloadable-forms-2/"
		}
	],
	lastVerified: "2026-08-12",
	note: "Confirm current fees and processing times with the City Civil Registry before applying."
} as const satisfies DataSource;

const barangayServiceSource = {
	sources: [
		{
			name: "Official government website",
			url: "https://cityofcalapan.gov.ph/barangays/"
		}
	],
	lastVerified: "2026-08-12",
	note: "Requirements, fees, and processing times vary by barangay; confirm them with your barangay hall."
} as const satisfies DataSource;

const policeClearanceSource = {
	sources: [
		{
			name: "PNP Clearance System",
			url: "https://pnpclearance.ph/"
		}
	],
	lastVerified: "2026-08-12",
	note: "The national portal is authoritative for the application process; confirm local appointment availability in the portal."
} as const satisfies DataSource;

const driversLicenseSource = {
	sources: [
		{
			name: "Land Transportation Office",
			url: "https://lto.gov.ph/"
		}
	],
	lastVerified: "2026-08-12",
	note: "Confirm current requirements, fees, and appointment availability with LTO before visiting."
} as const satisfies DataSource;

const businessServiceSource = {
	sources: [
		{
			name: "Official government website",
			url: "https://cityofcalapan.gov.ph/business-permit-and-licensing-office/"
		}
	],
	lastVerified: "2026-08-12",
	note: "The official page confirms the responsible office and service scope. Confirm current documentary requirements, fees, and processing times with BPLO."
} as const satisfies DataSource;

export const serviceSources = {
	birthCertificate: civilRegistrySource,
	marriageCertificate: civilRegistrySource,
	deathCertificate: civilRegistrySource,
	barangayClearance: barangayServiceSource,
	barangayId: barangayServiceSource,
	policeClearance: policeClearanceSource,
	driversLicense: driversLicenseSource,
	businessPermit: businessServiceSource,
	specialPermit: businessServiceSource,
	businessStatusCertificate: businessServiceSource,
	ctcBusinessLicense: businessServiceSource,
	occupationalPermit: businessServiceSource,
	safetySealCertificate: businessServiceSource
} as const satisfies Record<string, DataSource>;
