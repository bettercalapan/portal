<script lang="ts">
	import { resolve } from "$app/paths";
	import logo from "$lib/assets/logo.svg";
	import NavigationMenu from "./nav-menu.svelte";
	import NavigationMenuMobile from "./nav-menu-mobile.svelte";
	import { createSearchQuery, normalizeSearchTerm } from "$lib/search/search-query";
	import Search from "@lucide/svelte/icons/search";
	import ArrowRight from "@lucide/svelte/icons/arrow-right";
	import { goto } from "$app/navigation";

	let showSearchInput = $state(false);

	function handlerSearchButton() {
		showSearchInput = !showSearchInput;
	}
	function handlerSearchFocusOut(e: FocusEvent) {
		if (e.currentTarget instanceof Node && e.relatedTarget instanceof Node) {
			if (e.currentTarget.contains(e.relatedTarget)) return;
		}

		showSearchInput = false;
	}

	let inputValue = $state("");
	function handlerSearchInput(e: SubmitEvent) {
		e.preventDefault();
		const term = normalizeSearchTerm(inputValue);
		if (!term) return;

		showSearchInput = false;
		// The route is resolved before the encoded query string is appended.
		// eslint-disable-next-line svelte/no-navigation-without-resolve
		goto(`${resolve("/search")}?${createSearchQuery(term)}`);
		inputValue = "";
	}
</script>

<header>
	<div class="wrapper">
		<div class="left">
			<a href={resolve("/")} class="back-home">
				<img src={logo} alt="BetterCalapan logo" width="32" height="32" />
				<h1>BetterCalapan</h1>
			</a>
		</div>
		<div class="right">
			<NavigationMenuMobile />
			<NavigationMenu />
			<div class="search-widget" onfocusout={handlerSearchFocusOut}>
				<button
					class="search-button"
					aria-label="Toggle search input"
					onclick={handlerSearchButton}
				>
					<Search />
				</button>
				<form
					class="search-input-wrapper"
					class:open={showSearchInput}
					inert={!showSearchInput}
					action={resolve("/search")}
					method="GET"
					onsubmit={handlerSearchInput}
				>
					<input
						class="search-input"
						type="text"
						name="term"
						aria-label="Search BetterCalapan.org"
						bind:value={inputValue}
						required
					/>
					<button type="submit" class="search-input-button" aria-label="Search button">
						<ArrowRight />
					</button>
				</form>
			</div>
		</div>
	</div>
</header>

<style>
	header {
		padding: 1rem;
		position: relative;
		background-color: var(--bg);
		display: grid;
		place-items: center;

		.wrapper {
			width: 100%;
			max-width: 80rem;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.left {
				a {
					display: grid;
					grid-template-columns: 40px 1fr;
					align-items: center;
					gap: 0.5rem;

					img {
						width: 36px;
						height: 36px;
						border-radius: 0.75rem;
					}
					h1 {
						font-size: 1.25rem;
					}
				}
			}

			.right {
				position: relative;
				display: flex;
				align-items: center;
				gap: 0.5rem;

				.search-widget {
					position: relative;
					display: grid;
					place-items: center;
				}

				.search-button {
					padding: 0.25rem;
					width: 32px;
					aspect-ratio: 1 / 1;
					background: none;
					border-radius: 50%;
					border: none;
					display: grid;
					place-items: center;
					transition: background-color 0.3s ease;

					&:hover {
						background-color: var(--neutral-3);
					}

					:global(svg) {
						aspect-ratio: 1 / 1;
						width: 18px;
					}
				}

				.search-input-wrapper {
					padding: 0 1.25rem;
					height: 52px;
					position: absolute;
					top: 2.5rem;
					right: 0;
					display: grid;
					grid-template-columns: 1fr 20px;
					gap: 0.25rem;
					align-items: center;
					background-color: var(--neutral-3);
					border: none;
					border-radius: 2rem;
					font-size: 1.125rem;
					transform-origin: top left;
					opacity: 0;
					visibility: hidden;
					pointer-events: none;
					transform: translateY(-4px) scale(0.98);
					transition:
						opacity 120ms ease-in,
						transform 120ms ease-in,
						visibility 0s linear 120ms;

					&.open {
						opacity: 1;
						visibility: visible;
						pointer-events: auto;
						transform: translateY(0) scale(1);
						transition:
							opacity 160ms ease-out,
							transform 160ms ease-out,
							visibility 0s;
					}

					.search-input {
						background: none;
						border: none;
						display: flex;
					}

					.search-input-button {
						padding: 0;
						display: grid;
						place-items: center;
						width: 20px;
						border: none;

						:global(svg) {
							width: 20px;
							height: 20px;
						}
					}
				}
			}
		}
	}

	@media (prefers-reduced-motion: reduce) {
		header .wrapper .right .search-input-wrapper,
		header .wrapper .right .search-input-wrapper.open {
			transition: none;
		}
	}

	@media (min-width: 900px) {
		header {
			.wrapper {
				.right {
					gap: 1.5rem;

					.search-input-wrapper {
						position: absolute;
						top: 3rem;
					}
				}
			}
		}
	}
</style>
