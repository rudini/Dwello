<script lang="ts">
	import type { ApartmentStatus } from '$lib/types';
	import { statusText } from '$lib/apartment';

	let { apartment }: { apartment: { status: ApartmentStatus; nextContractStart: string | null } } = $props();
	// Occupied and relet follow from the rental contracts
	const rented = $derived(apartment.status === 'occupied' || apartment.status === 'relet');
</script>

<div>
	<label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
	{#if rented}
		<p class="px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700" data-testid="apartment-status-rented">
			{statusText(apartment)}
		</p>
		<p class="mt-1 text-sm text-gray-500">Der Status ergibt sich aus den Mietverträgen der Wohnung.</p>
	{:else}
		<select
			id="status"
			name="status"
			value={apartment.status}
			data-testid="apartment-status-select"
			class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
		>
			<option value="vacant">Leer</option>
			<option value="reserved">Gesperrt</option>
		</select>
		<p class="mt-1 text-sm text-gray-500">
			Vermietet wird die Wohnung mit einem Mietvertrag. Gesperrt bleibt sie z.B. während einer Renovation.
		</p>
	{/if}
</div>
