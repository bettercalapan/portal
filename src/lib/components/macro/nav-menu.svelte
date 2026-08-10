<script lang="ts">
	import { NavigationMenu } from "bits-ui";
	import { government } from "$lib/data/government.data";
	import { services } from "$lib/data/services.data";
	import { navItem } from "$lib/snippets/nav-item.snippet.svelte";
	import { resolve } from "$app/paths";
	import ChevronDown from "@lucide/svelte/icons/chevron-down";
</script>

<NavigationMenu.Root class="page-section-root">
	<NavigationMenu.List class="page-section-list">
		<NavigationMenu.Item class="page-section-item">
			<NavigationMenu.Link class="page-section-link" href={resolve("/(content)/services")}>
				Services
			</NavigationMenu.Link>
			<NavigationMenu.Trigger class="page-section-trigger" aria-label="Open Services menu">
				<ChevronDown />
			</NavigationMenu.Trigger>
			<NavigationMenu.Content class="page-section-content">
				<ul>
					{#each services.data as service (service.name)}
						{@render navItem({
							name: service.name,
							url: service.url
						})}
					{/each}
				</ul>
			</NavigationMenu.Content>
		</NavigationMenu.Item>

		<NavigationMenu.Item class="page-section-item">
			<NavigationMenu.Link class="page-section-link" href={resolve("/(content)/government")}>
				Government
			</NavigationMenu.Link>
			<NavigationMenu.Trigger class="page-section-trigger" aria-label="Open Government menu">
				<ChevronDown />
			</NavigationMenu.Trigger>
			<NavigationMenu.Content class="page-section-content">
				<ul>
					{#each government.data as gov (gov.name)}
						{@render navItem({
							name: gov.name,
							url: gov.url
						})}
					{/each}
				</ul>
			</NavigationMenu.Content>
		</NavigationMenu.Item>

		<NavigationMenu.Item class="page-section-item">
			<NavigationMenu.Link class="page-section-link" href={resolve("/(content)/statistics")}
				>Statistics</NavigationMenu.Link
			>
		</NavigationMenu.Item>

		<NavigationMenu.Item class="page-section-item">
			<NavigationMenu.Link class="page-section-link" href={resolve("/(content)/contact")}
				>Contact</NavigationMenu.Link
			>
		</NavigationMenu.Item>
	</NavigationMenu.List>
</NavigationMenu.Root>

<style>
	:global(.page-section-root) {
		display: none;
	}

	@media (min-width: 900px) {
		:global(.page-section-root) {
			display: block;
			position: relative;
		}
		:global(.page-section-list) {
			display: flex;
			gap: 2rem;
		}
		:global(.page-section-item) {
			position: relative;
			display: flex;
			align-items: center;
		}
		:global(.page-section-trigger),
		:global(.page-section-link) {
			min-height: 40px;
			background: none;
			border: none;
			display: inline-flex;
			align-items: center;
			font-weight: 600;
		}
		:global(.page-section-trigger) {
			padding: 0;
			min-width: 40px;
			justify-content: center;
		}
		:global(.page-section-trigger:hover),
		:global(.page-section-link:hover) {
			text-decoration: underline;
		}
		:global(.page-section-content) {
			padding: 1.25rem 1.5rem;
			width: max-content;
			position: absolute;
			top: calc(100% + 8px);
			left: 0;
			background-color: var(--neutral-3);
			border-radius: 2rem;
			transform-origin: top left;
			animation-duration: 160ms;
			animation-timing-function: ease-out;
			animation-fill-mode: both;
			box-shadow: rgba(149, 157, 165, 0.1) 0px 8px 24px;
			z-index: 2; /* NOTE: to stack above the highlighted city in the hero section */
		}

		:global(.page-section-content[data-state="open"]) {
			animation-name: content-in;
		}

		:global(.page-section-content[data-state="closed"]) {
			animation-name: content-out;
			animation-duration: 120ms;
			animation-timing-function: ease-in;
		}

		:global(.page-section-content ul) {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
		}

		:global(.page-section-content ul li:hover) {
			text-decoration: underline;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.page-section-content) {
			animation: none;
		}
	}
</style>
