<script module lang="ts">
	import type { RouteId } from "$app/types";
	import { resolveRoute } from "$lib/utils/paths";
	import ArrowRight from "@lucide/svelte/icons/arrow-right";

	export { listItem };
</script>

{#snippet listItem(name: string, url: RouteId | string)}
	{@const external = url.startsWith("http")}

	{#snippet linkContent()}
		<div class="icon">
			<ArrowRight />
		</div>
		{name}
	{/snippet}

	<li class="item">
		{#if external}
			<a class="link" href={url} target="_blank" rel="external noopener noreferrer">
				{@render linkContent()}
			</a>
		{:else}
			<a class="link" href={resolveRoute(url)}>
				{@render linkContent()}
			</a>
		{/if}
	</li>
{/snippet}

<style>
	:global(.item) {
		width: 100%;

		:global(&:hover) {
			text-decoration: underline;
		}

		:global(.link) {
			display: grid;
			grid-template-columns: 18px 1fr;
			align-items: start;
			gap: 0.75rem;
			text-decoration: none;

			:global(.icon) {
				margin-top: 0.125rem;
				width: 20px;
			}
		}
	}

	@media (min-width: 600px) {
		:global(.item) {
			width: max-content;
		}
	}
</style>
