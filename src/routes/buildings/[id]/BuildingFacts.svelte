<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import { occupancyParts } from '$lib/apartment';
	import { buildingTypeLabel } from '$lib/building-type';
	import type { BuildingWithStats } from '$lib/types';
	import Panel from '$lib/ui/Panel.svelte';

	// The building's master data and how many of its apartments are rented
	let { building }: { building: BuildingWithStats } = $props();

	const place = $derived(`${building.address}, ${building.postalCode} ${building.city}`);
	const occupancy = $derived(
		new Intl.ListFormat(`${getLocale()}-CH`, { type: 'conjunction' }).format(
			occupancyParts(building)
		)
	);
</script>

<Panel title={m.buildings_facts_title()}>
	<dl class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		<div>
			<dt class="text-ink-muted">{m.buildings_address()}</dt>
			<dd class="font-semibold text-ink" data-testid="building-address">
				{place}{building.canton ? ` (${building.canton})` : ''}
			</dd>
		</div>
		{#if building.buildingType}
			<div>
				<dt class="text-ink-muted">{m.buildings_type()}</dt>
				<dd class="font-semibold text-ink">{buildingTypeLabel(building.buildingType)}</dd>
			</div>
		{/if}
		{#if building.yearBuilt}
			<div>
				<dt class="text-ink-muted">{m.buildings_year_built()}</dt>
				<dd class="font-semibold tabular-nums text-ink" data-testid="building-year-built">
					{building.yearBuilt}
				</dd>
			</div>
		{/if}
		{#if building.noTank}
			<div>
				<dt class="text-ink-muted">{m.buildings_tank()}</dt>
				<dd class="font-semibold text-ink" data-testid="building-no-tank">
					{m.buildings_no_tank_fact()}
				</dd>
			</div>
		{/if}
		<div>
			<dt class="text-ink-muted">{m.nav_apartments()}</dt>
			<dd class="font-semibold tabular-nums text-ink">
				{m.buildings_apartments_of({ count: building.apartmentCount, occupancy })}
			</dd>
		</div>
	</dl>
</Panel>
