import { contactSections, generalContacts } from "$lib/data/contact.data";
import { barangays, departments, executive, legislative } from "$lib/data/government.data";
import { offices } from "$lib/data/offices.data";
import { publishedPages } from "$lib/data/site.data";
import { serviceRecords } from "$lib/data/services.data";
import type { InternalHref } from "$lib/types/civic.types";

export type SearchRecord = {
	id: string;
	title: string;
	url: InternalHref;
	keywords: readonly string[];
	type: "page" | "service" | "government" | "barangay" | "contact";
};

const serviceHrefs = new Set<InternalHref>(
	Object.values(serviceRecords).map((service) => service.href)
);

const pages: SearchRecord[] = publishedPages
	.filter((page) => !serviceHrefs.has(page.href))
	.map((page) => ({
		id: `page:${page.id}`,
		title: page.title,
		url: page.href,
		keywords: [
			...page.keywords,
			...(page.id === "contact" ? generalContacts.map((contact) => contact.value) : [])
		],
		type: "page"
	}));

const services: SearchRecord[] = Object.values(serviceRecords).map((service) => ({
	id: `service:${service.id}`,
	title: service.title,
	url: service.href,
	keywords: [
		service.summary,
		...service.aliases,
		...service.requirements,
		service.fee.details,
		service.fee.status,
		service.category,
		...("office" in service ? [service.office.name, service.office.address] : ["barangay hall"])
	],
	type: "service"
}));

const government: SearchRecord[] = [
	...[...executive, ...legislative].map((official) => ({
		id: `official:${official.name.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`,
		title: official.name,
		url: "/government/officials" as const,
		keywords: [
			official.title,
			"official",
			"government",
			...("description" in official && official.description ? [official.description] : []),
			...("email" in official ? [official.email, official.phoneNumber, official.workingHours] : [])
		],
		type: "government" as const
	})),
	...departments.data.map((department) => ({
		id: `department:${department.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`,
		title: department,
		url: "/government/departments" as const,
		keywords: ["department", "government", "office"],
		type: "government" as const
	})),
	...Object.values(offices).map((office) => ({
		id: `office:${office.id}`,
		title: office.name,
		url: "/government/departments" as const,
		keywords: [office.address, office.hours, ...office.contacts.map((contact) => contact.value)],
		type: "government" as const
	}))
];

const barangayRecords: SearchRecord[] = barangays.data.map((barangay) => ({
	id: `barangay:${barangay.name.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`,
	title: barangay.name,
	url: "/government/barangays",
	keywords: ["barangay", barangay.captain, barangay.phoneNumber, ...(barangay.aliases ?? [])],
	type: "barangay"
}));

const contacts: SearchRecord[] = [
	...contactSections.flatMap((section) =>
		section.organizations.map((organization) => ({
			id: `contact:${organization.name.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`,
			title: organization.name,
			url: "/contact" as const,
			keywords: [
				section.heading,
				"emergency",
				"hotline",
				...organization.contacts.map((contact) => contact.value)
			],
			type: "contact" as const
		}))
	)
];

export const index: SearchRecord[] = [
	...pages,
	...services,
	...government,
	...barangayRecords,
	...contacts
];
