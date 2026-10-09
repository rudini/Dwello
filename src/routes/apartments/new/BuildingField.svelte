<script lang="ts">
	import FieldError from '$lib/components/FieldError.svelte';
	import { keepEarlyChoice } from '$lib/early-choice';

	type Building = { id: string; name: string; address: string };

	let {
		buildings,
		preset,
		error,
		onselect
	}: { buildings: Building[]; preset?: Building; error?: string; onselect: (id: string) => void } =
		$props();
</script>

<div>
	<label for="building" class="block text-sm font-medium text-gray-700 mb-1">
		Gebäude <span class="text-critical">*</span>
	</label>
	{#if preset}
		<input type="hidden" name="buildingId" value={preset.id} />
		<p
			class="px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700"
			data-testid="apartment-building"
		>
			{preset.name}
			<span class="block text-sm text-ink-muted">{preset.address}</span>
		</p>
	{:else}
		<select
			id="building"
			name="buildingId"
			onchange={(e) => onselect(e.currentTarget.value)}
			use:keepEarlyChoice={onselect}
			data-testid="apartment-building-select"
			class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
		>
			<option value="">Gebäude auswählen...</option>
			{#each buildings as building (building.id)}
				<option value={building.id}>{building.name}</option>
			{/each}
		</select>
	{/if}
	<FieldError message={error} />
</div>
