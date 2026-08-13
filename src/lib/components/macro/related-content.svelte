<script lang="ts">
	import { listItem } from "$lib/snippets/list-item.snippet.svelte";
	import type { InternalHref } from "$lib/types/civic.types";

	type RelatedItem = {
		name: string;
		url: InternalHref;
	};

	let { relatedContent }: { relatedContent: RelatedItem[] } = $props();
</script>

<div class="related-content">
	<h2>Related content</h2>
	<ul>
		{#each relatedContent as content (content.url)}
			{@render listItem(content.name, content.url)}
		{/each}
	</ul>
</div>

<style>
	.related-content {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		min-width: 0;
	}

	.related-content :global(.item) {
		width: 100%;
		min-width: 0;
	}

	.related-content :global(.link) {
		min-width: 0;
		overflow-wrap: anywhere;
	}

	ul {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0;
		list-style: none;
	}
</style>
