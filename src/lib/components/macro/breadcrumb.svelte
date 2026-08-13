<script lang="ts">
	import { resolve } from "$app/paths";
	import type { InternalHref } from "$lib/types/civic.types";
	import { resolveRoute } from "$lib/utils/paths";

	type BreadcrumbItem = {
		name: string;
		url: InternalHref;
	};

	let {
		breadcrumbs = [],
		currentPage
	}: {
		breadcrumbs?: BreadcrumbItem[];
		currentPage: string;
	} = $props();
</script>

<nav aria-label="Breadcrumb">
	<ol>
		<li><a href={resolve("/")}>Home</a></li>

		{#each breadcrumbs as breadcrumb (breadcrumb.url)}
			<li>
				<span class="separator" aria-hidden="true">&gt;</span>
				<a href={resolveRoute(breadcrumb.url)}>{breadcrumb.name}</a>
			</li>
		{/each}

		<li aria-current="page">
			<span class="separator" aria-hidden="true">&gt;</span>
			<span class="current-page">{currentPage}</span>
		</li>
	</ol>
</nav>

<style>
	ol,
	li {
		display: flex;
		align-items: center;
	}

	ol {
		flex-wrap: wrap;
		gap: 0.5rem;
		padding: 0;
		list-style: none;
	}

	li {
		gap: 0.5rem;
	}

	a:hover,
	.current-page {
		text-decoration: underline;
	}
</style>
