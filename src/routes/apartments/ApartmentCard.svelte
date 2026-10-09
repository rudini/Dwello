<script lang="ts">
	import { floorLabel, statusText, statusVariants } from '$lib/apartment';
	import type { ApartmentWithBuilding } from '$lib/types';
	import Badge from '$lib/components/Badge.svelte';
	import Icon from '$lib/components/Icon.svelte';

	let { apartment }: { apartment: ApartmentWithBuilding } = $props();
</script>

<a
	href="/apartments/{apartment.id}"
	data-testid="apartment-card-{apartment.id}"
	class="block bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200"
>
	<div class="p-5">
		<!-- Header with Unit and Status -->
		<div class="flex items-start justify-between mb-3">
			<div class="flex-1 min-w-0">
				<h3 class="font-semibold text-gray-900 text-lg">
					Wohnung {apartment.number}
				</h3>
				<p class="text-sm text-ink-muted">{floorLabel(apartment.floor)}</p>
			</div>
			<span data-testid="apartment-status">
				<Badge variant={statusVariants[apartment.status]}>
					{statusText(apartment)}
				</Badge>
			</span>
		</div>

		<!-- Building Info -->
		<div class="flex items-center text-sm text-gray-600 mb-4">
			<Icon name="apartment" size={16} class="mr-1 text-ink-muted" />
			<span class="truncate">{apartment.buildingName}</span>
		</div>

		<!-- Apartment Details -->
		<div class="grid grid-cols-2 gap-3 mb-4">
			<div class="flex items-center text-sm">
				<Icon name="straighten" size={16} class="mr-1 text-ink-muted" />
				<span>{apartment.area} m²</span>
			</div>
			<div class="flex items-center text-sm">
				<Icon name="meeting_room" size={16} class="mr-1 text-ink-muted" />
				<span>{apartment.rooms} Zimmer</span>
			</div>
		</div>
	</div>
</a>
