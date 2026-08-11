<script lang="ts">
	import Loader from "@lucide/svelte/icons/loader";
	import { onMount, type Component } from "svelte";

	type ChartComponent = Component<{ interactive?: boolean }>;

	let {
		load,
		mobileHeight,
		desktopHeight = mobileHeight,
		label
	}: {
		load: () => Promise<{ default: ChartComponent }>;
		mobileHeight: number;
		desktopHeight?: number;
		label: string;
	} = $props();

	let container = $state<HTMLElement>();
	let Chart = $state<ChartComponent>();
	let interactive = $state(true);
	let loadFailed = $state(false);

	onMount(() => {
		const mobileViewport = window.matchMedia("(max-width: 519px)");
		let observer: IntersectionObserver | undefined;
		let pendingLoad: Promise<void> | undefined;

		function loadChart() {
			if (!pendingLoad) {
				pendingLoad = load()
					.then((module) => {
						Chart = module.default;
					})
					.catch(() => {
						loadFailed = true;
					});
			}

			return pendingLoad;
		}

		function observeChart() {
			if (Chart || pendingLoad || !container) return;

			if (!("IntersectionObserver" in window)) {
				void loadChart();
				return;
			}

			observer = new IntersectionObserver(
				(entries) => {
					if (!entries.some((entry) => entry.isIntersecting)) return;

					observer?.disconnect();
					observer = undefined;
					void loadChart();
				},
				{ rootMargin: "100px 0px" }
			);
			observer.observe(container);
		}

		function updateViewportMode() {
			interactive = !mobileViewport.matches;
		}

		updateViewportMode();
		observeChart();
		mobileViewport.addEventListener("change", updateViewportMode);

		return () => {
			observer?.disconnect();
			mobileViewport.removeEventListener("change", updateViewportMode);
		};
	});
</script>

<div
	bind:this={container}
	class="deferred-chart"
	style={`--mobile-height: ${mobileHeight}px; --desktop-height: ${desktopHeight}px;`}
	aria-busy={!Chart && !loadFailed}
>
	{#if Chart}
		<Chart {interactive} />
	{:else}
		<div
			class="placeholder"
			role="status"
			aria-label={loadFailed ? `${label} failed to load` : label}
		>
			{#if loadFailed}
				<p>Unable to load this chart.</p>
			{:else}
				<span class="loader" aria-hidden="true"><Loader size={32} /></span>
			{/if}
		</div>
	{/if}
</div>

<style>
	.deferred-chart,
	.placeholder {
		min-height: var(--mobile-height);
	}

	.placeholder {
		margin-top: 0.5rem;
		display: grid;
		place-items: center;
		background-color: var(--neutral-lightest);
		border-radius: 2rem;
		color: var(--fg-secondary);
	}

	.placeholder p {
		font-size: 0.875rem;
	}

	.loader {
		display: inline-flex;
		animation: rotate 1s linear infinite;
	}

	@keyframes rotate {
		to {
			transform: rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.loader {
			animation: none;
		}
	}

	@media (min-width: 520px) {
		.deferred-chart,
		.placeholder {
			min-height: var(--desktop-height);
		}
	}
</style>
