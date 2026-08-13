<script lang="ts">
	import { page } from "$app/state";
	import SearchInput from "$lib/components/macro/search-input.svelte";
	import { normalizeSearchTerm } from "$lib/search/search-query";
	import { getResults } from "$lib/search/search";
	import { filterResults } from "$lib/search/search";
	import type { SearchRecord } from "$lib/search/index";
	import { listItem } from "$lib/snippets/list-item.snippet.svelte";

	const term = $derived(normalizeSearchTerm(page.url.searchParams.get("term")));
	let results = $derived(term ? getResults(term) : []);
	let filter = $state<SearchRecord["type"] | "all">("all");
	let filteredResults = $derived(filterResults(results, filter));
	const filters: Array<SearchRecord["type"] | "all"> = [
		"all",
		"service",
		"government",
		"barangay",
		"contact",
		"page"
	];
</script>

<div class="primary-wrapper">
	<div class="search">
		<label for="search">Search BetterCalapan.org</label>
		<div class="search-input">
			<SearchInput {term} showResults={false} />
		</div>
		{#if term}
			<p class="result-count">
				{filteredResults.length}
				{filteredResults.length === 1 ? "result" : "results"}
			</p>
			<div class="filters" aria-label="Filter search results">
				{#each filters as item (item)}
					<button class:active={filter === item} type="button" onclick={() => (filter = item)}
						>{item}</button
					>
				{/each}
			</div>
		{/if}
	</div>
	<ul class="results">
		{#if !term}
			<li>Enter a search term to find information on BetterCalapan.org.</li>
		{:else if filteredResults.length == 0}
			<li>
				No result found. Try a service name, a barangay, an official, or an emergency hotline.
			</li>
		{:else}
			{#each filteredResults as result (result.item.id)}
				{@render listItem(`${result.item.title} (${result.item.type})`, result.item.url)}
			{/each}
		{/if}
	</ul>
</div>

<style>
	.primary-wrapper {
		.search {
			display: flex;
			flex-direction: column;
			gap: 0.75rem;
			max-width: 40rem;

			label {
				font-weight: 700;
				font-size: 2rem;
				line-height: 1.25;
			}
			.search-input {
				position: relative;
			}
			.result-count {
				margin-left: 0.25rem;
			}
		}

		.results {
			margin-top: 2rem;
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
		}

		.filters {
			display: flex;
			flex-wrap: wrap;
			gap: 0.5rem;

			button {
				padding: 0.375rem 0.75rem;
				border: 1px solid var(--fg-secondary);
				border-radius: 1rem;
				background: transparent;
				text-transform: capitalize;
			}

			button.active {
				background: var(--fg);
				color: var(--bg);
			}
		}
	}

	@media (min-width: 900px) {
		.primary-wrapper {
			.search {
				label {
					font-size: 3rem;
				}
			}
		}
	}
</style>
