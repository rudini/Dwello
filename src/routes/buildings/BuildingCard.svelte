<script lang="ts">
	import type { BuildingWithStats } from '$lib/types';
	import Button from '$lib/ui/Button.svelte';
	import Icon from '$lib/ui/Icon.svelte';

	// The whole card opens the building; its name is the link text. The route opens Google Maps.
	let { building }: { building: BuildingWithStats } = $props();

	const place = $derived(`${building.address}, ${building.postalCode} ${building.city}`);
	const routeUrl = $derived(
		`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${place}, Switzerland`)}`
	);
	const details = $derived(
		[building.buildingType, building.yearBuilt && `Baujahr ${building.yearBuilt}`].filter(Boolean)
	);
</script>

<li
	class="relative flex flex-col gap-4 rounded-panel border border-line bg-surface p-6 hover:border-line-strong"
	data-testid="building-card-{building.id}"
>
	<div class="flex flex-col gap-2">
		<h2 class="text-lg font-semibold text-ink">
			<a
				href="/buildings/{building.id}"
				class="text-accent underline underline-offset-4 after:absolute after:inset-0 hover:text-accent-strong"
				>{building.name || building.address}</a
			>
		</h2>
		<p class="flex items-center gap-2 text-ink-muted">
			<Icon name="location" />{place}{building.canton ? ` (${building.canton})` : ''}
		</p>
		{#if details.length}<p class="text-ink-muted">{details.join(', ')}</p>{/if}
	</div>
	<ul class="flex flex-wrap gap-x-6 gap-y-2 text-ink">
		<li class="flex items-center gap-2">
			<span class="text-ink-muted"><Icon name="apartment" /></span>
			{building.apartmentCount}
			{building.apartmentCount === 1 ? 'Wohnung' : 'Wohnungen'}
		</li>
		<li>{building.occupiedCount} vermietet</li>
		<li>{building.vacantCount} leer</li>
	</ul>
	<div class="relative z-10">
		<Button href={routeUrl} target="_blank" icon="way" testid="building-route-link"
			>Route planen</Button
		>
	</div>
</li>
