<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { page } from '$app/stores';
	import { invalidateAll } from '$app/navigation';
	import type { InvoicesListData } from '$lib/types';
	import Button from '$lib/ui/Button.svelte';
	import EmptyState from '$lib/ui/EmptyState.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Pagination from '$lib/ui/Pagination.svelte';
	import InvoiceRow from './InvoiceRow.svelte';
	import InvoiceSearch from './InvoiceSearch.svelte';
	import UploadResult from './UploadResult.svelte';
	import InvoiceUploadDialog, { type Created } from './InvoiceUploadDialog.svelte';

	let { data }: { data: InvoicesListData } = $props();

	let uploading = $state(false);
	let created = $state<Created[]>([]);

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
	<title>{m.nav_invoices()} - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8">
	<PageHeader title={m.nav_invoices()} purpose={m.invoices_purpose()}>
		{#snippet action()}
			<div class="flex flex-wrap gap-4">
				<Button variant="primary" icon="document" onclick={() => (uploading = true)} testid="invoice-upload-button"
					>{m.invoices_upload_open()}</Button
				>
				<Button href="/invoices/new" icon="add" testid="invoice-new-button">{m.dashboard_add_invoice()}</Button>
			</div>
		{/snippet}
	</PageHeader>

	{#if created.length}<UploadResult {created} />{/if}

	<InvoiceUploadDialog
		bind:open={uploading}
		buildings={data.buildings}
		categories={data.categories}
		distributionKeys={data.distributionKeys}
		defaultDistributionKeyId={data.defaultDistributionKeyId}
		oncreated={(list) => {
			created = list;
			invalidateAll();
		}}
	/>

	<!-- new for each address: after a link, back or forward the form shows the filters of the list shown (#159) -->
	{#key $page.url.search}
		<InvoiceSearch
			params={$page.url.searchParams}
			buildings={data.buildings}
			categories={data.categories}
			years={data.years}
		/>
	{/key}

	{#if data.invoices.length === 0}
		<div data-testid="invoices-empty">
			{#if onlyYear}
				<EmptyState
					illustration="receipts"
					title={m.invoices_empty_year_title({ year: onlyYear })}
					text={m.invoices_empty_year_text()}
					actionLabel={m.dashboard_add_invoice()}
					actionHref="/invoices/new"
				/>
			{:else if filtered}
				<EmptyState
					illustration="no-results"
					title={m.invoices_none_found()}
					text={m.invoices_none_found_text()}
				/>
			{:else}
				<EmptyState
					illustration="receipts"
					title={m.invoices_empty_title()}
					text={m.invoices_empty_text()}
					actionLabel={m.dashboard_add_invoice()}
					actionHref="/invoices/new"
				/>
			{/if}
		</div>
	{:else}
		<section class="flex flex-col gap-4" aria-labelledby="invoices-count">
			<h2 id="invoices-count" tabindex="-1" data-results class="text-xl font-bold text-ink">
				{data.total === 1 ? m.invoices_count_one() : m.invoices_count({ count: data.total })}
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
