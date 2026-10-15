<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { api } from '$lib/api';
	import Icon from '$lib/ui/Icon.svelte';
	import BuildingChoice from './BuildingChoice.svelte';
	import type { Building } from '$lib/types';

	// Step 2: the buildings whose rental contracts get a Nebenkostenabrechnung
	let {
		buildings,
		selectedBuildingIds = $bindable(),
		period,
		error
	}: {
		buildings: (Building & { apartmentCount: number })[];
		selectedBuildingIds: string[];
		period: { start: string; end: string };
		error?: string;
	} = $props();

	// Utility invoices of each building in the Abrechnungsperiode, so a missing one shows before the preview:
	// one request for the period, counted per building (fewer than 50 apartments, see CLAUDE.md)
	let invoiceCounts = $state<Record<string, number>>({});
	let billed = $state<Record<string, { contracts: number; billed: number }>>({});
	$effect(() => {
		const ids = buildings.map((b) => b.id);
		api
			.get<{ invoices: { buildingId: string }[] }>('/invoices', {
				dateFrom: period.start,
				dateTo: period.end,
				isValidUtilityCost: 'true',
				limit: '1000'
			})
			.then(({ data }) => {
				if (!data) return;
				const counts = Object.fromEntries(ids.map((id) => [id, 0]));
				for (const { buildingId } of data.invoices) if (buildingId in counts) counts[buildingId]++;
				invoiceCounts = counts;
			});
		// Contracts with a statement in the period already get none from this run
		api
			.get<{ buildingId: string; contracts: number; billed: number }[]>('/statements/billed', {
				buildingIds: ids.join(','),
				periodStart: period.start,
				periodEnd: period.end
			})
			.then(({ data }) => {
				if (data) billed = Object.fromEntries(data.map((row) => [row.buildingId, row]));
			});
	});

	const allSelected = $derived(
		buildings.length > 0 && selectedBuildingIds.length === buildings.length
	);

	const toggle = (id: string) =>
		(selectedBuildingIds = selectedBuildingIds.includes(id)
			? selectedBuildingIds.filter((other) => other !== id)
			: [...selectedBuildingIds, id]);
</script>

<fieldset
	class="flex min-w-0 flex-col gap-4"
	aria-describedby={error ? 'buildings-error' : undefined}
>
	<legend class="sr-only">{m.statements_step_buildings()}</legend>
	<div class="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
		<label class="flex min-h-12 cursor-pointer items-center gap-4 font-semibold text-ink">
			<input
				type="checkbox"
				checked={allSelected}
				onchange={() => (selectedBuildingIds = allSelected ? [] : buildings.map((b) => b.id))}
				class="size-6 shrink-0 cursor-pointer accent-accent"
				data-testid="generate-all-buildings"
			/>
			{m.apartments_all_buildings()}
		</label>
		<span class="text-ink-muted" aria-live="polite">
			{m.statements_selected_of({ selected: selectedBuildingIds.length, total: buildings.length })}
		</span>
	</div>

	{#each buildings as building (building.id)}
		<BuildingChoice
			{building}
			selected={selectedBuildingIds.includes(building.id)}
			invoices={invoiceCounts[building.id]}
			billed={billed[building.id]}
			{error}
			ontoggle={() => toggle(building.id)}
		/>
	{/each}

	{#if error}
		<p
			id="buildings-error"
			class="flex items-start gap-2 font-semibold text-critical"
			data-testid="form-error"
		>
			<Icon name="error" />
			{error}
		</p>
	{/if}
</fieldset>
