<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { ContractsListData } from '$lib/types';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';

	let { data }: { data: ContractsListData } = $props();

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
		goto(`/contracts?${params.toString()}`);
	}

	function handlePageChange(newPage: number) {
		const params = new URLSearchParams($page.url.searchParams);
		params.set('page', newPage.toString());
		goto(`/contracts?${params.toString()}`);
	}

	function clearFilters() {
		searchTerm = '';
		buildingFilter = '';
		statusFilter = '';
		goto('/contracts');
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('de-CH', {
			style: 'currency',
			currency: 'CHF',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(amount);
	}

	function formatDate(dateStr: string | Date): string {
		const date = new Date(dateStr);
		return date.toLocaleDateString('de-CH', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		});
	}

	function getInitials(firstName: string, lastName: string): string {
		return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
	}
</script>

<svelte:head>
	<title>Mietverträge - Dwello</title>
</svelte:head>

<div class="space-y-6" data-testid="contracts-page">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Mietverträge</h1>
			<p class="text-gray-500 mt-1">{data.total} Verträge insgesamt</p>
		</div>
		<Button href="/contracts/new" variant="primary">
			<Icon name="add" size={20} />
			Neuer Vertrag
		</Button>
	</div>

	<!-- Search and Filters -->
	<Card>
		<form onsubmit={(e) => { e.preventDefault(); handleSearch(); }} class="space-y-4">
			<div class="flex flex-col sm:flex-row gap-4">
				<div class="flex-1">
					<label for="search" class="block text-sm font-medium text-gray-700 mb-1">Suche</label>
					<div class="relative">
						<Icon
							name="search"
							size={20}
							class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
						/>
						<input
							id="search"
							type="text"
							bind:value={searchTerm}
							placeholder="Mieter, Wohnung oder Gebäude..."
							class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
						/>
					</div>
				</div>
				<div class="w-full sm:w-48">
					<label for="building" class="block text-sm font-medium text-gray-700 mb-1">Gebäude</label>
					<select
						id="building"
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
						bind:value={statusFilter}
						class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
					>
						<option value="">Alle Verträge</option>
						<option value="active">Aktive Verträge</option>
						<option value="ended">Beendete Verträge</option>
					</select>
				</div>
			</div>
			<div class="flex gap-2">
				<Button type="submit" variant="primary" size="sm">
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

	<!-- Contracts List -->
	{#if data.contracts.length === 0}
		<Card>
			<div class="text-center py-12">
				<Icon name="description" size={48} class="mx-auto text-gray-300 mb-4" />
				<h3 class="text-lg font-medium text-gray-900 mb-2">Keine Verträge gefunden</h3>
				<p class="text-gray-500 mb-6">
					{#if searchTerm || buildingFilter || statusFilter}
						Versuchen Sie es mit anderen Suchbegriffen oder Filtern.
					{:else}
						Erstellen Sie Ihren ersten Mietvertrag, um loszulegen.
					{/if}
				</p>
				{#if !searchTerm && !buildingFilter && !statusFilter}
					<Button href="/contracts/new" variant="primary">
						<Icon name="add" size={20} />
						Ersten Vertrag erstellen
					</Button>
				{/if}
			</div>
		</Card>
	{:else}
		<Card>
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead>
						<tr class="border-b border-gray-200">
							<th
								class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4"
							>
								Mieter
							</th>
							<th
								class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4"
							>
								Wohnung
							</th>
							<th
								class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4"
							>
								Zeitraum
							</th>
							<th
								class="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4"
							>
								Mietzins
							</th>
							<th
								class="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4"
							>
								Status
							</th>
							<th class="py-3 px-4"></th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-100">
						{#each data.contracts as contract}
							<tr class="hover:bg-gray-50 transition-colors">
								<!-- Tenant -->
								<td class="py-4 px-4">
									<div class="flex items-center gap-3">
										<div
											class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0"
										>
											{getInitials(contract.tenant_first_name, contract.tenant_last_name)}
										</div>
										<div>
											<p class="font-medium text-gray-900">{contract.tenant_name}</p>
										</div>
									</div>
								</td>
								<!-- Apartment -->
								<td class="py-4 px-4">
									<p class="font-medium text-gray-900">Wohnung {contract.apartment_unit}</p>
									<p class="text-sm text-gray-500">{contract.building_name}</p>
								</td>
								<!-- Period -->
								<td class="py-4 px-4 text-gray-600">
									{formatDate(contract.start_date)}
									{#if contract.end_date}
										- {formatDate(contract.end_date)}
									{:else}
										- heute
									{/if}
								</td>
								<!-- Rent -->
								<td class="py-4 px-4 text-right">
									<span class="font-semibold text-gray-900">
										{formatCurrency(contract.total_rent)}
									</span>
									<span class="text-sm text-gray-500">/Mt.</span>
								</td>
								<!-- Status -->
								<td class="py-4 px-4 text-center">
									<StatusBadge
										status={contract.status === 'Aktiv' ? 'AKTIV' : 'Beendet'}
										variant={contract.status === 'Aktiv' ? 'success' : 'gray'}
									/>
								</td>
								<!-- Actions -->
								<td class="py-4 px-4 text-right">
									<div class="flex items-center justify-end gap-2">
										<Button href="/contracts/{contract.id}" variant="secondary" size="sm">
											<Icon name="visibility" size={16} />
										</Button>
										<Button href="/contracts/{contract.id}/edit" variant="secondary" size="sm">
											<Icon name="edit" size={16} />
										</Button>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</Card>

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
