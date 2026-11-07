<script lang="ts">
	import { periodQuery } from '$lib/accounting-period';
	import { m } from '$lib/paraglide/messages';
	import { api } from '$lib/api';
	import Icon from '$lib/ui/Icon.svelte';
	import BuildingChoice from './BuildingChoice.svelte';
	import type { Building } from '$lib/types';
	import { unchoosable, type Billed } from '$lib/statement-wizard';

	// Step 2: the buildings whose rental contracts get a Nebenkostenabrechnung
	let {
		buildings,
		selectedBuildingIds = $bindable(),
		period,
		error,
		loading = $bindable(false)
	}: {
		buildings: (Building & { apartmentCount: number })[];
		selectedBuildingIds: string[];
		period: { start: string; end: string };
		error?: string;
		loading?: boolean; // until both answers below are shown (#468)
	} = $props();

	// Utility invoices of each building in the Abrechnungsperiode, so a missing one shows before the preview:
	// the ones the statement takes, as the preview counts them (#686), counted per building
	let invoiceCounts = $state<Record<string, number>>({});
	let billed = $state<Record<string, Billed>>({});
	// #738: a count that failed is said, so no building reads as having no invoices or statements
	let failed = $state({ invoices: false, billed: false });
	// read with the group, not only seen (persona Sven 738 P-1)
	const countsFailed = $derived(failed.invoices || failed.billed);
	// #1068: how an existing draft is recalculated, once for the step when a building has billed contracts (Helga P-7, #201)
	const recalculate = $derived(buildings.some((b) => billed[b.id]?.billed && !unchoosable(billed[b.id])));
	const describedBy = $derived(
		[error && 'buildings-error', countsFailed && 'buildings-counts-failed', recalculate && 'buildings-recalculate']
			.filter(Boolean)
			.join(' ') || undefined
	);
	$effect(() => {
		const ids = buildings.map((b) => b.id);
		// both answers shown at once: one arriving later would push the rows below away while a building is clicked
		// (seen in Firefox, #424)
		loading = true;
		let left = false; // an answer to a step left meanwhile must not unlock the one opened anew
		Promise.all([
			api.get<{ invoices: { buildingId: string }[] }>('/statements/invoices', {
				buildingIds: ids.join(','),
				...periodQuery(period)
			}),
			// Contracts with a statement in the period already get none from this run
			api.get<(Billed & { buildingId: string })[]>('/statements/billed', {
				buildingIds: ids.join(','),
				...periodQuery(period)
			})
		]).then(([invoices, statements]) => {
			if (left) return;
			failed = { invoices: !invoices.data, billed: !statements.data };
			if (invoices.data) {
				const counts = Object.fromEntries(ids.map((id) => [id, 0]));
				for (const { buildingId } of invoices.data.invoices)
					if (buildingId in counts) counts[buildingId]++;
				invoiceCounts = counts;
			}
			if (statements.data) {
				billed = Object.fromEntries(statements.data.map((row) => [row.buildingId, row]));
				// a building that bills another period is not chosen, also not from a link or a draft (#1088)
				selectedBuildingIds = selectedBuildingIds.filter((id) => !unchoosable(billed[id]));
			}
			loading = false;
		});
		return () => {
			left = true;
			loading = false; // left before the answers came: the next step does not wait for them
		};
	});

	// «Alle Gebäude» leaves out buildings whose contracts are all billed: none gets a statement (#201), said at the
	// counter; and buildings that bill another period, which say so themselves (#1088)
	const leftOut = $derived(
		buildings.filter(({ id }) => {
			const row = billed[id];
			return !!row?.contracts && row.billed === row.contracts && !unchoosable(row);
		})
	);
	const all = $derived(
		buildings.filter((b) => !leftOut.includes(b) && !unchoosable(billed[b.id])).map((b) => b.id)
	);
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

<fieldset class="flex min-w-0 flex-col gap-4" aria-describedby={describedBy}>
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
		{#if countsFailed}
			<p
				id="buildings-counts-failed"
				class="basis-full font-semibold text-caution"
				data-testid="generate-counts-failed"
			>
				{[
					failed.invoices && m.statements_buildings_invoices_failed(),
					failed.billed && m.statements_buildings_billed_failed(),
					m.statements_buildings_reload()
				]
					.filter(Boolean)
					.join(' ')}
			</p>
		{/if}
		{#if recalculate}
			<p id="buildings-recalculate" class="basis-full text-ink-muted" data-testid="generate-recalculate-note">
				{m.statements_building_recalculate()}
			</p>
		{/if}
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
