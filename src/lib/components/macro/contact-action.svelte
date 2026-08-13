<script lang="ts">
	import type { ContactMethod } from "$lib/data/contact.data";
	import { formatPhoneNumber } from "$lib/utils/contact";
	import Check from "@lucide/svelte/icons/check";
	import Copy from "@lucide/svelte/icons/copy";

	type Props = { method: ContactMethod };

	let { method }: Props = $props();
	let message = $state("");
	let copied = $state(false);
	const label = $derived(
		method.kind === "phone" ? formatPhoneNumber(method.value, method.phoneType) : method.value
	);

	async function copyValue() {
		try {
			await navigator.clipboard.writeText(method.value);
			message = "Copied to clipboard.";
			copied = true;
			setTimeout(() => (copied = false), 2_000);
		} catch {
			message = "Could not copy. Select the contact details and copy them manually.";
		}
	}
</script>

<span class="contact-action">
	<span>{label}</span>
	<button
		type="button"
		onclick={copyValue}
		aria-label={copied ? "Copied" : `Copy ${label}`}
		title={copied ? "Copied" : `Copy ${label}`}
	>
		{#if copied}
			<Check size={16} aria-hidden="true" />
		{:else}
			<Copy size={16} aria-hidden="true" />
		{/if}
	</button>
	<span class="sr-only" aria-live="polite">{message}</span>
</span>

<style>
	.contact-action {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
	}

	button {
		padding: 0.25rem;
		min-width: 2rem;
		min-height: 2rem;
		display: inline-grid;
		place-items: center;
		background: none;
		border: 0;
		border-radius: 50%;
		color: inherit;
	}

	button:hover {
		background: var(--neutral-hover);
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
