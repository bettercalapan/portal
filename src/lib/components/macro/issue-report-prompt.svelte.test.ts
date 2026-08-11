import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import IssueReportPrompt from "./issue-report-prompt.svelte";

describe("IssueReportPrompt", () => {
	it("links to the report page with the current page prefilled", async () => {
		const screen = await render(IssueReportPrompt);
		const link = screen.getByRole("link", { name: "report" });

		await expect.element(link).toHaveAttribute("href", "/report?page=%2F");
		await expect
			.element(screen.getByText("Found an issue with this page? Send us a report."))
			.toBeVisible();
	});
});
