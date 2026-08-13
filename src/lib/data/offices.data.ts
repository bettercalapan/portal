import type { DataSource, OfficeRecord } from "$lib/types/civic.types";

const cityOfficeSource = {
	sources: [
		{
			name: "Official City of Calapan website",
			url: "https://cityofcalapan.gov.ph/"
		}
	],
	lastVerified: "2026-08-12",
	note: "Confirm current office hours and contact details before visiting."
} as const satisfies DataSource;

export const offices = {
	civilRegistry: {
		id: "civil-registry",
		name: "City Civil Registry Department",
		address: "95HM+H9J Calapan City Hall, Roxas Dr, Calapan City, 5200 Oriental Mindoro",
		hours: "Mon-Fri: 8 AM - 5 PM",
		contacts: [{ kind: "phone", value: "(043) 288-2412", phoneType: "landline" }],
		source: cityOfficeSource
	},
	businessPermitAndLicensing: {
		id: "business-permit-and-licensing",
		name: "Business Permit and Licensing Office",
		address: "95HM+H9J Calapan City Hall, Roxas Dr, Calapan City, 5200 Oriental Mindoro",
		hours: "Mon-Fri: 8 AM - 5 PM",
		contacts: [{ kind: "phone", value: "+63432882496", phoneType: "landline" }],
		source: cityOfficeSource
	},
	policeHeadquarters: {
		id: "calapan-police-headquarters",
		name: "Calapan Police Headquarters",
		address: "Camp Efigenio C Navarro, Calapan City, Oriental Mindoro",
		hours: "Mon-Fri: 8 AM - 5 PM",
		contacts: [],
		source: cityOfficeSource
	},
	landTransportationOffice: {
		id: "land-transportation-office",
		name: "Land Transportation Office",
		address: "95Q9+QWC Land Transportation Office, Calapan City, Oriental Mindoro",
		hours: "Mon-Fri: 8 AM - 5 PM",
		contacts: [],
		source: cityOfficeSource
	}
} as const satisfies Record<string, OfficeRecord>;

export type { OfficeRecord } from "$lib/types/civic.types";
