<script lang="ts">
	import { page } from "$app/state";
	import SearchInput from "$lib/components/macro/search-input.svelte";
	import { normalizeSearchTerm } from "$lib/search/search-query";
	import { getResults } from "$lib/search/search";
	import { listItem } from "$lib/snippets/list-item.snippet.svelte";

	const term = $derived(normalizeSearchTerm(page.url.searchParams.get("term")));
	let results = $derived(term ? getResults(term) : []);
</script>

<div class="primary-wrapper">
	<div class="search">
		<label for="search">Search BetterCalapan.org</label>
		<div class="search-input">
			<SearchInput {term} showResults={false} />
		</div>
		{#if term}
			<p class="result-count">{results.length} {results.length === 1 ? "result" : "results"}</p>
		{/if}
	</div>
	<ul class="results">
		{#if !term}
			<li>Enter a search term to find information on BetterCalapan.org.</li>
		{:else if results.length == 0}
			<li>No result found. Check spelling or try different keywords.</li>
		{:else}
			{#each results as result (result.item.url)}
				{@render listItem(result.item.title, result.item.url)}
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
