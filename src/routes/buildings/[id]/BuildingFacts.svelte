<script lang="ts">
	import { occupancyParts } from '$lib/apartment';
	import type { BuildingWithStats } from '$lib/types';
	import BuildingMiniMap from '../BuildingMiniMap.svelte';
	import Panel from '$lib/ui/Panel.svelte';

	// The building's master data and how many of its apartments are rented
	let { building }: { building: BuildingWithStats } = $props();

	const place = $derived(`${building.address}, ${building.postalCode} ${building.city}`);
	const occupancy = $derived(
		new Intl.ListFormat('de-CH', { type: 'conjunction' }).format(occupancyParts(building))
	);
</script>

<Panel title="Angaben zum Gebäude">
	<dl class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		<div>
			<dt class="text-ink-muted">Adresse</dt>
			<dd class="font-semibold text-ink" data-testid="building-address">
				{place}{building.canton ? ` (${building.canton})` : ''}
			</dd>
		</div>
		{#if building.buildingType}
			<div>
				<dt class="text-ink-muted">Gebäudetyp</dt>
				<dd class="font-semibold text-ink">{building.buildingType}</dd>
			</div>
		{/if}
		{#if building.yearBuilt}
			<div>
				<dt class="text-ink-muted">Baujahr</dt>
				<dd class="font-semibold tabular-nums text-ink" data-testid="building-year-built">
					{building.yearBuilt}
				</dd>
			</div>
		{/if}
		<div>
			<dt class="text-ink-muted">Wohnungen</dt>
			<dd class="font-semibold tabular-nums text-ink">
				{building.apartmentCount}, davon {occupancy}
			</dd>
		</div>
	</dl>
	{#if building.latitude && building.longitude}
		<BuildingMiniMap
			latitude={Number(building.latitude)}
			longitude={Number(building.longitude)}
			address={place}
		/>
	{/if}
</Panel>
