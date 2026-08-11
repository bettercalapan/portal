<script lang="ts">
	import ContentLayout from "$lib/components/macro/content-layout.svelte";
	import ReportForm from "$lib/components/macro/report-form.svelte";
	import type { ActionData, PageData } from "./$types";

	const relatedContent = [
		{ name: "Accessibility", url: "/(content)/accessibility" },
		{ name: "Privacy Policy", url: "/(content)/privacy-policy" },
		{ name: "Contact", url: "/(content)/contact" }
	];

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>Report a website issue | BetterCalapan</title>
	<meta
		name="description"
		content="Report incorrect content, broken links, accessibility problems, and other website issues to BetterCalapan."
	/>
</svelte:head>

<ContentLayout title="Report a website issue" {relatedContent} showIssueReportPrompt={false}>
	<h1>Report a website issue</h1>
	<p>
		Use this form to tell us about incorrect information, broken links, accessibility problems, or
		other issues with BetterCalapan.
	</p>
	<p>
		Do not include identification numbers, financial information, medical records, passwords, or
		other sensitive information. Reports are sent privately to the BetterCalapan maintainers.
	</p>
	<p>
		To disclose a security vulnerability, do not use this form. Email
		<a href="mailto:security@bettercalapan.org">security@bettercalapan.org</a> or use
		<a
			href="https://github.com/bettercalapan/portal/security/advisories/new"
			target="_blank"
			rel="external noopener noreferrer">GitHub Security Advisories</a
		>.
	</p>

	<ReportForm
		{form}
		initialPageUrl={data.initialPageUrl}
		turnstileSiteKey={data.turnstileSiteKey}
	/>
</ContentLayout>
