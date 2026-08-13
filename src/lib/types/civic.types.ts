import type { PathnameWithSearchOrHash } from "$app/types";
import type { PhoneType } from "$lib/utils/contact";

export type InternalHref = PathnameWithSearchOrHash;

export type SourceReference = {
	name: string;
	url: `https://${string}`;
};

export type DataSource = {
	sources: readonly SourceReference[];
	lastVerified: `${number}-${number}-${number}`;
	asOf?: string;
	methodology?: string;
	note?: string;
};

export type ContactMethod =
	{ kind: "email"; value: string } | { kind: "phone"; value: string; phoneType: PhoneType };

export type OfficeRecord = {
	id: string;
	name: string;
	address: string;
	hours: string;
	contacts: readonly ContactMethod[];
	source: DataSource;
};

export type Fee =
	| { status: "fixed"; details: string }
	| { status: "free"; details: string }
	| { status: "variable"; details: string }
	| { status: "unknown"; details: string };

export type ServiceRecord = {
	id: string;
	title: string;
	href: InternalHref;
	category: "certificates" | "business";
	summary: string;
	aliases: readonly string[];
	requirements: readonly string[];
	fee: Fee;
	office?: OfficeRecord;
	locationMode?: "barangay";
	source: DataSource;
};

export type PublishedPage = {
	id: string;
	title: string;
	href: InternalHref;
	section: "main" | "services" | "government" | "other";
	keywords: readonly string[];
	navigation?: boolean;
	footer?: boolean;
	sitemap?: boolean;
};
