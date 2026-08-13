import { serviceRecords } from "$lib/data/services.data";
import type { PublishedPage } from "$lib/types/civic.types";

const staticPages = [
	{
		id: "home",
		title: "Home",
		href: "/",
		section: "main",
		keywords: ["home", "Calapan"],
		navigation: true,
		sitemap: true
	},
	{
		id: "services",
		title: "Services",
		href: "/services",
		section: "main",
		keywords: ["services", "certificates", "business"],
		navigation: true,
		sitemap: true
	},
	{
		id: "certificates",
		title: "Certificates",
		href: "/services/certificates",
		section: "services",
		keywords: ["certificates", "civil registry"],
		sitemap: true
	},
	{
		id: "business",
		title: "Business",
		href: "/services/business",
		section: "services",
		keywords: ["business", "permits", "BPLO"],
		sitemap: true
	},
	{
		id: "government",
		title: "Government",
		href: "/government",
		section: "main",
		keywords: ["government", "officials", "departments", "barangays"],
		navigation: true,
		sitemap: true
	},
	{
		id: "officials",
		title: "Officials",
		href: "/government/officials",
		section: "government",
		keywords: ["officials", "mayor", "vice mayor", "city councilor"],
		sitemap: true
	},
	{
		id: "departments",
		title: "Departments",
		href: "/government/departments",
		section: "government",
		keywords: ["departments", "government offices"],
		sitemap: true
	},
	{
		id: "barangays",
		title: "Barangays",
		href: "/government/barangays",
		section: "government",
		keywords: ["barangays", "barangay captain"],
		sitemap: true
	},
	{
		id: "statistics",
		title: "Statistics",
		href: "/statistics",
		section: "main",
		keywords: ["statistics", "population", "income"],
		navigation: true,
		sitemap: true
	},
	{
		id: "contact",
		title: "Contact",
		href: "/contact",
		section: "main",
		keywords: ["contact", "emergency", "hotlines"],
		navigation: true,
		sitemap: true
	},
	{
		id: "report",
		title: "Report a website issue",
		href: "/report",
		section: "other",
		keywords: ["report", "website issue", "incorrect content", "broken link", "accessibility"],
		footer: true,
		sitemap: true
	},
	{
		id: "terms-of-use",
		title: "Terms of Use",
		href: "/terms-of-use",
		section: "other",
		keywords: ["terms of use", "conditions"],
		footer: true,
		sitemap: true
	},
	{
		id: "privacy-policy",
		title: "Privacy Policy",
		href: "/privacy-policy",
		section: "other",
		keywords: ["privacy policy"],
		footer: true,
		sitemap: true
	},
	{
		id: "accessibility",
		title: "Accessibility",
		href: "/accessibility",
		section: "other",
		keywords: ["accessibility"],
		footer: true,
		sitemap: true
	},
	{
		id: "sitemap",
		title: "Sitemap",
		href: "/sitemap",
		section: "other",
		keywords: ["sitemap"],
		footer: true,
		sitemap: true
	},
	{
		id: "search",
		title: "Search",
		href: "/search",
		section: "other",
		keywords: ["search", "find services"],
		sitemap: true
	}
] as const satisfies readonly PublishedPage[];

const servicePages = Object.values(serviceRecords).map(
	({ id, title, href, category, aliases, summary }) =>
		({
			id,
			title,
			href,
			section: "services",
			keywords: [summary, ...aliases, category, "requirements", "fees"],
			sitemap: true
		}) as const
);

export const publishedPages: readonly PublishedPage[] = [...staticPages, ...servicePages];

export const mainNavigation = publishedPages.filter((page) => page.navigation);
export const footerPages = publishedPages.filter((page) => page.footer);
export const sitemapPages = publishedPages.filter((page) => page.sitemap);

export function getPublishedPage(href: PublishedPage["href"]) {
	return publishedPages.find((page) => page.href === href);
}
