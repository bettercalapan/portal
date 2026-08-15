<script lang="ts">
	import Breadcrumb from "$lib/components/macro/breadcrumb.svelte";
	import IssueReportPrompt from "$lib/components/macro/issue-report-prompt.svelte";
	import OnThisPage from "$lib/components/macro/on-this-page.svelte";
	import RelatedContent from "$lib/components/macro/related-content.svelte";
	import type { InternalHref } from "$lib/types/civic.types";
	import type { Snippet } from "svelte";

	type LinkItem = {
		name: string;
		url: InternalHref;
	};
	type PageSection = {
		id: string;
		name: string;
	};

	let {
		breadcrumbs = [],
		children,
		onThisPage = [],
		relatedContent = [],
		showIssueReportPrompt = true,
		title
	}: {
		breadcrumbs?: LinkItem[];
		children: Snippet;
		onThisPage?: PageSection[];
		relatedContent?: LinkItem[];
		showIssueReportPrompt?: boolean;
		title: string;
	} = $props();
</script>

<Breadcrumb {breadcrumbs} currentPage={title} />

<div class="content-layout" class:has-sidebar={onThisPage.length > 0 || relatedContent.length > 0}>
	<article class="article-content">
		{@render children()}
		{#if showIssueReportPrompt}
			<IssueReportPrompt />
		{/if}
		{#if onThisPage.length > 0}
			<span class="article-end" data-content-end aria-hidden="true"></span>
		{/if}
	</article>

	{#if onThisPage.length > 0 || relatedContent.length > 0}
		<aside class="content-sidebar">
			{#if onThisPage.length > 0}
				<OnThisPage {onThisPage} />
			{/if}
			{#if relatedContent.length > 0}
				<RelatedContent {relatedContent} />
			{/if}
		</aside>
	{/if}
</div>

<style>
	.content-sidebar {
		display: none;
		min-width: 0;
	}

	.article-end {
		display: block;
		width: 1px;
		height: 1px;
	}

	:global(p) {
		max-width: 50rem;
	}

	@media (min-width: 900px) {
		.content-layout.has-sidebar {
			display: grid;
			grid-template-columns: 1fr 20rem;
			gap: 8rem;
		}

		.content-sidebar {
			margin-top: 2.25rem;
			margin-inline: -0.25rem;
			padding: 0.25rem;
			position: sticky;
			top: 2.5rem;
			display: flex;
			flex-direction: column;
			align-self: start;
			gap: 2rem;
			max-height: calc(100vh - 2rem);
			overflow-y: auto;
		}

		:global(.article-content h1) {
			font-size: 3rem;
		}
	}
</style>
