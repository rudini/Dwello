<script lang="ts">
	import type { Building } from '$lib/types';

	let {
		buildings,
		selectedBuildingIds = $bindable()
	}: { buildings: (Building & { apartmentCount: number })[]; selectedBuildingIds: string[] } =
		$props();

	const allSelected = $derived(
		buildings.length > 0 && selectedBuildingIds.length === buildings.length
	);

	function toggleBuilding(buildingId: string) {
		selectedBuildingIds = selectedBuildingIds.includes(buildingId)
			? selectedBuildingIds.filter((id) => id !== buildingId)
			: [...selectedBuildingIds, buildingId];
	}

	function toggleAllBuildings() {
		selectedBuildingIds = allSelected ? [] : buildings.map((b) => b.id);
	}
</script>

<div class="space-y-6">
	<div>
		<h2 class="text-lg font-semibold text-gray-900 mb-4">Gebäude auswählen</h2>
		<p class="text-ink-muted mb-6">
			Wählen Sie die Gebäude aus, für die Abrechnungen erstellt werden sollen.
		</p>
	</div>

	<div class="flex items-center justify-between pb-4 border-b border-gray-200">
		<label class="flex items-center gap-3 cursor-pointer">
			<input
				type="checkbox"
				checked={allSelected}
				onchange={toggleAllBuildings}
				class="w-5 h-5 text-accent rounded border-gray-300 focus:ring-blue-500"
			/>
			<span class="font-medium text-gray-900">Alle Gebäude auswählen</span>
		</label>
		<span class="text-sm text-ink-muted">
			{selectedBuildingIds.length} von {buildings.length} ausgewählt
		</span>
	</div>

	<div class="space-y-3">
		{#each buildings as building}
			{@const selected = selectedBuildingIds.includes(building.id)}
			<label
				class="flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors
				{selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}"
			>
				<input
					type="checkbox"
					data-testid="generate-building-{building.id}"
					checked={selected}
					onchange={() => toggleBuilding(building.id)}
					class="w-5 h-5 text-accent rounded border-gray-300 focus:ring-blue-500"
				/>
				<div class="flex-1">
					<p class="font-medium text-gray-900">
						{building.name || `${building.address}, ${building.city}`}
					</p>
					<p class="text-sm text-ink-muted">
						{building.address}, {building.postalCode}
						{building.city}
					</p>
				</div>
				<div class="text-right">
					<p class="font-medium text-gray-900">{building.apartmentCount}</p>
					<p class="text-sm text-ink-muted">Wohnungen</p>
				</div>
			</label>
		{/each}
	</div>
</div>
