<script lang="ts">
	import ApartmentHeader from '$lib/components/ApartmentHeader.svelte';
	import InfoCard from '$lib/components/InfoCard.svelte';
	import CurrentTenantCard from '$lib/components/CurrentTenantCard.svelte';
	import MonthlyCostsCard from '$lib/components/MonthlyCostsCard.svelte';
	import ContractHistoryTable from '$lib/components/ContractHistoryTable.svelte';
	import { floorLabel, statusText } from '$lib/apartment';
	import { normalizeDecimal } from '$lib/utils/format';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const apartment = $derived(data.apartment);
	const cardClass = 'bg-white border border-slate-200 rounded-xl shadow-sm p-6';
</script>

<svelte:head>
	<title>Wohnung {apartment.number} - Dwello</title>
</svelte:head>

<div class="space-y-6">
	<ApartmentHeader {apartment} building={apartment.building} />

	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
		<div class={cardClass} data-testid="apartment-info-status">
			<InfoCard icon="check_circle" label="Status" value={statusText(apartment)} />
		</div>
		<div class={cardClass} data-testid="apartment-info-rooms">
			<InfoCard icon="home" label="Zimmer" value={normalizeDecimal(apartment.rooms)} />
		</div>
		<div class={cardClass} data-testid="apartment-info-floor">
			<InfoCard icon="apartment" label="Stockwerk" value={floorLabel(apartment.floor)} />
		</div>
		<div class={cardClass} data-testid="apartment-info-area">
			<InfoCard icon="straighten" label="Fläche" value="{normalizeDecimal(apartment.area)} m²" />
		</div>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
		<div class="lg:col-span-2 space-y-6">
			{#if data.currentContract}
				<CurrentTenantCard contract={data.currentContract} />
				<MonthlyCostsCard costs={data.monthlyCosts} />
			{:else}
				<div class={cardClass}>
					<p class="text-slate-600" data-testid="apartment-vacant">
						Diese Wohnung ist derzeit nicht vermietet.
					</p>
				</div>
			{/if}
		</div>
		<div class="lg:col-span-3">
			<ContractHistoryTable contracts={data.contractHistory} />
		</div>
	</div>
</div>
