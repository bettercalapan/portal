import Fuse from "fuse.js/min-basic";
import { index, type SearchRecord } from "$lib/search/index";

const fuse = new Fuse(index, {
	keys: ["title", "keywords"],
	threshold: 0.1
});

export function getResults(term: string) {
	return fuse.search(term);
}

export function filterResults(
	results: ReturnType<typeof getResults>,
	type: SearchRecord["type"] | "all"
) {
	return type === "all" ? results : results.filter((result) => result.item.type === type);
}
