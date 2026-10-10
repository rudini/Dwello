<script lang="ts">
	import CurrentTenantCard from '$lib/components/CurrentTenantCard.svelte';
	import MonthlyCostsCard from '$lib/components/MonthlyCostsCard.svelte';
	import Button from '$lib/ui/Button.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import ApartmentFacts from './ApartmentFacts.svelte';
	import ContractHistory from './ContractHistory.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const apartment = $derived(data.apartment);
	const building = $derived(apartment.building);
</script>

<svelte:head>
	<title>Wohnung {apartment.number} - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8">
	<PageHeader
		title="Wohnung {apartment.number}"
		purpose="{building.address}, {building.postalCode} {building.city}"
		trail={[
			{ href: '/apartments', label: 'Wohnungen' },
			{ href: `/buildings/${building.id}`, label: building.name }
		]}
	>
		{#snippet action()}
			<Button href="/apartments/{apartment.id}/edit" icon="edit" testid="apartment-edit-button"
				>Bearbeiten</Button
			>
			{#if !data.currentContract}
				<Button
					href="/contracts/new?apartment={apartment.id}"
					variant="primary"
					icon="contract"
					testid="apartment-new-contract">Mietvertrag erfassen</Button
				>
			{/if}
		{/snippet}
	</PageHeader>

	<ApartmentFacts {apartment} />

	<div class="grid gap-8 lg:grid-cols-5">
		<div class="flex flex-col gap-8 lg:col-span-2">
			{#if data.currentContract}
				<CurrentTenantCard contract={data.currentContract} />
				<MonthlyCostsCard costs={data.monthlyCosts} />
			{:else}
				<Panel title="Aktueller Mieter">
					<p class="text-ink-muted" data-testid="apartment-vacant">
						Diese Wohnung ist derzeit nicht vermietet.
					</p>
				</Panel>
			{/if}
		</div>
		<div class="lg:col-span-3">
			<ContractHistory contracts={data.contractHistory} />
		</div>
	</div>
</div>
