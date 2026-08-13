<script lang="ts">
	import Clock from "@lucide/svelte/icons/clock";
	import type { OfficeRecord } from "$lib/types/civic.types";
	import Landmark from "@lucide/svelte/icons/landmark";
	import MapPin from "@lucide/svelte/icons/map-pin";
	import Phone from "@lucide/svelte/icons/phone";
	import { formatPhoneNumber } from "$lib/utils/contact";

	let { office }: { office: OfficeRecord } = $props();
</script>

<ul>
	<li>
		<div class="icon">
			<Landmark />
		</div>
		{office.name}
	</li>
	<li>
		<div class="icon">
			<MapPin />
		</div>
		{office.address}
	</li>
	{#each office.contacts as method (method.kind + method.value)}
		{#if method.kind === "phone"}
			<li>
				<div class="icon">
					<Phone />
				</div>
				{formatPhoneNumber(method.value, method.phoneType)}
			</li>
		{/if}
	{/each}
	<li>
		<div class="icon">
			<Clock />
		</div>
		{office.hours}
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
