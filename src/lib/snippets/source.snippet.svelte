<script module lang="ts">
	import Info from "@lucide/svelte/icons/info";

	export { source };
</script>

{#snippet source(description: string, linkLabel: string, linkURL: string)}
	<div class="source">
		<div class="icon">
			<Info />
		</div>
		<p>
			{description}
			<a class="source-link" href={linkURL} target="_blank" rel="external noopener noreferrer">
				{linkLabel}
			</a>.
		</p>
	</div>
{/snippet}

<style>
	:global(.source) {
		margin-top: 1rem;
		display: grid;
		grid-template-columns: 18px 1fr;
		align-items: start;
		gap: 0.75rem;

		:global(.icon) {
			margin-top: 0.125rem;
		}

		:global(.source-link) {
			text-decoration: underline;

			:global(&:hover) {
				text-decoration: none;
			}
		}
	}
</style>
