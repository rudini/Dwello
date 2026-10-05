<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { InvoicesListData } from '$lib/types';
	import { listSearchUrl } from '$lib/list-url';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';
	import SearchField from '$lib/components/SearchField.svelte';
	import FilterSelect from '$lib/components/FilterSelect.svelte';
	import FilterActions from '$lib/components/FilterActions.svelte';
	import ListPagination from '$lib/components/ListPagination.svelte';
	import InvoiceRow from './InvoiceRow.svelte';

	let { data }: { data: InvoicesListData } = $props();

	let searchTerm = $state($page.url.searchParams.get('search') || '');
	let buildingFilter = $state($page.url.searchParams.get('buildingId') || '');
	let categoryFilter = $state($page.url.searchParams.get('categoryId') || '');
	let validityFilter = $state($page.url.searchParams.get('validity') || '');

	const buildingOptions = $derived(
		data.buildings.map((b) => ({ value: b.id, label: b.name || b.address }))
	);
	const categoryOptions = $derived(data.categories.map((c) => ({ value: c.id, label: c.name })));
	const validityOptions = [
		{ value: 'valid', label: 'Umlagefähig' },
		{ value: 'invalid', label: 'Nicht umlagefähig' }
	];

	const filtered = $derived(!!(searchTerm || buildingFilter || categoryFilter || validityFilter));

	function handleSearch(event: SubmitEvent) {
		event.preventDefault();
		goto(
			listSearchUrl('/invoices', {
				search: searchTerm,
				buildingId: buildingFilter,
				categoryId: categoryFilter,
				validity: validityFilter
			})
		);
	}

	function clearFilters() {
		searchTerm = '';
		buildingFilter = '';
		categoryFilter = '';
		validityFilter = '';
		goto('/invoices');
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
		<form onsubmit={handleSearch} class="flex flex-col lg:flex-row lg:items-center gap-4">
			<div class="flex-1 flex flex-col sm:flex-row gap-4">
				<SearchField
					bind:value={searchTerm}
					placeholder="Lieferant, Beschreibung..."
					testid="invoice-search-input"
				/>
				<FilterSelect
					id="building"
					label="Gebäude"
					allLabel="Alle Gebäude"
					options={buildingOptions}
					value={buildingFilter}
					testid="invoice-building-filter"
					onchange={(value) => (buildingFilter = value)}
				/>
				<FilterSelect
					id="category"
					label="Kategorie"
					allLabel="Alle Kategorien"
					options={categoryOptions}
					value={categoryFilter}
					testid="invoice-category-filter"
					onchange={(value) => (categoryFilter = value)}
				/>
				<FilterSelect
					id="validity"
					label="Umlagefähigkeit"
					allLabel="Alle"
					options={validityOptions}
					value={validityFilter}
					testid="invoice-validity-filter"
					onchange={(value) => (validityFilter = value)}
				/>
			</div>
			<FilterActions {filtered} onclear={clearFilters} testid="invoice-search-submit" />
		</form>
	</Card>

	<!-- Invoices List -->
	{#if data.invoices.length === 0}
		<Card>
			<div class="text-center py-12" data-testid="invoices-empty">
				<Icon name="receipt_long" size={48} class="mx-auto text-gray-300 mb-4" />
				<h3 class="text-lg font-medium text-gray-900 mb-2">Keine Rechnungen gefunden</h3>
				{#if filtered}
					<p class="text-gray-500 mb-6">Versuchen Sie es mit anderen Filtern.</p>
				{:else}
					<p class="text-gray-500 mb-6">Erstellen Sie Ihre erste Rechnung, um loszulegen.</p>
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
							<th
								class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
							>
								Datum
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
							>
								Lieferant / Beschreibung
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
							>
								Kategorie
							</th>
							<th
								class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
							>
								Betrag
							</th>
							<th
								class="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"
							>
								Umlagefähig
							</th>
							<th
								class="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"
							>
								Status
							</th>
							<th
								class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
							>
								Aktionen
							</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200">
						{#each data.invoices as invoice}
							<InvoiceRow {invoice} />
						{/each}
					</tbody>
				</table>
			</div>
		</Card>

		<ListPagination {data} />
	{/if}
</div>
