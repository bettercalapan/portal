import type { Link } from "$lib/types/link.types";

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
