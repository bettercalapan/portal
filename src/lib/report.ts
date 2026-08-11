export const reportCategories = [
	{ value: "content", label: "Incorrect or outdated content" },
	{ value: "technical", label: "Broken link or technical problem" },
	{ value: "accessibility", label: "Accessibility problem" },
	{ value: "other", label: "Something else" }
] as const;

export type ReportCategory = (typeof reportCategories)[number]["value"];

export type ReportValues = {
	category: string;
	pageUrl: string;
	message: string;
	email: string;
};

export type ReportErrors = Partial<Record<keyof ReportValues | "verification" | "form", string>>;

export type ReportFormState = {
	success?: boolean;
	values?: ReportValues;
	errors?: ReportErrors;
};

export const emptyReportValues: ReportValues = {
	category: "",
	pageUrl: "",
	message: "",
	email: ""
};
