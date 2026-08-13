<script lang="ts">
	import { resolveRoute } from "$lib/utils/paths";
	import { getResults } from "$lib/search/search";
	import ArrowRight from "@lucide/svelte/icons/arrow-right";

	type Props = {
		term: string;
	};
	let { term }: Props = $props();

	let results = $derived(getResults(term));
</script>

<div class="wrapper">
	<div class="results">
		{#if results.length == 0}
			<p>No result found. Check spelling or try different keywords.</p>
		{:else}
			{#each results.slice(0, 5) as result (result.item.id)}
				<a class="result" href={resolveRoute(result.item.url)}>
					<div class="icon">
						<ArrowRight />
					</div>
					<span>{result.item.title}</span></a
				>
			{/each}
		{/if}
	</div>
</div>

<style>
	.wrapper {
		position: absolute;
		top: calc(100% + 0.75rem);
		left: 0;
		right: 0;

		.results {
			padding: 1rem 1.25rem;
			background-color: var(--fg);
			color: var(--neutral-lightest);
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			border-radius: 2rem;
			box-shadow: rgba(149, 157, 165, 0.1) 0px 8px 24px;

			.result {
				width: max-content;
				max-width: 18rem;
				display: grid;
				grid-template-columns: 20px 1fr;
				gap: 0.5rem;
				border-bottom: 1px solid var(--fg);
				color: var(--neutral-lightest);

				&:hover {
					text-decoration: underline;
				}

				.icon {
					margin-top: 0.125rem;
				}
			}
		}
	}
</style>
