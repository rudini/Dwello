<script lang="ts">
	import Icon from '$lib/ui/Icon.svelte';
	import type { Building } from '$lib/types';

	// Step 2: the buildings whose rental contracts get a Nebenkostenabrechnung
	let {
		buildings,
		selectedBuildingIds = $bindable(),
		error
	}: {
		buildings: (Building & { apartmentCount: number })[];
		selectedBuildingIds: string[];
		error?: string;
	} = $props();

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
		{@const selected = selectedBuildingIds.includes(building.id)}
		<label
			class="flex min-h-12 cursor-pointer items-center gap-4 rounded-control border-2 p-4 {selected
				? 'border-accent bg-accent-soft'
				: 'border-line-strong bg-surface'}"
		>
			<input
				type="checkbox"
				checked={selected}
				onchange={() => toggle(building.id)}
				aria-invalid={error ? true : undefined}
				aria-describedby={error ? 'buildings-error' : undefined}
				class="size-6 shrink-0 cursor-pointer accent-accent"
				data-testid="generate-building-{building.id}"
			/>
			<span class="flex flex-1 flex-col gap-1">
				<span class="font-semibold text-ink">{building.name}</span>
				<span class="text-ink-muted">{building.address}, {building.postalCode} {building.city}</span
				>
			</span>
			<span class="text-right text-ink-muted">
				<span class="font-semibold tabular-nums text-ink">{building.apartmentCount}</span> Wohnungen
			</span>
		</label>
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
