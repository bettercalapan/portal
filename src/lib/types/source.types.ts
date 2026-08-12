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
