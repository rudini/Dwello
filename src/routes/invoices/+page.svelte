<script lang="ts">
	import { page } from '$app/stores';
	import type { InvoicesListData } from '$lib/types';
	import Button from '$lib/ui/Button.svelte';
	import EmptyState from '$lib/ui/EmptyState.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Pagination from '$lib/ui/Pagination.svelte';
	import InvoiceRow from './InvoiceRow.svelte';
	import InvoiceSearch from './InvoiceSearch.svelte';

	let { data }: { data: InvoicesListData } = $props();

	// Only the year is chosen: an empty list means nothing is recorded yet, not a filter mistake
	const onlyYear = $derived(
		['search', 'building', 'categoryId', 'validity'].some((key) => $page.url.searchParams.get(key))
			? ''
			: ($page.url.searchParams.get('year') ?? '')
	);
	const filtered = $derived(
		['search', 'building', 'categoryId', 'validity', 'year'].some((key) =>
			$page.url.searchParams.get(key)
		)
	);
</script>

<svelte:head>
	<title>Rechnungen - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8">
	<PageHeader
		title="Rechnungen"
		purpose="Die Rechnungen Ihrer Gebäude. Umlagefähige Rechnungen fliessen in die Nebenkostenabrechnung ein."
	>
		{#snippet action()}
			<Button href="/invoices/new" variant="primary" icon="add" testid="invoice-new-button"
				>Rechnung erfassen</Button
			>
		{/snippet}
	</PageHeader>

	<InvoiceSearch
		params={$page.url.searchParams}
		buildings={data.buildings}
		categories={data.categories}
		years={data.years}
	/>

	{#if data.invoices.length === 0}
		<div data-testid="invoices-empty">
			{#if onlyYear}
				<EmptyState
					illustration="receipts"
					title="Für {onlyYear} sind noch keine Rechnungen erfasst"
					text="Erfassen Sie die Rechnungen dieses Jahres, damit sie in die Nebenkostenabrechnung einfliessen."
					actionLabel="Rechnung erfassen"
					actionHref="/invoices/new"
				/>
			{:else if filtered}
				<EmptyState
					illustration="no-results"
					title="Keine Rechnungen gefunden"
					text="Versuchen Sie es mit anderen Filtern."
				/>
			{:else}
				<EmptyState
					illustration="receipts"
					title="Noch keine Rechnungen"
					text="Erfassen Sie Ihre erste Rechnung, damit sie in die Nebenkostenabrechnung einfliesst."
					actionLabel="Rechnung erfassen"
					actionHref="/invoices/new"
				/>
			{/if}
		</div>
	{:else}
		<section class="flex flex-col gap-4" aria-labelledby="invoices-count">
			<h2 id="invoices-count" tabindex="-1" data-results class="text-xl font-bold text-ink">
				{data.total === 1 ? '1 Rechnung' : `${data.total} Rechnungen`}
			</h2>
			<ul class="divide-y divide-line rounded-panel border border-line bg-surface">
				{#each data.invoices as invoice (invoice.id)}
					<InvoiceRow {invoice} />
				{/each}
			</ul>
		</section>
		<Pagination url={$page.url} page={data.page} pageSize={data.pageSize} total={data.total} />
	{/if}
</div>
