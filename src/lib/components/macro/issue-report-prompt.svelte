<script lang="ts">
	import { page } from "$app/state";
	import { resolveRoute } from "$lib/utils/paths";
	import Flag from "@lucide/svelte/icons/flag";

	const affectedPage = $derived(`${page.url.pathname || "/"}${page.url.search}`);
	const query = $derived(`?page=${encodeURIComponent(affectedPage)}`);
</script>

<div class="issue-report" aria-label="Report a website issue">
	<div class="icon">
		<Flag />
	</div>
	<p>
		Found an issue with this page? Send us a
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- the route is resolved before its query string is appended -->
		<a href={`${resolveRoute("/(content)/report")}${query}`}>report</a>.
	</p>
</div>

<style>
	.issue-report {
		margin-top: 1rem;
		display: grid;
		grid-template-columns: 18px 1fr;
		align-items: start;
		gap: 0.75rem;
		color: var(--fg);

		.icon {
			margin-top: 0.125rem;
		}

		p {
			margin: 0;
		}
	}
</style>
