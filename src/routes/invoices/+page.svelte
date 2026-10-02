<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { InvoicesListData } from '$lib/types';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';
	import Badge from '$lib/components/Badge.svelte';

	let { data }: { data: InvoicesListData } = $props();

	let searchTerm = $state($page.url.searchParams.get('search') || '');
	let buildingFilter = $state($page.url.searchParams.get('buildingId') || '');
	let categoryFilter = $state($page.url.searchParams.get('categoryId') || '');
	let validityFilter = $state($page.url.searchParams.get('validity') || '');

	const totalPages = $derived.by(() => Math.ceil(data.total / data.pageSize));
	const hasNextPage = $derived.by(() => data.page < totalPages);
	const hasPrevPage = $derived.by(() => data.page > 1);

	function handleSearch() {
		const params = new URLSearchParams();
		if (searchTerm) params.set('search', searchTerm);
		if (buildingFilter) params.set('buildingId', buildingFilter);
		if (categoryFilter) params.set('categoryId', categoryFilter);
		if (validityFilter) params.set('validity', validityFilter);
		params.set('page', '1');
		goto(`/invoices?${params.toString()}`);
	}

	function handlePageChange(newPage: number) {
		const params = new URLSearchParams($page.url.searchParams);
		params.set('page', newPage.toString());
		goto(`/invoices?${params.toString()}`);
	}

	function clearFilters() {
		searchTerm = '';
		buildingFilter = '';
		categoryFilter = '';
		validityFilter = '';
		goto('/invoices');
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('de-CH', {
			style: 'currency',
			currency: 'CHF'
		}).format(amount);
	}

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('de-CH');
	}

</script>

<svelte:head>
	<title>Rechnungen - Dwello</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Rechnungen</h1>
			<p class="text-gray-500 mt-1">{data.total} Rechnungen insgesamt</p>
		</div>
		<Button href="/invoices/new" variant="primary" testid="invoice-new-button">
			<Icon name="add" size={20} />
			Neue Rechnung
		</Button>
	</div>

	<!-- Search and Filters -->
	<Card>
		<form onsubmit={(e) => { e.preventDefault(); handleSearch(); }} class="space-y-4">
			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<!-- Search -->
				<div class="sm:col-span-2 lg:col-span-1">
					<label for="search" class="block text-sm font-medium text-gray-700 mb-1">Suche</label>
					<div class="relative">
						<Icon
							name="search"
							size={20}
							class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
						/>
						<input
							id="search"
							data-testid="invoice-search-input"
							type="text"
							bind:value={searchTerm}
							placeholder="Lieferant, Beschreibung..."
							class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
				</div>

				<!-- Building Filter -->
				<div>
					<label for="building" class="block text-sm font-medium text-gray-700 mb-1">Gebäude</label>
					<select
						id="building"
						data-testid="invoice-building-filter"
						bind:value={buildingFilter}
						class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="">Alle Gebäude</option>
						{#each data.buildings as building}
							<option value={building.id}>{building.name || building.address}</option>
						{/each}
					</select>
				</div>

				<!-- Category Filter -->
				<div>
					<label for="category" class="block text-sm font-medium text-gray-700 mb-1">Kategorie</label>
					<select
						id="category"
						bind:value={categoryFilter}
						class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="">Alle Kategorien</option>
						{#each data.categories as category}
							<option value={category.id}>{category.name}</option>
						{/each}
					</select>
				</div>

				<!-- Validity Filter -->
				<div>
					<label for="validity" class="block text-sm font-medium text-gray-700 mb-1">Umlagefähigkeit</label>
					<select
						id="validity"
						data-testid="invoice-validity-filter"
						bind:value={validityFilter}
						class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="">Alle</option>
						<option value="valid">Umlagefähig</option>
						<option value="invalid">Nicht umlagefähig</option>
					</select>
				</div>
			</div>
			<div class="flex gap-2">
				<Button type="submit" variant="primary" size="sm" testid="invoice-search-submit">
					<Icon name="search" size={16} />
					Suchen
				</Button>
				{#if searchTerm || buildingFilter || categoryFilter || validityFilter}
					<Button type="button" variant="secondary" size="sm" onclick={clearFilters}>
						<Icon name="close" size={16} />
						Filter löschen
					</Button>
				{/if}
			</div>
		</form>
	</Card>

	<!-- Invoices List -->
	{#if data.invoices.length === 0}
		<Card>
			<div class="text-center py-12">
				<Icon name="receipt_long" size={48} class="mx-auto text-gray-300 mb-4" />
				<h3 class="text-lg font-medium text-gray-900 mb-2">Keine Rechnungen gefunden</h3>
				<p class="text-gray-500 mb-6">
					{#if searchTerm || buildingFilter || categoryFilter || validityFilter}
						Versuchen Sie es mit anderen Filtern.
					{:else}
						Erstellen Sie Ihre erste Rechnung, um loszulegen.
					{/if}
				</p>
				{#if !searchTerm && !buildingFilter && !categoryFilter && !validityFilter}
					<Button href="/invoices/new" variant="primary">
						<Icon name="add" size={20} />
						Erste Rechnung erstellen
					</Button>
				{/if}
			</div>
		</Card>
	{:else}
		<Card padding={false}>
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead class="bg-gray-50 border-b border-gray-200">
						<tr>
							<th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
								Datum
							</th>
							<th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
								Lieferant / Beschreibung
							</th>
							<th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
								Kategorie
							</th>
							<th class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
								Betrag
							</th>
							<th class="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
								Umlagefähig
							</th>
							<th class="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
								Status
							</th>
							<th class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
								Aktionen
							</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200">
						{#each data.invoices as invoice}
							<tr class="hover:bg-gray-50 transition-colors" data-testid="invoice-row-{invoice.id}">
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									{formatDate(invoice.invoiceDate)}
								</td>
								<td class="px-6 py-4">
									<div class="text-sm font-medium text-gray-900">{invoice.billingEntity}</div>
									<div class="text-sm text-gray-500 truncate max-w-xs">{invoice.description}</div>
									<div class="text-xs text-gray-400 mt-1">{invoice.buildingName}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									{#if invoice.category}
										<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800" data-testid="invoice-category">
											{invoice.category.name}
										</span>
									{:else}
										<span class="text-sm text-gray-400">-</span>
									{/if}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right" data-testid="invoice-amount">
									{formatCurrency(invoice.amount)}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-center">
									{#if invoice.isValidUtilityCost}
										<Badge variant="success">Umlagefähig</Badge>
									{:else}
										<Badge variant="danger">Nicht umlagefähig</Badge>
									{/if}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-center" data-testid="invoice-status">
									{#if invoice.categorizationStatus === 'auto-categorized'}
										<Badge variant="success">Auto</Badge>
									{:else if invoice.categorizationStatus === 'manual'}
										<Badge variant="info">Manuell</Badge>
									{:else}
										<Badge variant="warning">Ausstehend</Badge>
									{/if}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-right text-sm">
									<div class="flex items-center justify-end gap-2">
										<a
											href="/invoices/{invoice.id}"
											class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
											title="Ansehen"
											data-testid="invoice-view-button"
										>
											<Icon name="visibility" size={18} />
										</a>
										<a
											href="/invoices/{invoice.id}/edit"
											class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
											title="Bearbeiten"
											data-testid="invoice-edit-button"
										>
											<Icon name="edit" size={18} />
										</a>
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
