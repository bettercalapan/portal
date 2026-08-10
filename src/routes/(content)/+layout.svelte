<script lang="ts">
	let { children } = $props();
</script>

<div class="page-content">
	{@render children()}
</div>

<style>
	:global(.article-content :where(h1, h2)) {
		margin-bottom: 0.25rem;
		margin-top: 2rem;
		scroll-margin-top: 1rem;
		line-height: 1.25;
	}
	:global(.article-content :where(h3)) {
		margin-bottom: 0.5rem;
	}

	:global(.article-content :where(p, li)) {
		font-size: 1.125rem;
	}

	:global(.article-content :where(p, ul)) {
		margin-bottom: 1rem;
	}

	:global(.article-content :where(ul)) {
		padding-left: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		list-style-type: disc;
	}
	:global(.article-content :where(ol)) {
		padding-left: 1.25rem;
	}

	:global(.article-content :where(a)) {
		color: var(--fg);
		text-decoration: underline;
	}
	:global(.article-content :where(a:hover)) {
		text-decoration: none;
	}
</style>
