<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { ApartmentsListData } from '$lib/types';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import SearchField from '$lib/components/SearchField.svelte';
	import Card from '$lib/components/Card.svelte';
	import Badge from '$lib/components/Badge.svelte';

	let { data }: { data: ApartmentsListData } = $props();

	let searchTerm = $state($page.url.searchParams.get('search') || '');
	let buildingFilter = $state($page.url.searchParams.get('building') || '');
	let statusFilter = $state($page.url.searchParams.get('status') || '');

	// Derived values
	const totalPages = $derived.by(() => Math.ceil(data.total / data.pageSize));
	const hasNextPage = $derived.by(() => data.page < totalPages);
	const hasPrevPage = $derived.by(() => data.page > 1);

	function handleSearch() {
		const params = new URLSearchParams();
		if (searchTerm) params.set('search', searchTerm);
		if (buildingFilter) params.set('building', buildingFilter);
		if (statusFilter) params.set('status', statusFilter);
		params.set('page', '1');
		goto(`/apartments?${params.toString()}`);
	}

	function handlePageChange(newPage: number) {
		const params = new URLSearchParams($page.url.searchParams);
		params.set('page', newPage.toString());
		goto(`/apartments?${params.toString()}`);
	}

	function clearFilters() {
		searchTerm = '';
		buildingFilter = '';
		statusFilter = '';
		goto('/apartments');
	}

	function getStatusVariant(
		status: string
	): 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' {
		switch (status) {
			case 'occupied':
				return 'success';
			case 'vacant':
				return 'warning';
			case 'reserved':
				return 'danger';
			default:
				return 'default';
		}
	}

	function getStatusLabel(status: string): string {
		switch (status) {
			case 'occupied':
				return 'Vermietet';
			case 'vacant':
				return 'Leer';
			case 'reserved':
				return 'Reserviert';
			default:
				return status;
		}
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('de-CH', {
			style: 'currency',
			currency: 'CHF',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(amount);
	}
</script>

<svelte:head>
	<title>Wohnungen - Dwello</title>
</svelte:head>

<div class="space-y-6" data-testid="apartments-page">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Wohnungen</h1>
			<p class="text-gray-500 mt-1">{data.total} Wohnungen insgesamt</p>
		</div>
		<Button href="/apartments/new" variant="primary" testid="apartments-new-button">
			<Icon name="add" size={20} />
			Neue Wohnung
		</Button>
	</div>

	<!-- Search and Filters -->
	<Card>
		<form onsubmit={(e) => { e.preventDefault(); handleSearch(); }} class="space-y-4">
			<div class="flex flex-col sm:flex-row gap-4">
				<SearchField bind:value={searchTerm} placeholder="Wohnungsnummer, Gebäude oder Mieter..." testid="apartments-search-input" />
				<div class="w-full sm:w-48">
					<label for="building" class="block text-sm font-medium text-gray-700 mb-1">Gebäude</label>
					<select
						id="building"
						data-testid="apartments-building-filter"
						bind:value={buildingFilter}
						class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
					>
						<option value="">Alle Gebäude</option>
						{#each data.buildings as building}
							<option value={building.id}>{building.name || building.address}</option>
						{/each}
					</select>
				</div>
				<div class="w-full sm:w-40">
					<label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
					<select
						id="status"
						data-testid="apartments-status-filter"
						bind:value={statusFilter}
						class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
					>
						<option value="">Alle Status</option>
						<option value="occupied">Vermietet</option>
						<option value="vacant">Leer</option>
						<option value="reserved">Gesperrt</option>
					</select>
				</div>
			</div>
			<div class="flex gap-2">
				<Button type="submit" variant="primary" size="sm" testid="apartments-search-submit">
					<Icon name="search" size={16} />
					Suchen
				</Button>
				{#if searchTerm || buildingFilter || statusFilter}
					<Button type="button" variant="secondary" size="sm" onclick={clearFilters}>
						<Icon name="close" size={16} />
						Filter löschen
					</Button>
				{/if}
			</div>
		</form>
	</Card>

	<!-- Apartments List -->
	{#if data.apartments.length === 0}
		<Card>
			<div class="text-center py-12">
				<Icon name="door_front" size={48} class="mx-auto text-gray-300 mb-4" />
				<h3 class="text-lg font-medium text-gray-900 mb-2">Keine Wohnungen gefunden</h3>
				<p class="text-gray-500 mb-6">
					{#if searchTerm || buildingFilter || statusFilter}
						Versuchen Sie es mit anderen Suchbegriffen oder Filtern.
					{:else}
						Erstellen Sie Ihre erste Wohnung, um loszulegen.
					{/if}
				</p>
				{#if !searchTerm && !buildingFilter && !statusFilter}
					<Button href="/apartments/new" variant="primary">
						<Icon name="add" size={20} />
						Erste Wohnung erstellen
					</Button>
				{/if}
			</div>
		</Card>
	{:else}
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each data.apartments as apartment}
				<a
					href="/apartments/{apartment.id}"
					data-testid="apartment-card-{apartment.id}"
					class="block bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200"
				>
					<div class="p-5">
						<!-- Header with Unit and Status -->
						<div class="flex items-start justify-between mb-3">
							<div class="flex-1 min-w-0">
								<h3 class="font-semibold text-gray-900 text-lg">
									Wohnung {apartment.number}
								</h3>
								<p class="text-sm text-gray-500">{apartment.floor}</p>
							</div>
							<span data-testid="apartment-status">
								<Badge variant={getStatusVariant(apartment.status)}>
									{getStatusLabel(apartment.status)}
								</Badge>
							</span>
						</div>

						<!-- Building Info -->
						<div class="flex items-center text-sm text-gray-600 mb-4">
							<Icon name="apartment" size={16} class="mr-1 text-gray-400" />
							<span class="truncate">{apartment.buildingName || apartment.buildingAddress}</span>
						</div>

						<!-- Apartment Details -->
						<div class="grid grid-cols-2 gap-3 mb-4">
							<div class="flex items-center text-sm">
								<Icon name="straighten" size={16} class="mr-1 text-gray-400" />
								<span>{apartment.area} m²</span>
							</div>
							<div class="flex items-center text-sm">
								<Icon name="meeting_room" size={16} class="mr-1 text-gray-400" />
								<span>{apartment.rooms} Zimmer</span>
							</div>
						</div>

						<!-- Tenant & Rent Info -->
						<div class="pt-3 border-t border-gray-100">
							{#if apartment.status === 'occupied' && apartment.currentTenantName}
								<div class="flex items-center justify-between">
									<div class="flex items-center text-sm text-gray-600 min-w-0">
										<Icon name="person" size={16} class="mr-1 text-gray-400 flex-shrink-0" />
										<span class="truncate">{apartment.currentTenantName}</span>
									</div>
									{#if apartment.currentRent}
										<span class="text-sm font-medium text-primary ml-2">
											{formatCurrency(apartment.currentRent)}/Mt.
										</span>
									{/if}
								</div>
							{:else if apartment.status === 'vacant'}
								<div class="flex items-center text-sm text-amber-600">
									<Icon name="warning" size={16} class="mr-1" />
									<span>Leerstehend</span>
								</div>
							{:else if apartment.status === 'reserved'}
								<div class="flex items-center text-sm text-red-600">
									<Icon name="block" size={16} class="mr-1" />
									<span>Gesperrt</span>
								</div>
							{/if}
						</div>
					</div>
				</a>
			{/each}
		</div>

		<!-- Pagination -->
		{#if totalPages > 1}
			<div class="flex items-center justify-between">
				<p class="text-sm text-gray-600">
					Seite {data.page} von {totalPages} ({data.total} Ergebnisse)
				</p>
				<div class="flex gap-2">
					<Button
						variant="secondary"
						size="sm"
						disabled={!hasPrevPage}
						onclick={() => handlePageChange(data.page - 1)}
					>
						<Icon name="chevron_left" size={16} />
						Zurück
					</Button>
					<Button
						variant="secondary"
						size="sm"
						disabled={!hasNextPage}
						onclick={() => handlePageChange(data.page + 1)}
					>
						Weiter
						<Icon name="chevron_right" size={16} />
					</Button>
				</div>
			</div>
		{/if}
	{/if}
</div>
