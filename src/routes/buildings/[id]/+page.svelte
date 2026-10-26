<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { ActionData, PageData } from './$types';
	import Button from '$lib/ui/Button.svelte';
	import EmptyState from '$lib/ui/EmptyState.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import StatusLegend from '../../apartments/StatusLegend.svelte';
	import ApartmentsByFloor from './ApartmentsByFloor.svelte';
	import BuildingFacts from './BuildingFacts.svelte';
	import DeleteBuildingDialog from './DeleteBuildingDialog.svelte';
	import FuelStocks from './FuelStocks.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

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
		purpose={m.buildings_detail_purpose()}
		trail={[{ href: '/buildings', label: m.nav_buildings() }]}
	>
		{#snippet action()}
			<!-- #456: the invoice list, filtered to this building -->
			<Button
				href="/invoices?building={building.id}"
				icon="invoice"
				testid="building-invoices-button">{m.dashboard_invoices()}</Button
			>
			<Button href="/buildings/{building.id}/edit" icon="edit" testid="building-edit-button"
				>{m.buildings_edit()}</Button
			>
			<Button
				variant="danger-ghost"
				icon="delete"
				onclick={() => (deleting = true)}
				testid="building-delete-button">{m.buildings_delete()}</Button
			>
		{/snippet}
	</PageHeader>

	<BuildingFacts {building} />

	<section aria-labelledby="apartments-heading" class="flex flex-col gap-4">
		<div class="flex flex-wrap items-center justify-between gap-4">
			<h2 id="apartments-heading" class="text-2xl font-bold text-ink">{m.nav_apartments()}</h2>
			{#if data.apartments.length}
				<Button href={newApartment} variant="primary" icon="add" testid="apartment-add-button"
					>{m.buildings_add_apartment()}</Button
				>
			{/if}
		</div>
		{#if data.apartments.length}
			<ApartmentsByFloor apartments={data.apartments} />
		{:else}
			<div class="rounded-panel border border-line bg-surface">
				<EmptyState
					title={m.buildings_no_apartments()}
					text={m.buildings_no_apartments_text()}
					illustration="apartment"
					actionLabel={m.buildings_add_apartment()}
					actionHref={newApartment}
					actionTestid="apartment-first-create-button"
				/>
			</div>
		{/if}
	</section>

	{#if data.apartments.length}<StatusLegend />{/if}

	<FuelStocks
		stocks={data.fuelStocks}
		categories={data.heatingCategories}
		errors={form?.fuelStockErrors}
		saved={!!form?.fuelStockSaved}
		deleteError={form?.fuelStockDeleteError}
	/>
</div>

<DeleteBuildingDialog
	bind:open={deleting}
	{name}
	hasApartments={building.apartmentCount > 0}
	serverError={form?.deleteError}
/>
