<script lang="ts">
	import "../global.css";
	import favicon from "$lib/assets/logo.png";
	import Header from "$lib/components/macro/header.svelte";
	import Footer from "$lib/components/macro/footer.svelte";
	import InstallPrompt from "$lib/components/macro/install-prompt.svelte";

	let { children } = $props();

	function skipToMainContent(event: MouseEvent) {
		event.preventDefault();
		const mainContent = document.getElementById("main-content");
		if (!mainContent) return;

		mainContent.focus();
		mainContent.scrollIntoView();
		history.pushState(null, "", "#main-content");
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<a class="skip-link" href="#main-content" onclick={skipToMainContent}>Skip to main content</a>
<Header />
<main id="main-content" tabindex="-1">
	<div class="main-wrapper">
		{@render children()}
	</div>
</main>
<Footer />
<InstallPrompt />

<style>
	.skip-link {
		padding: 0.75rem 1rem;
		position: fixed;
		top: 1rem;
		left: 1rem;
		z-index: 1000;
		background-color: var(--fg);
		border-radius: 0.5rem;
		color: var(--bg);
		box-shadow: 0 0.25rem 1rem rgb(0 0 0 / 20%);
		transform: translateY(calc(-100% - 1rem));
		opacity: 0;
		pointer-events: none;
		transition:
			transform 120ms ease-out,
			opacity 120ms ease-out;

		&:focus-visible {
			transform: translateY(0);
			opacity: 1;
			pointer-events: auto;
			outline: 2px solid var(--accent);
			box-shadow:
				0 0.25rem 1rem rgb(0 0 0 / 20%),
				0 0 0 3px var(--accent);
		}
	}

	main {
		padding: 1rem 1rem 3rem;
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;

		&:focus {
			outline: none;
		}

		.main-wrapper {
			width: 100%;
			max-width: 80rem;
			flex: 1;
			display: flex;
			flex-direction: column;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.skip-link {
			transition: none;
		}
	}
</style>
