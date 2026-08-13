import type { RouteId } from "$app/types";

type PageSection = {
	name: string;
	url: RouteId | `${RouteId}#${string}`;
};

const prefix = "/(content)";
export const pageSections: PageSection[] = [
	{
		name: "Services",
		url: `${prefix}/services`
	},
	{
		name: "Government",
		url: `${prefix}/government`
	},
	{
		name: "Statistics",
		url: `${prefix}/statistics`
	},
	{
		name: "Contact",
		url: `${prefix}/contact#emergency-hotlines`
	}
];
