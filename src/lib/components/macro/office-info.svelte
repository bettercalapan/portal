<script lang="ts">
	import Clock from "@lucide/svelte/icons/clock";
	import Landmark from "@lucide/svelte/icons/landmark";
	import MapPin from "@lucide/svelte/icons/map-pin";
	import Phone from "@lucide/svelte/icons/phone";
	import ContactAction from "$lib/components/macro/contact-action.svelte";
	import LocationActions from "$lib/components/macro/location-actions.svelte";

	let { landmark, location, phone, time } = $props();
</script>

<ul>
	<li>
		<div class="icon">
			<Landmark />
		</div>
		{landmark}
	</li>
	<li>
		<div class="icon">
			<MapPin />
		</div>
		<div>
			<div>{location}</div>
			<LocationActions destination={`${landmark}, ${location}`} />
		</div>
	</li>
	{#if phone}
		<li>
			<div class="icon">
				<Phone />
			</div>
			<ContactAction {phone} phoneType="landline" />
		</li>
	{/if}
	<li>
		<div class="icon">
			<Clock />
		</div>
		{time}
	</li>
</ul>

<style>
	ul {
		margin-top: 0.5rem;
		padding: 0;
		list-style-type: none;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;

		li {
			display: grid;
			grid-template-columns: 20px 1fr;
			gap: 0.75rem;

			.icon {
				margin-top: 0.125rem;
			}
		}
	}
</style>
