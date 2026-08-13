import { mainNavigation } from "$lib/data/site.data";

export const pageSections = mainNavigation.map(({ title, href }) => ({ name: title, url: href }));
