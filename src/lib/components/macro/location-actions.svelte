<script lang="ts">
	import { googleMapsDirectionsHref, googleMapsSearchHref } from "$lib/utils/contact";
	import Map from "@lucide/svelte/icons/map";
	import Navigation from "@lucide/svelte/icons/navigation";

	let { destination }: { destination: string } = $props();
</script>

<span class="location-actions">
	<a href={googleMapsSearchHref(destination)} target="_blank" rel="external noopener noreferrer">
		<Map size={16} aria-hidden="true" /> Map
	</a>
	<a
		href={googleMapsDirectionsHref(destination)}
		target="_blank"
		rel="external noopener noreferrer"
	>
		<Navigation size={16} aria-hidden="true" /> Directions
	</a>
</span>

<style>
	.location-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 2rem;
	}

	a {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
	}
</style>
