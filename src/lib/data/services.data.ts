import { offices } from "$lib/data/offices.data";
import type { ServiceRecord } from "$lib/types/civic.types";
import type { Link } from "$lib/types/link.types";

const servicePrefix = "/services";

const civilRegistrySource = {
	sources: [
		{
			name: "Official government website",
			url: "https://cityofcalapan.gov.ph/downloadable-forms-2/"
		}
	],
	lastVerified: "2026-08-12",
	note: "Confirm current fees and processing times with the City Civil Registry before applying."
} as const;

const barangayServiceSource = {
	sources: [
		{
			name: "Official government website",
			url: "https://cityofcalapan.gov.ph/barangays/"
		}
	],
	lastVerified: "2026-08-12",
	note: "Requirements, fees, and processing times vary by barangay; confirm them with your barangay hall."
} as const;

const policeClearanceSource = {
	sources: [{ name: "PNP Clearance System", url: "https://pnpclearance.ph/" }],
	lastVerified: "2026-08-12",
	note: "The national portal is authoritative for the application process; confirm local appointment availability in the portal."
} as const;

const driversLicenseSource = {
	sources: [{ name: "Land Transportation Office", url: "https://lto.gov.ph/" }],
	lastVerified: "2026-08-12",
	note: "Confirm current requirements, fees, and appointment availability with LTO before visiting."
} as const;

const businessServiceSource = {
	sources: [
		{
			name: "Official government website",
			url: "https://cityofcalapan.gov.ph/business-permit-and-licensing-office/"
		}
	],
	lastVerified: "2026-08-12",
	note: "The official page confirms the responsible office and service scope. Confirm current documentary requirements, fees, and processing times with BPLO."
} as const;

export const serviceRecords = {
	birthCertificate: {
		id: "birth-certificate",
		title: "Birth Certificate",
		href: `${servicePrefix}/certificates/birth-certificate`,
		category: "certificates",
		summary: "Official certified copy of a birth certificate registered in Calapan.",
		aliases: ["certificate of live birth", "birth record", "civil registry"],
		requirements: [
			"Valid government-issued ID",
			"Authorization letter and IDs when applying for someone else"
		],
		fee: { status: "fixed", details: "PHP 150 per certified copy." },
		office: offices.civilRegistry,
		source: civilRegistrySource
	},
	marriageCertificate: {
		id: "marriage-certificate",
		title: "Marriage Certificate",
		href: `${servicePrefix}/certificates/marriage-certificate`,
		category: "certificates",
		summary:
			"Register a marriage or request a certificate of marriage from the City Civil Registry.",
		aliases: ["certificate of marriage", "marriage registration", "COM"],
		requirements: [
			"Accomplished Certificate of Marriage",
			"Valid IDs of both spouses",
			"Marriage license when applicable"
		],
		fee: {
			status: "variable",
			details: "Registration is free; a copy request is PHP 75 per copy."
		},
		office: offices.civilRegistry,
		source: civilRegistrySource
	},
	deathCertificate: {
		id: "death-certificate",
		title: "Death Certificate",
		href: `${servicePrefix}/certificates/death-certificate`,
		category: "certificates",
		summary: "Register a death and obtain related certificate or burial permit documents.",
		aliases: ["certificate of death", "death registration", "burial permit"],
		requirements: [
			"Certificate of Death",
			"Valid ID of the informant",
			"Additional PSA and cemetery documents for late registration"
		],
		fee: {
			status: "variable",
			details: "Registration is PHP 75, late registration is PHP 150, plus any burial permit fee."
		},
		office: offices.civilRegistry,
		source: civilRegistrySource
	},
	barangayClearance: {
		id: "barangay-clearance",
		title: "Barangay Clearance",
		href: `${servicePrefix}/certificates/barangay-clearance`,
		category: "certificates",
		summary: "Proof of good standing and residency issued by your barangay.",
		aliases: ["barangay certificate", "residency clearance", "good standing"],
		requirements: [
			"Valid government-issued or barangay ID",
			"Proof of residency if requested",
			"Purpose of the clearance"
		],
		fee: { status: "variable", details: "Fees are set by the issuing barangay." },
		locationMode: "barangay",
		source: barangayServiceSource
	},
	barangayId: {
		id: "barangay-id",
		title: "Barangay ID",
		href: `${servicePrefix}/certificates/barangay-id`,
		category: "certificates",
		summary: "Local identification card issued to verified residents of a barangay.",
		aliases: ["barangay identification card", "local ID", "resident ID"],
		requirements: [
			"Proof of residency in the barangay",
			"Valid ID if available",
			"Completed application form"
		],
		fee: {
			status: "variable",
			details: "Fees and validity periods are set by the issuing barangay."
		},
		locationMode: "barangay",
		source: barangayServiceSource
	},
	policeClearance: {
		id: "police-clearance",
		title: "Police Clearance",
		href: `${servicePrefix}/certificates/police-clearance`,
		category: "certificates",
		summary:
			"National police clearance issued through the Philippine National Police Clearance System.",
		aliases: ["PNP clearance", "police certificate", "national police clearance"],
		requirements: [
			"PNP Clearance System reference number or appointment confirmation when required",
			"At least two valid government-issued IDs"
		],
		fee: {
			status: "variable",
			details: "Follow the current PNP Clearance System payment instructions and service charges."
		},
		office: offices.policeHeadquarters,
		source: policeClearanceSource
	},
	driversLicense: {
		id: "drivers-license",
		title: "Driver's License",
		href: `${servicePrefix}/certificates/drivers-license`,
		category: "certificates",
		summary:
			"Apply for, renew, or update a driver's license through the Land Transportation Office.",
		aliases: ["drivers license", "driving license", "LTO license"],
		requirements: [
			"Existing license for renewal or student permit for new applications",
			"Medical certificate when required",
			"LTO account or appointment confirmation when required"
		],
		fee: {
			status: "variable",
			details: "LTO fees depend on the transaction and license classification."
		},
		office: offices.landTransportationOffice,
		source: driversLicenseSource
	},
	businessPermit: {
		id: "business-permit",
		title: "Business Permit",
		href: `${servicePrefix}/business/business-permit`,
		category: "business",
		summary: "Apply for or renew a permit to operate a business within Calapan.",
		aliases: ["business license", "mayor's permit", "BPLO permit"],
		requirements: [
			"Unified Application Form",
			"Business registration documents",
			"Proof of ownership or lease"
		],
		fee: {
			status: "variable",
			details: "Taxes, fees, and regulatory charges are assessed based on the business."
		},
		office: offices.businessPermitAndLicensing,
		source: businessServiceSource
	},
	specialPermit: {
		id: "special-permit",
		title: "Special Permit",
		href: `${servicePrefix}/business/special-permit`,
		category: "business",
		summary: "Permit for qualifying business establishments operating within Calapan.",
		aliases: ["business establishment permit", "special business permit", "BPLO special permit"],
		requirements: [
			"Unified Application Form",
			"Business registration documents",
			"Proof of ownership or authority to use the property"
		],
		fee: {
			status: "variable",
			details: "Taxes and fees are calculated under the applicable revenue code."
		},
		office: offices.businessPermitAndLicensing,
		source: businessServiceSource
	},
	businessStatusCertificate: {
		id: "business-status-certificate",
		title: "Business Status Certificate",
		href: `${servicePrefix}/business/business-status-certificate`,
		category: "business",
		summary: "Certification of the status of a business registered with the BPLO.",
		aliases: ["business certification", "business status verification", "BPLO certification"],
		requirements: [
			"Request letter stating the purpose",
			"Identification card",
			"Supporting documents requested by BPLO"
		],
		fee: { status: "fixed", details: "PHP 75, plus PHP 15 per additional page." },
		office: offices.businessPermitAndLicensing,
		source: businessServiceSource
	},
	ctcBusinessLicense: {
		id: "ctc-business-license",
		title: "Certified True Copy of Business License & Mayor's Permit",
		href: `${servicePrefix}/business/ctc-business-license`,
		category: "business",
		summary: "Certified true copy of a business license and Mayor's Permit for the business owner.",
		aliases: ["certified true copy", "CTC business license", "CTC mayor's permit"],
		requirements: [
			"Photocopy of the Business License and Mayor's Permit",
			"Identification card",
			"Authorization document when applying through a representative"
		],
		fee: { status: "fixed", details: "PHP 90." },
		office: offices.businessPermitAndLicensing,
		source: businessServiceSource
	},
	occupationalPermit: {
		id: "occupational-permit",
		title: "Occupational Permit",
		href: `${servicePrefix}/business/occupational-permit`,
		category: "business",
		summary: "Permit for workers or employees working within Calapan.",
		aliases: ["occupational mayor's permit", "worker permit", "employee permit"],
		requirements: ["Application form", "Community Tax Certificate", "NBI or Police Clearance"],
		fee: {
			status: "variable",
			details: "Fees are assessed by BPLO; eligible first-time job seekers may have fees waived."
		},
		office: offices.businessPermitAndLicensing,
		source: businessServiceSource
	},
	safetySealCertificate: {
		id: "safety-seal-certificate",
		title: "Safety Seal Certificate",
		href: `${servicePrefix}/business/safety-seal-certificate`,
		category: "business",
		summary: "Certificate for businesses that meet minimum public health standards.",
		aliases: ["safety seal", "safety seal certification", "MPHS certificate"],
		requirements: [
			"Accomplished Safety Seal Certification Form",
			"Valid Business License and Mayor's Permit",
			"Compliance with required health and safety protocols"
		],
		fee: { status: "free", details: "Issuance is free of charge." },
		office: offices.businessPermitAndLicensing,
		source: businessServiceSource
	}
} as const satisfies Record<string, ServiceRecord>;

const serviceLinks = (category: ServiceRecord["category"]): Link[] =>
	Object.values(serviceRecords)
		.filter((service) => service.category === category)
		.map(({ title, href }) => ({ name: title, url: href }));

export const services: { heading: string; description: string; data: Link[] } = {
	heading: "Services",
	description: "See all the services offered in Calapan, divided into categories.",
	data: [
		{ name: "Certificates", url: `${servicePrefix}/certificates` },
		{ name: "Business", url: `${servicePrefix}/business` }
	]
};

export const certificates: { heading: string; description: string; data: Link[] } = {
	heading: "Certificates",
	description: "Official documents for birth, marriage, death, and other vital records.",
	data: serviceLinks("certificates")
};

export const business: { heading: string; description: string; data: Link[] } = {
	heading: "Business",
	description: "Business permits, licenses, and trade registration services.",
	data: serviceLinks("business")
};
