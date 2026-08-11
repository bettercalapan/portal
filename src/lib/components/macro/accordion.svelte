<script>
	import { Accordion } from "bits-ui";
	import ChevronDown from "@lucide/svelte/icons/chevron-down";

	const { faq } = $props();
</script>

<Accordion.Root class="accordion-root" type="multiple">
	{#each faq as item, idx (item.question)}
		<Accordion.Item class="accordion-item" value={`item-${idx + 1}`}>
			<Accordion.Header class="accordion-header">
				<Accordion.Trigger class="accordion-trigger"
					>{item.question}
					<ChevronDown />
				</Accordion.Trigger>
			</Accordion.Header>
			<Accordion.Content class="accordion-content">
				<div class="accordion-content-inner">
					{item.answer}
				</div>
			</Accordion.Content>
		</Accordion.Item>
	{/each}
</Accordion.Root>

<style>
	:global(.accordion-root) {
		margin-top: -0.25rem;

		:global(.accordion-item) {
			border-bottom: 1px solid var(--fg-secondary);
			font-size: 1.125rem;
		}

		:global(.accordion-header) {
			padding: 1.25rem 0;

			:global(.accordion-trigger) {
				padding: 0;
				display: grid;
				grid-template-columns: 1fr 18px;
				align-items: center;
				gap: 1rem;
				width: 100%;
				background: none;
				border: none;
				text-align: left;
			}
		}
		:global(.accordion-content) {
			overflow: hidden;
		}

		.accordion-content-inner {
			padding: 0.5rem 0 1.5rem;
		}

		:global(.accordion-content[data-state="open"]) {
			animation: accordion-content-open 200ms ease-out;
		}

		:global(.accordion-content[data-state="closed"]) {
			animation: accordion-content-close 200ms ease-out;
		}
	}

	@keyframes accordion-content-open {
		from {
			height: 0;
		}
		to {
			height: var(--bits-accordion-content-height);
		}
	}

	@keyframes accordion-content-close {
		from {
			height: var(--bits-accordion-content-height);
		}
		to {
			height: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.accordion-content) {
			animation: none;
		}
	}
</style>
