<script lang="ts">
	import ApartmentHeader from '$lib/components/ApartmentHeader.svelte';
	import InfoCard from '$lib/components/InfoCard.svelte';
	import TabNavigation from '$lib/components/TabNavigation.svelte';
	import CurrentTenantCard from '$lib/components/CurrentTenantCard.svelte';
	import MonthlyCostsCard from '$lib/components/MonthlyCostsCard.svelte';
	import ContractHistoryTable from '$lib/components/ContractHistoryTable.svelte';
	import type { ApartmentDetailsData } from '$lib/types';

	let { data }: { data: ApartmentDetailsData } = $props();

	let activeTab = $state('overview');

	const tabs = [
		{ id: 'overview', label: 'Übersicht', icon: 'grid_view' },
		{ id: 'contracts', label: 'Mietverträge', icon: 'description' },
		{ id: 'finances', label: 'Finanzen', icon: 'account_balance' },
		{ id: 'documents', label: 'Dokumente', icon: 'folder' }
	];

	function handleTabChange(tabId: string) {
		activeTab = tabId;
	}
</script>

<svelte:head>
	<title>Wohnung {data.apartment.number} - Dwello</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<ApartmentHeader apartment={data.apartment} building={data.building} />

	<!-- Info Cards Grid -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
		<div class="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
			<InfoCard icon="check_circle" label="Status" value={data.apartment.status} />
		</div>
		<div class="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
			<InfoCard icon="home" label="Zimmer" value={String(data.apartment.rooms)} />
		</div>
		<div class="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
			<InfoCard icon="apartment" label="Stockwerk" value={String(data.apartment.floor)} />
		</div>
		<div class="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
			<InfoCard icon="straighten" label="Fläche" value="{data.apartment.area} m²" />
		</div>
	</div>

	<!-- Tab Navigation -->
	<TabNavigation {tabs} {activeTab} onTabChange={handleTabChange} />

	<!-- Main Content - Two Column Layout -->
	{#if activeTab === 'overview'}
		<div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
			<!-- Left Column (Aktueller Mieter + Monatliche Kosten) -->
			<div class="lg:col-span-2 space-y-6">
				{#if data.currentTenant && data.currentContract}
					<CurrentTenantCard
						tenant={data.currentTenant}
						contract={data.currentContract}
						status="AKTIV"
					/>
				{/if}
				<MonthlyCostsCard costs={data.monthlyCosts} />
			</div>

			<!-- Right Column (Mietvertragshistorie) -->
			<div class="lg:col-span-3">
				<ContractHistoryTable contracts={data.contractHistory} />
			</div>
		</div>
	{:else if activeTab === 'contracts'}
		<div class="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
			<p class="text-slate-600">Mietverträge Tab - Kommt bald</p>
		</div>
	{:else if activeTab === 'finances'}
		<div class="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
			<p class="text-slate-600">Finanzen Tab - Kommt bald</p>
		</div>
	{:else if activeTab === 'documents'}
		<div class="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
			<p class="text-slate-600">Dokumente Tab - Kommt bald</p>
		</div>
	{/if}
</div>
