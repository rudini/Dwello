<script lang="ts">
	import type { ApartmentStatus } from '$lib/types';
	import { statusHelp, statusText } from '$lib/apartment';
	import EarlySelect from '../../EarlySelect.svelte';

	let { apartment }: { apartment: { status: ApartmentStatus; nextContractStart: string | null } } =
		$props();
	// Vermietet and Wiedervermietet follow from the rental contracts; only Leer and Gesperrt are set by hand
	const rented = $derived(apartment.status === 'occupied' || apartment.status === 'relet');
</script>

{#if rented}
	<div class="flex flex-col gap-2">
		<p class="font-semibold text-ink">Mietstatus</p>
		<p class="text-ink-muted">
			Der Mietstatus ergibt sich aus den Mietverträgen der Wohnung und lässt sich hier nicht ändern.
		</p>
		<p class="rounded-control bg-sunken px-4 py-2 text-ink" data-testid="apartment-status-rented">
			{statusText(apartment)}
		</p>
	</div>
{:else}
	<EarlySelect
		id="status"
		name="status"
		label="Mietstatus"
		help="Leer: {statusHelp.vacant} Gesperrt: {statusHelp.reserved} Vermietet wird die Wohnung mit einem Mietvertrag."
		options={[
			{ value: 'vacant', label: 'Leer' },
			{ value: 'reserved', label: 'Gesperrt' }
		]}
		value={apartment.status}
		testid="apartment-status-select"
	/>
{/if}
