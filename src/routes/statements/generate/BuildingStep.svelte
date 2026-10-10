<script lang="ts">
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

	// Utility invoices of each building in the Abrechnungsperiode, so a missing one shows before the preview
	let invoiceCounts = $state<Record<string, number>>({});
	$effect(() => {
		const { start, end } = period;
		for (const building of buildings)
			api
				.get<{ total: number }>('/invoices', {
					buildingId: building.id,
					dateFrom: start,
					dateTo: end,
					isValidUtilityCost: 'true',
					limit: '1'
				})
				.then(({ data }) => {
					if (data) invoiceCounts = { ...invoiceCounts, [building.id]: data.total };
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

<fieldset class="flex flex-col gap-4" aria-describedby={error ? 'buildings-error' : undefined}>
	<legend class="sr-only">Gebäude</legend>
	<div class="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
		<label class="flex min-h-12 cursor-pointer items-center gap-4 font-semibold text-ink">
			<input
				type="checkbox"
				checked={allSelected}
				onchange={() => (selectedBuildingIds = allSelected ? [] : buildings.map((b) => b.id))}
				class="size-6 shrink-0 cursor-pointer accent-accent"
				data-testid="generate-all-buildings"
			/>
			Alle Gebäude
		</label>
		<span class="text-ink-muted" aria-live="polite">
			{selectedBuildingIds.length} von {buildings.length} gewählt
		</span>
	</div>

	{#each buildings as building (building.id)}
		<BuildingChoice
			{building}
			selected={selectedBuildingIds.includes(building.id)}
			invoices={invoiceCounts[building.id]}
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
