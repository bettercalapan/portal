<script lang="ts">
	import Info from "@lucide/svelte/icons/info";
	import type { DataSource } from "$lib/types/source.types";

	let { source }: { source: DataSource } = $props();
</script>

<aside class="source" aria-label="Data source and verification">
	<Info aria-hidden="true" />
	<div>
		<p>
			{source.sources.length === 1
				? "Source from "
				: "Sources: "}{#each source.sources as reference, index (reference.url)}<a
					href={reference.url}
					target="_blank"
					rel="external noopener noreferrer">{reference.name}</a
				>{index < source.sources.length - 1 ? ", " : ""}{/each}.
		</p>
	</div>
</aside>

<style>
	.source {
		margin-top: 1rem;
		display: grid;
		grid-template-columns: 18px minmax(0, 1fr);
		align-items: start;
		gap: 0.75rem;
		color: var(--fg-secondary);
		font-size: 0.875rem;
	}

	.source > :global(svg) {
		margin-top: 0.1875rem;
	}

	p {
		margin: 0;
	}

	a {
		color: inherit;
		text-decoration: underline;
	}

	a:hover {
		text-decoration: none;
	}
</style>
