<script lang="ts">
	import EarlySelect from '$lib/ui/EarlySelect.svelte';

	type Building = { id: string; name: string; address: string };

	// Coming from a building page the building is fixed; otherwise the user picks it
	let {
		buildings,
		preset,
		error,
		onselect
	}: { buildings: Building[]; preset?: Building; error?: string; onselect: (id: string) => void } =
		$props();
</script>

{#if preset}
	<input type="hidden" name="buildingId" value={preset.id} />
	<div class="flex flex-col gap-2">
		<p class="font-semibold text-ink">Gebäude</p>
		<p class="rounded-control bg-sunken px-4 py-2 text-ink" data-testid="apartment-building">
			{preset.name}
			<span class="block text-ink-muted">{preset.address}</span>
		</p>
	</div>
{:else}
	<EarlySelect
		id="building"
		name="buildingId"
		label="Gebäude"
		help="Das Gebäude, zu dem die Wohnung gehört."
		placeholder="Gebäude wählen"
		options={buildings.map((b) => ({ value: b.id, label: b.name }))}
		{error}
		testid="apartment-building-select"
		onchange={onselect}
	/>
{/if}
