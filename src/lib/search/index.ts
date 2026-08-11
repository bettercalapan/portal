import type { RouteId } from "$app/types";

export const index: { title: string; url: RouteId; keywords: string[] }[] = [
	{
		title: "Government",
		url: "/(content)/government",
		keywords: ["government", "officials", "departments", "barangays"]
	},
	{
		title: "Officials",
		url: "/(content)/government/officials",
		keywords: [
			"government",
			"officials",
			"executive branch",
			"legislative branch",
			"mayor",
			"vice mayor",
			"city councilor"
		]
	},
	{
		title: "Departments",
		url: "/(content)/government/departments",
		keywords: ["government", "departments"]
	},
	{
		title: "Barangays",
		url: "/(content)/government/barangays",
		keywords: ["government", "barangays", "bayanan II"]
	},
	{
		title: "Services",
		url: "/(content)/services",
		keywords: [
			"services",
			"certificates",
			"business",
			"tax payments",
			"social services",
			"health",
			"agriculture",
			"infrastructure",
			"education",
			"public safety",
			"environment"
		]
	},
	{
		title: "Certificates",
		url: "/(content)/services/certificates",
		keywords: [
			"services",
			"certificates",
			"birth certificate",
			"marriage certificate",
			"death certificate",
			"barangay clearance",
			"barangay id",
			"police clearance",
			`driver's license`,
			"city civil registry"
		]
	},
	{
		title: "Birth Certificate",
		url: "/(content)/services/certificates/birth-certificate",
		keywords: [
			"birth certificate",
			"services",
			"certificates",
			"owner",
			"representative",
			"valid id",
			"original",
			"photocopy",
			"150",
			"authorization letter",
			"eligibility",
			"civil registrar",
			"civil registry",
			"request form"
		]
	},
	{
		title: "Marriage Certificate",
		url: "/(content)/services/certificates/marriage-certificate",
		keywords: [
			"marriage certificate",
			"certificate of marriage",
			"marriage registration",
			"civil registry",
			"civil registrar",
			"marriage license",
			"late registration",
			"authorized representative",
			"services",
			"certificates"
		]
	},
	{
		title: "Death Certificate",
		url: "/(content)/services/certificates/death-certificate",
		keywords: [
			"death certificate",
			"certificate of death",
			"death registration",
			"burial permit",
			"transfer permit",
			"late registration",
			"civil registry",
			"philippine statistics authority",
			"psa",
			"services",
			"certificates"
		]
	},
	{
		title: "Barangay Clearance",
		url: "/(content)/services/certificates/barangay-clearance",
		keywords: [
			"barangay clearance",
			"clearance",
			"barangay hall",
			"proof of residency",
			"good standing",
			"authorized representative",
			"services",
			"certificates"
		]
	},
	{
		title: "Barangay ID",
		url: "/(content)/services/certificates/barangay-id",
		keywords: [
			"barangay id",
			"barangay identification card",
			"local id",
			"barangay hall",
			"proof of residency",
			"id application",
			"id replacement",
			"services",
			"certificates"
		]
	},
	{
		title: "Police Clearance",
		url: "/(content)/services/certificates/police-clearance",
		keywords: [
			"police clearance",
			"pnp clearance",
			"philippine national police",
			"police station",
			"online appointment",
			"biometrics",
			"background check",
			"services",
			"certificates"
		]
	},
	{
		title: "Driver's License",
		url: "/(content)/services/certificates/drivers-license",
		keywords: [
			"driver's license",
			"drivers license",
			"driving license",
			"lto",
			"land transportation office",
			"license renewal",
			"student permit",
			"medical certificate",
			"driving test",
			"services",
			"certificates"
		]
	},
	{
		title: "Business",
		url: "/(content)/services/business",
		keywords: [
			"business",
			"services",
			"business permit",
			"special permit",
			"business status certificate",
			"certified true copy of business license and mayor's permit",
			"occupational permit",
			"safety seal certificate",
			"calapan city hall"
		]
	},
	{
		title: "Business Permit",
		url: "/(content)/services/business/business-permit",
		keywords: [
			"business permit",
			"business license",
			"mayor's permit",
			"permit application",
			"permit renewal",
			"bplo",
			"business permit and licensing office",
			"services",
			"business"
		]
	},
	{
		title: "Business Status Certificate",
		url: "/(content)/services/business/business-status-certificate",
		keywords: [
			"business status certificate",
			"business certification",
			"business status verification",
			"business records",
			"bplo",
			"business permit and licensing office",
			"services",
			"business"
		]
	},
	{
		title: "Certified True Copy of Business License and Mayor's Permit",
		url: "/(content)/services/business/ctc-business-license",
		keywords: [
			"certified true copy",
			"ctc business license",
			"business license",
			"mayor's permit",
			"bplo",
			"business permit and licensing office",
			"services",
			"business"
		]
	},
	{
		title: "Occupational Permit",
		url: "/(content)/services/business/occupational-permit",
		keywords: [
			"occupational permit",
			"occupational mayor's permit",
			"worker permit",
			"employee permit",
			"first-time job seeker",
			"food handler",
			"bplo",
			"services",
			"business"
		]
	},
	{
		title: "Safety Seal Certificate",
		url: "/(content)/services/business/safety-seal-certificate",
		keywords: [
			"safety seal certificate",
			"safety seal certification",
			"minimum public health standards",
			"mphs",
			"health and safety protocols",
			"business inspection",
			"bplo",
			"services",
			"business"
		]
	},
	{
		title: "Special Permit",
		url: "/(content)/services/business/special-permit",
		keywords: [
			"special permit",
			"business establishment permit",
			"unified application form",
			"business name registration",
			"zoning fees",
			"bplo",
			"business permit and licensing office",
			"services",
			"business"
		]
	},
	{
		title: "Statistics",
		url: "/(content)/statistics",
		keywords: ["statistics"]
	},
	{
		title: "Contact",
		url: "/(content)/contact",
		keywords: ["contact"]
	},
	{
		title: "Report a website issue",
		url: "/(content)/report",
		keywords: ["report", "website issue", "incorrect content", "broken link", "accessibility"]
	},
	{
		title: "Terms of Use",
		url: "/(content)/terms-of-use",
		keywords: ["terms of use, conditions"]
	},
	{
		title: "Privacy Policy",
		url: "/(content)/privacy-policy",
		keywords: ["privacy policy"]
	},
	{
		title: "Accessibility",
		url: "/(content)/accessibility",
		keywords: ["accessibility"]
	},
	{
		title: "Sitemap",
		url: "/(content)/sitemap",
		keywords: ["sitemap"]
	}
];
