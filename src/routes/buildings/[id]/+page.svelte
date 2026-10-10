<script lang="ts">
	import type { BuildingDetailsData } from './+page.server';
	import type { ActionData } from './$types';
	import Button from '$lib/ui/Button.svelte';
	import EmptyState from '$lib/ui/EmptyState.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import StatusLegend from '../../apartments/StatusLegend.svelte';
	import ApartmentsByFloor from './ApartmentsByFloor.svelte';
	import BuildingFacts from './BuildingFacts.svelte';
	import DeleteBuildingDialog from './DeleteBuildingDialog.svelte';
	import FuelStocks from './FuelStocks.svelte';

	let { data, form }: { data: BuildingDetailsData; form: ActionData } = $props();

	const building = $derived(data.building);
	const name = $derived(building.name || building.address);
	const newApartment = $derived(`/apartments/new?building=${building.id}`);

	let deleting = $state(false);
</script>

<svelte:head>
	<title>{name} - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8">
	<PageHeader
		title={name}
		purpose="Angaben und Wohnungen des Gebäudes"
		trail={[{ href: '/buildings', label: 'Gebäude' }]}
	>
		{#snippet action()}
			<Button href="/buildings/{building.id}/edit" icon="edit" testid="building-edit-button"
				>Bearbeiten</Button
			>
			<Button
				variant="danger-ghost"
				icon="delete"
				onclick={() => (deleting = true)}
				testid="building-delete-button">Löschen</Button
			>
		{/snippet}
	</PageHeader>

	<BuildingFacts {building} />

	<section aria-labelledby="apartments-heading" class="flex flex-col gap-4">
		<div class="flex flex-wrap items-center justify-between gap-4">
			<h2 id="apartments-heading" class="text-2xl font-bold text-ink">Wohnungen</h2>
			{#if data.apartments.length}
				<Button href={newApartment} variant="primary" icon="add" testid="apartment-add-button"
					>Wohnung erfassen</Button
				>
			{/if}
		</div>
		{#if data.apartments.length}
			<ApartmentsByFloor apartments={data.apartments} />
		{:else}
			<div class="rounded-panel border border-line bg-surface">
				<EmptyState
					title="Noch keine Wohnungen"
					text="Erfassen Sie die Wohnungen dieses Gebäudes, damit Sie sie vermieten und abrechnen können."
					illustration="apartment"
					actionLabel="Wohnung erfassen"
					actionHref={newApartment}
					actionTestid="apartment-first-create-button"
				/>
			</div>
		{/if}
	</section>

	{#if data.apartments.length}<StatusLegend />{/if}

	<FuelStocks stocks={data.fuelStocks} errors={form?.fuelStockErrors} />
</div>

<DeleteBuildingDialog
	bind:open={deleting}
	{name}
	hasApartments={building.apartmentCount > 0}
	serverError={form?.deleteError}
/>
