import type { RequestHandler } from "./$types";
import { publishedPages } from "$lib/data/site.data";
import {
	createSitemapXml,
	expectRegisteredPaths,
	getSitemapOrigin,
	getSitemapPaths
} from "$lib/server/sitemap";

const routeFiles = Object.keys(import.meta.glob("/src/routes/**/+page.{svelte,svx}"));
const paths = getSitemapPaths(routeFiles);
expectRegisteredPaths(
	paths,
	publishedPages.map((page) => page.href)
);

export const GET: RequestHandler = ({ url }) => {
	return new Response(createSitemapXml(paths, getSitemapOrigin(url)), {
		headers: {
			"Cache-Control": "public, max-age=0, s-maxage=3600",
			"Content-Type": "application/xml; charset=utf-8"
		}
	});
};
