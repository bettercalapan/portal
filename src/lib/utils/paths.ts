import { base } from "$app/paths";
import type { ResolvedPathname } from "$app/types";
import type { InternalHref } from "$lib/types/civic.types";

export function resolveRoute<const T extends InternalHref>(url: T): ResolvedPathname {
	return `${base}${url}` as ResolvedPathname;
}
