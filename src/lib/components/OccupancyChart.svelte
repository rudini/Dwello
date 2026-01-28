<script lang="ts">
	interface BuildingOccupancy {
		buildingId: string;
		buildingName: string;
		totalApartments: number;
		occupiedApartments: number;
		occupancyRate: number;
	}

	interface Props {
		buildings: BuildingOccupancy[];
		class?: string;
	}

	let { buildings, class: className = '' }: Props = $props();

	function getOccupancyColor(rate: number): string {
		if (rate >= 90) return 'bg-green-500';
		if (rate >= 75) return 'bg-blue-500';
		if (rate >= 50) return 'bg-yellow-500';
		return 'bg-red-500';
	}

	function getOccupancyTextColor(rate: number): string {
		if (rate >= 90) return 'text-green-600';
		if (rate >= 75) return 'text-blue-600';
		if (rate >= 50) return 'text-yellow-600';
		return 'text-red-600';
	}
</script>

<div class="bg-white border border-gray-200 rounded-xl {className}">
	<div class="px-6 py-4 border-b border-gray-200">
		<h3 class="text-lg font-semibold text-gray-900">Belegungsrate nach Gebäude</h3>
	</div>

	<div class="p-6 space-y-5">
		{#each buildings as building}
			<div>
				<div class="flex items-center justify-between mb-2">
					<a
						href="/buildings/{building.buildingId}"
						class="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
					>
						{building.buildingName}
					</a>
					<span class="text-sm font-semibold {getOccupancyTextColor(building.occupancyRate)}">
						{building.occupancyRate.toFixed(1)}%
					</span>
				</div>
				<div class="flex items-center gap-3">
					<div class="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
						<div
							class="h-full rounded-full transition-all duration-500 {getOccupancyColor(building.occupancyRate)}"
							style="width: {building.occupancyRate}%"
						></div>
					</div>
					<span class="text-xs text-gray-500 w-16 text-right">
						{building.occupiedApartments}/{building.totalApartments}
					</span>
				</div>
			</div>
		{/each}
	</div>

	<div class="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
		<div class="flex items-center justify-between text-sm">
			<span class="text-gray-500">Durchschnittliche Belegung</span>
			<span class="font-semibold text-gray-900">
				{(buildings.reduce((sum, b) => sum + b.occupancyRate, 0) / buildings.length).toFixed(1)}%
			</span>
		</div>
	</div>
</div>
