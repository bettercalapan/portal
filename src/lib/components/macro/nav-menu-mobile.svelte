<script lang="ts">
	import { NavigationMenu } from "bits-ui";
	import { pageSections } from "$lib/data/header.data";
	import { navItem } from "$lib/snippets/nav-item.snippet.svelte";
	import Menu from "@lucide/svelte/icons/menu";
</script>

<NavigationMenu.Root class="page-section-mobile-root">
	<NavigationMenu.List class="page-section-mobile-list">
		<NavigationMenu.Item class="page-section-mobile-item">
			<NavigationMenu.Trigger class="page-section-mobile-trigger" aria-label="Menu button">
				<Menu />
			</NavigationMenu.Trigger>
			<NavigationMenu.Content class="page-section-mobile-content">
				<ul>
					{#each pageSections as pageSection (pageSection.name)}
						{@render navItem({
							name: pageSection.name[0].toUpperCase() + pageSection.name.slice(1),
							url: pageSection.url
						})}
					{/each}
				</ul>
			</NavigationMenu.Content>
		</NavigationMenu.Item>
	</NavigationMenu.List>
</NavigationMenu.Root>

<style>
	:global(.page-section-mobile-root) {
		display: block;
	}
	:global(.page-section-mobile-list) {
		display: flex;
		gap: 2rem;
	}
	:global(.page-section-mobile-trigger) {
		display: grid;
		place-items: center;
	}
	:global(.page-section-mobile-trigger),
	:global(.page-section-mobile-link) {
		background: none;
		border: none;
		font-weight: 600;
	}
	:global(.page-section-mobile-trigger a) {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
	}
	:global(.page-section-mobile-trigger a:hover),
	:global(.page-section-mobile-link:hover) {
		text-decoration: underline;
	}
	:global(.page-section-mobile-content) {
		padding: 1.25rem 1.5rem;
		width: calc(100dvw - 2rem);
		position: absolute;
		top: calc(100% + 0.5rem);
		left: auto;
		right: 0;
		background-color: var(--neutral-light);
		border-radius: 2rem;
		box-shadow: rgba(149, 157, 165, 0.1) 0px 8px 24px;
		transform-origin: top left;
		animation-duration: 160ms;
		animation-timing-function: ease-out;
		animation-fill-mode: both;
		z-index: 2; /* NOTE: to stack above the highlighted city in the hero section */
	}

	:global(.page-section-mobile-content[data-state="open"]) {
		animation-name: content-in;
	}

	:global(.page-section-mobile-content[data-state="closed"]) {
		animation-name: content-out;
		animation-duration: 120ms;
		animation-timing-function: ease-in;
	}

	:global(.page-section-mobile-content ul) {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	:global(.page-section-mobile-content ul li:hover) {
		text-decoration: underline;
	}

	@media (min-width: 500px) {
		:global(.page-section-mobile-content) {
			width: max-content;
			min-width: 250px;
			position: absolute;
			left: auto;
			right: 1rem;
		}
	}

	@media (min-width: 900px) {
		:global(.page-section-mobile-root) {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.page-section-mobile-content) {
			animation: none;
		}
	}
</style>
