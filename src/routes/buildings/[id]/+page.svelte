<script lang="ts">
	import { enhance } from '$app/forms';
	import type { BuildingDetailsData } from './+page.server';
	import type { ActionData, SubmitFunction } from './$types';
	import { addToast } from '$lib/stores';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';
	import InfoCard from '$lib/components/InfoCard.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import { statusLabels, statusVariants } from '$lib/apartment';

	let { data, form }: { data: BuildingDetailsData; form: ActionData } = $props();

	// Reactive accessors for data
	const building = $derived(data.building);
	const apartments = $derived(data.apartments);

	// Group apartments by floor
	const apartmentsByFloor = $derived.by(() =>
		data.apartments.reduce(
			(acc, apt) => {
				if (!acc[apt.floor]) {
					acc[apt.floor] = [];
				}
				acc[apt.floor].push(apt);
				return acc;
			},
			{} as Record<string, typeof data.apartments>
		)
	);

	const floors = $derived(Object.keys(apartmentsByFloor).sort());

	function formatOccupancy(occupied: number, total: number): string {
		const percentage = total > 0 ? Math.round((occupied / total) * 100) : 0;
		return `${occupied}/${total} (${percentage}%)`;
	}

	let showDeleteConfirm = $state(false);
	let deleteError = $state('');

	const handleDelete: SubmitFunction = ({ cancel }) => {
		if (building.apartmentCount > 0) {
			deleteError =
				'Dieses Gebäude kann nicht gelöscht werden, da es noch Wohnungen enthält. Bitte löschen Sie zuerst alle Wohnungen.';
			cancel();
			return;
		}
		return async ({ result, update }) => {
			if (result.type === 'redirect') addToast('success', 'Gebäude wurde erfolgreich gelöscht');
			await update();
		};
	};
</script>

<svelte:head>
	<title>{building.name || building.address} - Dwello</title>
</svelte:head>

<div class="space-y-6">
	<!-- Breadcrumb -->
	<nav class="flex items-center text-sm text-gray-500">
		<a href="/buildings" data-testid="breadcrumb-link" class="hover:text-blue-600 transition-colors"
			>Gebäude</a
		>
		<Icon name="chevron_right" size={16} class="mx-2" />
		<span class="text-gray-900 font-medium">{building.name || building.address}</span>
	</nav>

	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">{building.name || building.address}</h1>
			<p class="text-sm text-gray-500 flex items-center gap-1 mt-2" data-testid="building-address">
				<Icon name="location_on" size={16} />
				{[building.address, [building.postalCode, building.city].filter(Boolean).join(' ')]
					.filter(Boolean)
					.join(', ')}{#if building.canton}
					({building.canton}){/if}
			</p>
		</div>
		<div class="flex gap-2">
			<Button
				href="/buildings/{building.id}/edit"
				variant="secondary"
				testid="building-edit-button"
			>
				<Icon name="edit" size={18} />
				Bearbeiten
			</Button>
			<Button
				variant="danger-ghost"
				onclick={() => (showDeleteConfirm = true)}
				testid="building-delete-button"
			>
				<Icon name="delete" size={18} />
				Löschen
			</Button>
		</div>
	</div>

	<!-- Stats Cards -->
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<InfoCard icon="door_front" label="Wohnungen" value={building.apartmentCount.toString()} />
		<InfoCard
			icon="check_circle"
			label="Belegt"
			value={formatOccupancy(building.occupiedCount, building.apartmentCount)}
		/>
		<InfoCard
			icon="home"
			label="Leerstand"
			value={building.vacantCount.toString()}
			valueClass={building.vacantCount > 0 ? 'text-orange-600' : 'text-green-600'}
		/>
		{#if building.yearBuilt}
			<InfoCard icon="calendar_today" label="Baujahr" value={building.yearBuilt.toString()} />
		{/if}
	</div>

	<!-- Building Details Card -->
	<Card>
		<h2 class="text-lg font-semibold text-gray-900 mb-4">Gebäudedetails</h2>
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			<div>
				<p class="text-sm text-gray-500">Adresse</p>
				<p class="font-medium">{building.address}</p>
			</div>
			<div>
				<p class="text-sm text-gray-500">PLZ / Ort</p>
				<p class="font-medium">{building.postalCode} {building.city}</p>
			</div>
			{#if building.canton}
				<div>
					<p class="text-sm text-gray-500">Kanton</p>
					<p class="font-medium">{building.canton}</p>
				</div>
			{/if}
			{#if building.buildingType}
				<div>
					<p class="text-sm text-gray-500">Gebäudetyp</p>
					<p class="font-medium">{building.buildingType}</p>
				</div>
			{/if}
			{#if building.yearBuilt}
				<div>
					<p class="text-sm text-gray-500">Baujahr</p>
					<p class="font-medium" data-testid="building-year-built">{building.yearBuilt}</p>
				</div>
			{/if}
			{#if building.latitude && building.longitude}
				<div>
					<p class="text-sm text-gray-500">Koordinaten</p>
					<p class="font-medium text-sm">
						{Number(building.latitude).toFixed(4)}, {Number(building.longitude).toFixed(4)}
					</p>
				</div>
			{/if}
		</div>
	</Card>

	<!-- Apartments Section -->
	<div class="space-y-4">
		<div class="flex items-center justify-between">
			<h2 class="text-lg font-semibold text-gray-900">Wohnungen</h2>
			<Button
				href="/apartments/new?building={building.id}"
				variant="secondary"
				size="sm"
				testid="apartment-add-button"
			>
				<Icon name="add" size={16} />
				Wohnung hinzufügen
			</Button>
		</div>

		{#if apartments.length === 0}
			<Card>
				<div class="text-center py-8">
					<Icon name="door_front" size={48} class="mx-auto text-gray-300 mb-4" />
					<h3 class="text-lg font-medium text-gray-900 mb-2">Keine Wohnungen</h3>
					<p class="text-gray-500 mb-4">Fügen Sie Wohnungen zu diesem Gebäude hinzu.</p>
					<Button
						href="/apartments/new?building={building.id}"
						variant="primary"
						testid="apartment-first-create-button"
					>
						<Icon name="add" size={20} />
						Erste Wohnung erstellen
					</Button>
				</div>
			</Card>
		{:else}
			<!-- Apartments by Floor -->
			{#each floors as floor}
				<Card>
					<h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
						<Icon name="stairs" size={18} class="text-gray-400" />
						{floor}
					</h3>
					<div class="space-y-2">
						{#each apartmentsByFloor[floor] as apartment}
							<a
								href="/apartments/{apartment.id}"
								data-testid="apartment-row-{apartment.id}"
								class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
							>
								<div class="flex items-center gap-4">
									<div class="flex items-center gap-2">
										<Icon name="door_front" size={18} class="text-gray-400" />
										<span class="font-medium">{apartment.number}</span>
									</div>
									<div class="text-sm text-gray-500">
										{apartment.rooms} Zimmer &middot; {apartment.area} m²
									</div>
								</div>
								<div class="flex items-center gap-3">
									<Badge variant={statusVariants[apartment.status]}>
										{statusLabels[apartment.status]}
									</Badge>
									<Icon name="chevron_right" size={18} class="text-gray-400" />
								</div>
							</a>
						{/each}
					</div>
				</Card>
			{/each}
		{/if}
	</div>
</div>

<!-- Delete Confirmation Modal -->
{#if showDeleteConfirm}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
		<div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
			<div class="flex items-center gap-3 mb-4">
				<div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
					<Icon name="warning" size={24} class="text-red-600" />
				</div>
				<h3 class="text-lg font-semibold text-gray-900">Gebäude löschen?</h3>
			</div>

			<p class="text-gray-600 mb-4">
				Sind Sie sicher, dass Sie das Gebäude <strong>{building.name || building.address}</strong> löschen
				möchten? Diese Aktion kann nicht rückgängig gemacht werden.
			</p>

			{#if deleteError || form?.deleteError}
				<div class="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
					<p class="text-sm text-red-700" data-testid="form-error">
						{deleteError || form?.deleteError}
					</p>
				</div>
			{/if}

			<form
				method="POST"
				action="?/delete"
				use:enhance={handleDelete}
				class="flex gap-3 justify-end"
			>
				<Button
					variant="secondary"
					onclick={() => {
						showDeleteConfirm = false;
						deleteError = '';
					}}
				>
					Abbrechen
				</Button>
				<Button
					type="submit"
					variant="danger"
					disabled={!!deleteError}
					testid="building-delete-confirm"
				>
					Ja, löschen
				</Button>
			</form>
		</div>
	</div>
{/if}
