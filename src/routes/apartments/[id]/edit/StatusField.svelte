<script lang="ts">
	import { untrack } from 'svelte';
	import { statusLabels } from '$lib/apartment';
	import type { ApartmentStatus } from '$lib/types';

	let { current }: { current: ApartmentStatus } = $props();

	let status = $state(untrack(() => current));
	// Ending the contract makes a rented apartment vacant; changing the status alone does not
	const endsRental = $derived(current === 'occupied' && status !== 'occupied');
</script>

<div>
	<label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
	<select
		id="status"
		name="status"
		value={status}
		onchange={(e) => (status = e.currentTarget.value as ApartmentStatus)}
		data-testid="apartment-status-select"
		class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
	>
		{#each Object.entries(statusLabels) as [value, label] (value)}
			<option {value}>{label}</option>
		{/each}
	</select>
	<p class="mt-1 text-sm text-gray-500">Der Status ändert sich automatisch bei Vertragsänderungen.</p>
	{#if endsRental}
		<p class="mt-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">
			Diese Wohnung ist aktuell vermietet. Beenden Sie zuerst den aktiven Mietvertrag.
		</p>
	{/if}
</div>
