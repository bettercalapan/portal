<script lang="ts">
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import SearchResults from "$lib/components/macro/search-results.svelte";
	import { createSearchQuery, normalizeSearchTerm } from "$lib/search/search-query";
	import Search from "@lucide/svelte/icons/search";
	import { onDestroy } from "svelte";

	type Props = {
		term: string;
		showResults: boolean;
	};

	let { term, showResults }: Props = $props();

	let searchTerm = $derived(term);
	let submittedSearchTerm: string | null = $state(null);
	let hasFocus = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;
	const DURATION = 500;

	function clearTimer() {
		if (!timer) return;

		clearTimeout(timer);
		timer = undefined;
	}

	function handlerSearch() {
		clearTimer();

		timer = setTimeout(() => {
			timer = undefined;
			const normalizedTerm = normalizeSearchTerm(searchTerm);
			if (!normalizedTerm) {
				submittedSearchTerm = null;
				return;
			}
			submittedSearchTerm = normalizedTerm;
			showResults = hasFocus;
		}, DURATION);
	}
	function handlerFocusIn(e: FocusEvent) {
		if (e.currentTarget instanceof Node && e.relatedTarget instanceof Node) {
			if (e.currentTarget.contains(e.relatedTarget)) return;
		}

		hasFocus = true;
		const normalizedTerm = normalizeSearchTerm(searchTerm);
		if (!normalizedTerm) return;

		if (submittedSearchTerm === normalizedTerm) {
			showResults = true;
			return;
		}

		handlerSearch();
	}
	function handlerFocusOut(e: FocusEvent) {
		if (e.currentTarget instanceof Node && e.relatedTarget instanceof Node) {
			if (e.currentTarget.contains(e.relatedTarget)) return;
		}

		hasFocus = false;
		showResults = false;
		clearTimer();
	}
	function handlerSubmit(e: SubmitEvent) {
		e.preventDefault();
		clearTimer();
		const normalizedTerm = normalizeSearchTerm(searchTerm);
		if (!normalizedTerm) return;

		submittedSearchTerm = null;
		showResults = false;
		// The route is resolved before the encoded query string is appended.
		// eslint-disable-next-line svelte/no-navigation-without-resolve
		goto(`${resolve("/search")}?${createSearchQuery(normalizedTerm)}`);
	}

	onDestroy(clearTimer);
</script>

<div class="search-widget" onfocusin={handlerFocusIn} onfocusout={handlerFocusOut}>
	<form class="search-input" action={resolve("/search")} method="GET" onsubmit={handlerSubmit}>
		<input
			type="text"
			name="term"
			id="search"
			aria-label="Search BetterCalapan.org"
			autocomplete="off"
			spellcheck="false"
			placeholder="Occupational permit"
			required
			bind:value={searchTerm}
			oninput={handlerSearch}
		/>
		<button type="submit" class="search-button" aria-label="Search button">
			<div class="icon">
				<Search />
			</div>
		</button>
	</form>
	{#if submittedSearchTerm && showResults}
		<SearchResults term={submittedSearchTerm} />
	{/if}
</div>

<style>
	.search-input {
		display: grid;
		grid-template-columns: 1fr 3.25rem;

		input {
			padding: 0 1.25rem;
			background-color: var(--neutral-3);
			border: none;
			border-radius: 2rem 0 0 2rem;
			font-size: 1.125rem;
		}
		input::placeholder {
			color: var(--fg);
			opacity: 0.25;
		}
		.search-button {
			display: grid;
			place-items: center;
			aspect-ratio: 1 / 1;
			background-color: var(--neutral-1);
			border: none;
			border-radius: 0 2rem 2rem 0;
			transition: background-color 0.3s ease;

			&:hover {
				background-color: var(--neutral-2);
			}

			.icon {
				aspect-ratio: 1 / 1;
				width: 18px;
			}
		}
	}
</style>
