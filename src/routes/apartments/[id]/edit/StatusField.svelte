<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { ApartmentStatus } from '$lib/types';
	import { statusHelp, statusLabels, statusText } from '$lib/apartment';
	import EarlySelect from '$lib/ui/EarlySelect.svelte';

	let { apartment }: { apartment: { status: ApartmentStatus; nextContractStart: string | null } } =
		$props();
	// Vermietet and Wiedervermietet follow from the rental contracts; only Leer and Gesperrt are set by hand
	const rented = $derived(apartment.status === 'occupied' || apartment.status === 'relet');
</script>

{#if rented}
	<div class="flex flex-col gap-2">
		<p class="font-semibold text-ink">{m.apartments_status()}</p>
		<p class="text-ink-muted">
			{m.apartments_status_fixed()}
		</p>
		<p class="rounded-control bg-sunken px-4 py-2 text-ink" data-testid="apartment-status-rented">
			{statusText(apartment)}
		</p>
	</div>
{:else}
	<EarlySelect
		id="status"
		name="status"
		label={m.apartments_status()}
		help={m.apartments_status_select_help({
			vacant: statusHelp.vacant,
			reserved: statusHelp.reserved
		})}
		options={[
			{ value: 'vacant', label: statusLabels.vacant },
			{ value: 'reserved', label: statusLabels.reserved }
		]}
		value={apartment.status}
		testid="apartment-status-select"
	/>
{/if}
