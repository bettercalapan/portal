<script lang="ts">
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	import Download from "@lucide/svelte/icons/download";
	import RotateCcw from "@lucide/svelte/icons/rotate-ccw";
	import X from "@lucide/svelte/icons/x";

	type BeforeInstallPromptEvent = Event & {
		prompt: () => Promise<void>;
		userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
	};

	const SESSION_KEY = "bettercalapan-install-prompt-dismissed";

	let promptEvent = $state<BeforeInstallPromptEvent>();
	let retry = $state(false);
	let visible = $state(false);

	function wasDismissed() {
		try {
			return sessionStorage.getItem(SESSION_KEY) === "true";
		} catch {
			return false;
		}
	}

	function markDismissed() {
		try {
			sessionStorage.setItem(SESSION_KEY, "true");
		} catch {
			// Private browsing modes can deny session storage access.
		}
	}

	function isStandalone() {
		return (
			window.matchMedia("(display-mode: standalone)").matches ||
			(navigator as Navigator & { standalone?: boolean }).standalone === true
		);
	}

	function hide() {
		visible = false;
		promptEvent = undefined;
	}

	function dismiss() {
		markDismissed();
		hide();
	}

	async function install() {
		if (retry) {
			location.reload();
			return;
		}

		const event = promptEvent;
		if (!event) return;

		await event.prompt();
		const { outcome } = await event.userChoice;
		if (outcome === "accepted") {
			hide();
			return;
		}

		promptEvent = undefined;
		retry = true;
	}

	onMount(() => {
		function handleBeforeInstallPrompt(event: Event) {
			const installEvent = event as BeforeInstallPromptEvent;
			if (wasDismissed() || isStandalone()) return;

			promptEvent = installEvent;
			retry = false;
			visible = true;
		}

		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
		window.addEventListener("appinstalled", hide);
		return () => {
			window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
			window.removeEventListener("appinstalled", hide);
		};
	});
</script>

{#if visible}
	<aside
		class="install-prompt"
		aria-label="Install BetterCalapan"
		transition:fade={{ duration: 200 }}
	>
		<p>Install BetterCalapan for quick access to services.</p>
		<button
			type="button"
			class="install"
			onclick={install}
			aria-label={retry ? "Try again" : "Install"}
		>
			<span aria-hidden="true">{retry ? "Try again" : "Install"}</span>
			{#if retry}
				<RotateCcw class="install-icon" size={20} aria-hidden="true" />
			{:else}
				<Download class="install-icon" size={20} aria-hidden="true" />
			{/if}
		</button>
		<button type="button" class="dismiss" onclick={dismiss} aria-label="Dismiss install prompt">
			<X size={20} aria-hidden="true" />
		</button>
	</aside>
{/if}

<style>
	.install-prompt {
		padding: 0.75rem 1.25rem;
		position: fixed;
		inset: auto max(1rem, env(safe-area-inset-right)) max(1rem, env(safe-area-inset-bottom))
			max(1rem, env(safe-area-inset-left));
		z-index: 10;
		max-width: 36rem;
		margin-inline: auto;
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto auto;
		align-items: center;
		gap: 0.75rem;
		border: 1px solid var(--gray);
		border-radius: 1.5rem;
		background: var(--neutral-light);
		box-shadow: 0 0.75rem 2rem oklch(0.24 0 0 / 0.14);

		p {
			margin: 0;
			font-size: 1rem;
			font-weight: 400;
		}
	}

	.install,
	.dismiss {
		border: 0;
		background: none;
		color: inherit;
	}

	.install {
		min-width: 2.75rem;
		min-height: 2.75rem;
		padding: 0.5rem 1rem;
		border-radius: 999px;
		background: var(--accent);
		color: var(--fg);
		font-weight: 700;
		white-space: nowrap;
		transition: opacity 150ms ease;

		&:hover {
			opacity: 0.75;
		}
	}

	:global(.install-icon) {
		display: none;
	}

	.dismiss {
		width: 2.75rem;
		height: 2.75rem;
		padding-inline: 0;
		display: grid;
		place-items: center;
		border-radius: 50%;

		&:hover {
			background: var(--neutral-hover);
		}
	}

	button:focus-visible {
		outline: 2px solid var(--fg);
		outline-offset: 2px;
	}

	@media (max-width: 499px) {
		.install {
			padding: 0;
			display: grid;
			place-items: center;
			border-radius: 50%;

			span {
				display: none;
			}
		}

		:global(.install-icon) {
			display: block;
		}
	}

	@media (min-width: 500px) {
		.install-prompt {
			p {
				font-size: 1.125rem;
			}
		}
	}
</style>
