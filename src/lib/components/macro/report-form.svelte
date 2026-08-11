<script lang="ts">
	import { enhance } from "$app/forms";
	import type { SubmitFunction } from "@sveltejs/kit";
	import ChevronDown from "@lucide/svelte/icons/chevron-down";
	import { Select } from "bits-ui";
	import { onMount, tick } from "svelte";
	import {
		emptyReportValues,
		reportCategories,
		type ReportFormState,
		type ReportValues
	} from "$lib/report";

	type TurnstileApi = {
		render: (
			container: HTMLElement,
			options: {
				sitekey: string;
				action: string;
				size: "flexible";
				appearance: "interaction-only";
				callback: () => void;
				"error-callback": () => void;
				"expired-callback": () => void;
			}
		) => string;
		remove: (widgetId: string) => void;
		reset: (widgetId: string) => void;
	};

	type TurnstileWindow = Window & { turnstile?: TurnstileApi };

	function loadTurnstile(): Promise<TurnstileApi> {
		const turnstileWindow = window as TurnstileWindow;
		if (turnstileWindow.turnstile) return Promise.resolve(turnstileWindow.turnstile);

		return new Promise((resolve, reject) => {
			const existingScript = document.querySelector<HTMLScriptElement>("script[data-turnstile]");
			const script = existingScript ?? document.createElement("script");
			const handleLoad = () => {
				if (turnstileWindow.turnstile) resolve(turnstileWindow.turnstile);
				else {
					script.remove();
					reject(new Error("Turnstile API did not load"));
				}
			};
			const handleError = () => {
				if (!existingScript) script.remove();
				reject(new Error("Turnstile script failed to load"));
			};

			script.addEventListener("load", handleLoad, { once: true });
			script.addEventListener("error", handleError, { once: true });
			if (!existingScript) {
				script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
				script.async = true;
				script.defer = true;
				script.dataset.turnstile = "true";
				document.head.appendChild(script);
			}
		});
	}

	let {
		form,
		initialPageUrl = "",
		turnstileSiteKey
	}: {
		form?: ReportFormState | null;
		initialPageUrl?: string;
		turnstileSiteKey: string;
	} = $props();

	let submitting = $state(false);
	let feedbackElement = $state<HTMLElement>();
	let formElement = $state<HTMLFormElement>();
	let turnstileContainer = $state<HTMLElement>();
	let turnstileApi: TurnstileApi | undefined;
	let turnstileWidgetId: string | undefined;
	let turnstileReady = $state(false);
	let turnstileFailed = $state(false);
	let selectedCategory = $derived(form?.values?.category ?? "");
	const categoryItems = reportCategories.map(({ value, label }) => ({ value, label }));
	const values = $derived<ReportValues>({
		...emptyReportValues,
		pageUrl: initialPageUrl,
		...form?.values
	});

	const enhanceForm: SubmitFunction = () => {
		submitting = true;

		return async ({ result, update }) => {
			await update({ reset: result.type === "success" });
			submitting = false;
			if (turnstileApi && turnstileWidgetId) {
				turnstileReady = false;
				turnstileApi.reset(turnstileWidgetId);
			}
		};
	};

	onMount(() => {
		if (!turnstileSiteKey || !turnstileContainer) return;

		let mounted = true;
		void loadTurnstile()
			.then((api) => {
				if (!mounted || !turnstileContainer) return;
				turnstileApi = api;
				turnstileWidgetId = api.render(turnstileContainer, {
					sitekey: turnstileSiteKey,
					action: "report",
					size: "flexible",
					appearance: "interaction-only",
					callback: () => {
						turnstileReady = true;
						turnstileFailed = false;
					},
					"error-callback": () => {
						turnstileReady = false;
						turnstileFailed = true;
					},
					"expired-callback": () => {
						turnstileReady = false;
					}
				});
			})
			.catch(() => {
				if (mounted) turnstileFailed = true;
			});

		return () => {
			mounted = false;
			if (turnstileApi && turnstileWidgetId) turnstileApi.remove(turnstileWidgetId);
		};
	});

	$effect(() => {
		if (form?.success || form?.errors?.form) {
			void tick().then(() => feedbackElement?.focus());
		} else if (form?.errors && Object.keys(form.errors).length > 0) {
			void tick().then(() =>
				formElement?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus()
			);
		}
	});
</script>

{#if form?.success}
	<div class="success-message" role="status" tabindex="-1" bind:this={feedbackElement}>
		<p>Thank you. Your report has been sent to the BetterCalapan maintainers.</p>
	</div>
{/if}

{#if form?.errors?.form}
	<div class="error-summary" role="alert" tabindex="-1" bind:this={feedbackElement}>
		<p>{form.errors.form}</p>
	</div>
{/if}

<form method="POST" use:enhance={enhanceForm} aria-busy={submitting} bind:this={formElement}>
	<div class="field">
		<label for="category">Type of problem *</label>
		<Select.Root
			type="single"
			name="category"
			required
			items={categoryItems}
			bind:value={selectedCategory}
		>
			<Select.Trigger
				id="category"
				class="report-select-trigger"
				aria-invalid={form?.errors?.category ? "true" : undefined}
				aria-describedby={form?.errors?.category ? "category-error" : undefined}
			>
				<Select.Value placeholder="Choose one" />
				<ChevronDown class="report-select-chevron" aria-hidden="true" />
			</Select.Trigger>
			<Select.Portal>
				<Select.Content class="report-select-content" sideOffset={6}>
					<Select.Viewport class="report-select-viewport">
						{#each reportCategories as category (category.value)}
							<Select.Item class="report-select-item" value={category.value} label={category.label}>
								{#snippet children({ selected })}
									<span>{category.label}</span>
									{#if selected}
										<span class="report-select-check" aria-hidden="true"></span>
									{/if}
								{/snippet}
							</Select.Item>
						{/each}
					</Select.Viewport>
				</Select.Content>
			</Select.Portal>
		</Select.Root>
		{#if form?.errors?.category}
			<p class="field-error" id="category-error">{form.errors.category}</p>
		{/if}
	</div>

	<div class="field">
		<label for="pageUrl">Affected page <span class="optional">(optional)</span></label>
		<input
			id="pageUrl"
			name="pageUrl"
			type="text"
			value={values.pageUrl}
			maxlength="500"
			placeholder="https://bettercalapan.org/services"
			autocomplete="off"
			aria-invalid={form?.errors?.pageUrl ? "true" : undefined}
			aria-describedby={form?.errors?.pageUrl ? "page-url-error" : "page-url-help"}
		/>
		<p class="help" id="page-url-help">
			The page address is filled in when you follow a report link.
		</p>
		{#if form?.errors?.pageUrl}
			<p class="field-error" id="page-url-error">{form.errors.pageUrl}</p>
		{/if}
	</div>

	<div class="field">
		<label for="message">What went wrong? <span aria-hidden="true">*</span></label>
		<textarea
			id="message"
			name="message"
			rows="8"
			required
			maxlength="5000"
			aria-invalid={form?.errors?.message ? "true" : undefined}
			aria-describedby={form?.errors?.message ? "message-error" : "message-help"}
			>{values.message}</textarea
		>
		<p class="help" id="message-help">Describe what you expected and what happened instead.</p>
		{#if form?.errors?.message}
			<p class="field-error" id="message-error">{form.errors.message}</p>
		{/if}
	</div>

	<div class="field">
		<label for="email">Your email <span class="optional">(optional)</span></label>
		<input
			id="email"
			name="email"
			type="email"
			value={values.email}
			maxlength="254"
			autocomplete="off"
			aria-invalid={form?.errors?.email ? "true" : undefined}
			aria-describedby={form?.errors?.email ? "email-error" : "email-help"}
		/>
		<p class="help" id="email-help">Provide an email only if you would like us to reply.</p>
		{#if form?.errors?.email}
			<p class="field-error" id="email-error">{form.errors.email}</p>
		{/if}
	</div>

	<div class="honeypot" aria-hidden="true">
		<label for="company">Company</label>
		<input id="company" name="company" type="text" tabindex="-1" autocomplete="off" />
	</div>

	{#if turnstileSiteKey}
		<div class="turnstile-widget" bind:this={turnstileContainer}></div>
		{#if !turnstileReady && !turnstileFailed}
			<p class="help" role="status">Preparing verification...</p>
		{/if}
		{#if form?.errors?.verification}
			<p class="field-error" role="alert">{form.errors.verification}</p>
		{/if}
	{/if}
	{#if !turnstileSiteKey || turnstileFailed}
		<p class="configuration-error" role="alert">
			Reporting is temporarily unavailable. Please email
			<a href="mailto:reports@bettercalapan.org">reports@bettercalapan.org</a> instead.
		</p>
	{/if}

	<button type="submit" disabled={submitting || !turnstileReady}>
		{submitting ? "Sending report..." : "Send report"}
	</button>
</form>

<style>
	form {
		position: relative;
		max-width: 42rem;
		margin-top: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		font-size: 1.125rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	label {
		font-size: 1.125rem;
		font-weight: 650;
	}

	.optional,
	.help {
		color: var(--fg-secondary);
		font-weight: 400;
	}

	input,
	textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid var(--gray);
		border-radius: 0.375rem;
		background: var(--bg);
		color: var(--fg);
		font-size: 1.125rem;
	}

	textarea {
		resize: vertical;
	}

	input:focus,
	textarea:focus,
	button:focus {
		outline: 1px solid var(--fg);
		border: 1px solid var(--fg);
	}

	[aria-invalid="true"] {
		border-color: #b42318;
	}

	.help,
	.field-error {
		margin: 0;
		font-size: 1.125rem;
	}

	.field-error {
		color: #b42318;
		font-weight: 600;
	}

	.honeypot {
		position: absolute;
		left: -10000px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}

	button {
		align-self: flex-start;
		padding: 0.75rem 1.5rem;
		border: 0;
		border-radius: 2rem;
		background: var(--accent);
		color: var(--fg);
		font-size: 1.125rem;
		font-weight: 600;
		transition: opacity 0.3s ease;
	}

	button:hover:not(:disabled) {
		opacity: 0.75;
	}

	button:disabled {
		cursor: not-allowed;
		opacity: 0.65;
	}

	:global(.report-select-trigger) {
		width: 100%;
		min-height: 3.25rem;
		padding: 0.75rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		border: 1px solid var(--gray);
		border-radius: 0.375rem;
		background: var(--bg);
		color: var(--fg);
		font-size: 1.125rem;
		text-align: left;
	}

	:global(.report-select-trigger:hover) {
		border-color: var(--fg-secondary);
	}

	:global(.report-select-trigger:focus-visible) {
		outline: 1px solid var(--fg);
		border: 1px solid var(--fg);
	}

	:global(.report-select-trigger[aria-invalid="true"]) {
		border-color: #b42318;
	}

	:global(.report-select-chevron) {
		width: 1.25rem;
		flex: 0 0 auto;
		transition: transform 150ms ease;
	}

	:global(.report-select-trigger[data-state="open"] .report-select-chevron) {
		transform: rotate(180deg);
	}

	:global(.report-select-content) {
		z-index: 50;
		width: var(--bits-select-anchor-width);
		min-width: var(--bits-select-anchor-width);
		padding: 0.375rem;
		border: 1px solid var(--gray);
		border-radius: 0.5rem;
		background: var(--bg);
		box-shadow: 0 0.75rem 2rem oklch(0.24 0 0 / 0.14);
		font-size: 1.125rem;
	}

	:global(.report-select-viewport) {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	:global(.report-select-item) {
		min-height: 2.75rem;
		padding: 0.625rem 0.75rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		border-radius: 0.25rem;
		outline: none;
		cursor: pointer;
	}

	:global(.report-select-item[data-highlighted]) {
		background: #f3f3f3;
	}

	:global(.report-select-item[data-selected]) {
		font-weight: 650;
	}

	:global(.report-select-check) {
		width: 0.45rem;
		height: 0.8rem;
		flex: 0 0 auto;
		margin-right: 0.3rem;
		border-right: 2px solid var(--accent-dark);
		border-bottom: 2px solid var(--accent-dark);
		transform: rotate(45deg);
	}

	.error-summary,
	.success-message,
	.configuration-error {
		max-width: 42rem;
		margin-top: 1.5rem;
		padding: 1rem;
		border-radius: 0.375rem;
	}

	.error-summary,
	.configuration-error {
		border-left: 8px solid var(--accent);
		background: var(--neutral-1);
	}

	.success-message {
		border-left: 8px solid var(--chart-green);
		background: #f2f8ee;

		p {
			margin: 0;
		}
	}
</style>
