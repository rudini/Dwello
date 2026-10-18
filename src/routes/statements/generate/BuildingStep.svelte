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
	let billed = $state<Record<string, { contracts: number; billed: number; partly: number }>>({});
	$effect(() => {
		const ids = buildings.map((b) => b.id);
		// both answers shown at once: one arriving later would push the rows below away while a building is clicked
		// (seen in Firefox, #424)
		Promise.all([
			api.get<{ invoices: { buildingId: string }[] }>('/invoices', {
				dateFrom: period.start,
				dateTo: period.end,
				isValidUtilityCost: 'true',
				limit: '1000'
			}),
			// Contracts with a statement in the period already get none from this run
			api.get<{ buildingId: string; contracts: number; billed: number; partly: number }[]>(
				'/statements/billed',
				{
					buildingIds: ids.join(','),
					periodStart: period.start,
					periodEnd: period.end
				}
			)
		]).then(([invoices, statements]) => {
			if (invoices.data) {
				const counts = Object.fromEntries(ids.map((id) => [id, 0]));
				for (const { buildingId } of invoices.data.invoices)
					if (buildingId in counts) counts[buildingId]++;
				invoiceCounts = counts;
			}
			if (statements.data)
				billed = Object.fromEntries(statements.data.map((row) => [row.buildingId, row]));
		});
	});

	// «Alle Gebäude» leaves out buildings whose contracts are all billed for the whole period: none gets a statement
	// (#201); a statement that leaves days of a contract open does not count (Fachreview M-1)
	const leftOut = $derived(
		buildings.filter(({ id }) => {
			const row = billed[id];
			return !!row?.contracts && row.billed === row.contracts && !row.partly;
		})
	);
	const all = $derived(buildings.filter((b) => !leftOut.includes(b)).map((b) => b.id));
	const allSelected = $derived(
		all.length > 0 && all.every((id) => selectedBuildingIds.includes(id))
	);

	// with every building left out there is nothing to choose: the box stays empty (code review C-1)
	function toggleAll(event: Event & { currentTarget: HTMLInputElement }) {
		selectedBuildingIds = allSelected ? [] : all;
		event.currentTarget.checked = allSelected;
	}

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
				onchange={toggleAll}
				class="size-6 shrink-0 cursor-pointer accent-accent"
				data-testid="generate-all-buildings"
			/>
			{m.apartments_all_buildings()}
		</label>
		<span class="text-ink-muted" aria-live="polite">
			{m.statements_selected_of({ selected: selectedBuildingIds.length, total: buildings.length })}
		</span>
		{#if leftOut.length}
			<p class="basis-full text-ink-muted" data-testid="generate-all-buildings-note">
				{leftOut.length === 1
					? m.statements_all_buildings_left_out_one()
					: m.statements_all_buildings_left_out_many({ count: leftOut.length })}
			</p>
		{/if}
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
