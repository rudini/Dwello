<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { BuildingsListData } from '$lib/types';
	import { listSearchUrl } from '$lib/list-url';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';
	import SearchField from '$lib/components/SearchField.svelte';
	import FilterActions from '$lib/components/FilterActions.svelte';
	import ListPagination from '$lib/components/ListPagination.svelte';

	function getGoogleMapsDirectionsUrl(address: string, city: string, postalCode: string): string {
		const destination = encodeURIComponent(`${address}, ${postalCode} ${city}, Switzerland`);
		return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
	}

	let { data }: { data: BuildingsListData } = $props();

	let searchTerm = $state($page.url.searchParams.get('search') || '');
	let cityFilter = $state($page.url.searchParams.get('city') || '');

	const filtered = $derived(!!(searchTerm || cityFilter));

	function handleSearch(event: SubmitEvent) {
		event.preventDefault();
		goto(listSearchUrl('/buildings', { search: searchTerm, city: cityFilter }));
	}

	function clearFilters() {
		searchTerm = '';
		cityFilter = '';
		goto('/buildings');
	}

	function getOccupancyColor(occupied: number, total: number): string {
		const percentage = total > 0 ? (occupied / total) * 100 : 0;
		if (percentage === 100) return 'bg-green-500';
		if (percentage >= 80) return 'bg-green-400';
		if (percentage >= 50) return 'bg-yellow-500';
		return 'bg-red-500';
	}
</script>

<svelte:head>
	<title>Gebäude - Dwello</title>
</svelte:head>

<div class="space-y-6" data-testid="buildings-page">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Gebäude</h1>
			<p class="text-gray-500 mt-1">{data.total} Gebäude insgesamt</p>
		</div>
		<Button href="/buildings/new" variant="primary" testid="building-new-button">
			<Icon name="add" size={20} />
			Neues Gebäude
		</Button>
	</div>

	<!-- Search and Filters -->
	<Card>
		<form onsubmit={handleSearch} class="space-y-4">
			<div class="flex flex-col sm:flex-row gap-4">
				<SearchField
					bind:value={searchTerm}
					placeholder="Name, Adresse oder Stadt..."
					testid="building-search-input"
				/>
				<div class="w-full sm:w-48">
					<label for="city" class="block text-sm font-medium text-gray-700 mb-1">Stadt</label>
					<input
						id="city"
						name="city"
						data-testid="building-city-filter"
						type="text"
						bind:value={cityFilter}
						placeholder="z.B. Zürich"
						class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>
			</div>
			<FilterActions {filtered} onclear={clearFilters} testid="building-search-submit" />
		</form>
	</Card>

	<!-- Buildings List -->
	{#if data.buildings.length === 0}
		<Card>
			<div class="text-center py-12" data-testid="buildings-empty">
				<Icon name="apartment" size={48} class="mx-auto text-gray-300 mb-4" />
				<h3 class="text-lg font-medium text-gray-900 mb-2">Keine Gebäude gefunden</h3>
				<p class="text-gray-500 mb-6">
					{#if filtered}
						Versuchen Sie es mit anderen Suchbegriffen.
					{:else}
						Erstellen Sie Ihr erstes Gebäude, um loszulegen.
					{/if}
				</p>
				{#if !filtered}
					<Button href="/buildings/new" variant="primary">
						<Icon name="add" size={20} />
						Erstes Gebäude erstellen
					</Button>
				{/if}
			</div>
		</Card>
	{:else}
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.buildings as building}
				<div
					role="button"
					tabindex="0"
					data-testid="building-card-{building.id}"
					onclick={() => goto(`/buildings/${building.id}`)}
					onkeydown={(e) => e.key === 'Enter' && goto(`/buildings/${building.id}`)}
					class="block bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer"
				>
					<div class="p-5">
						<!-- Building Name & Address -->
						<div class="flex items-start justify-between mb-3">
							<div class="flex-1 min-w-0">
								<h3 class="font-semibold text-gray-900 truncate">
									{building.name || building.address}
								</h3>
								{#if building.name}
									<p class="text-sm text-gray-500 truncate">{building.address}</p>
								{/if}
							</div>
							<Icon name="chevron_right" size={20} class="text-gray-400 flex-shrink-0 ml-2" />
						</div>

						<!-- Location -->
						<div class="flex items-center text-sm text-gray-600 mb-4">
							<Icon name="location_on" size={16} class="mr-1 text-gray-400" />
							<span>{building.postalCode} {building.city}</span>
							{#if building.canton}
								<span class="ml-1 text-gray-400">({building.canton})</span>
							{/if}
							<a
								href={getGoogleMapsDirectionsUrl(
									building.address,
									building.city,
									building.postalCode
								)}
								data-testid="building-route-link"
								target="_blank"
								rel="noopener noreferrer"
								class="ml-auto text-gray-400 hover:text-primary transition-colors"
								title="Route in Google Maps öffnen"
								onclick={(e) => e.stopPropagation()}
							>
								<Icon name="directions" size={18} />
							</a>
						</div>

						<!-- Stats -->
						<div class="flex items-center justify-between pt-3 border-t border-gray-100">
							<div class="flex items-center gap-4">
								<!-- Apartment Count -->
								<div class="flex items-center text-sm">
									<Icon name="door_front" size={16} class="mr-1 text-gray-400" />
									<span class="font-medium">{building.apartmentCount}</span>
									<span class="text-gray-500 ml-1">Wohnungen</span>
								</div>
							</div>

							<!-- Occupancy Indicator -->
							<div class="flex items-center gap-2">
								<div
									class="w-2 h-2 rounded-full {getOccupancyColor(
										building.occupiedCount,
										building.apartmentCount
									)}"
								></div>
								<span class="text-sm text-gray-600">
									{building.occupiedCount}/{building.apartmentCount}
								</span>
							</div>
						</div>

						<!-- Building Type & Year -->
						{#if building.buildingType || building.yearBuilt}
							<div class="flex items-center gap-3 mt-3 text-xs text-gray-500">
								{#if building.buildingType}
									<span class="bg-gray-100 px-2 py-1 rounded">{building.buildingType}</span>
								{/if}
								{#if building.yearBuilt}
									<span>Baujahr {building.yearBuilt}</span>
								{/if}
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>

		<ListPagination {data} />
	{/if}
</div>
