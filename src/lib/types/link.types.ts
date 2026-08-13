import type { InternalHref } from "$lib/types/civic.types";

export type Link = {
	name: string;
	url: InternalHref;
};
export type ExternalLink = {
	name: string;
	url: string;
};
