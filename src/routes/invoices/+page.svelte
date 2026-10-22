<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { page } from '$app/stores';
	import { invalidateAll } from '$app/navigation';
	import type { InvoicesListData } from '$lib/types';
	import Button from '$lib/ui/Button.svelte';
	import EmptyState from '$lib/ui/EmptyState.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import ResultList from '$lib/ui/ResultList.svelte';
	import InvoiceItems from './InvoiceItems.svelte';
	import { formatDate } from '$lib/utils/format';
	import InvoiceSearch from './InvoiceSearch.svelte';
	import UploadResult from './UploadResult.svelte';
	import InvoiceUploadDialog, { type Created } from './InvoiceUploadDialog.svelte';

	let { data }: { data: InvoicesListData } = $props();

	// open at once when the Übersicht's «Rechnungen hochladen» led here
	let uploading = $state($page.url.searchParams.has('upload'));
	const openUpload = (event: MouseEvent) => {
		event.preventDefault();
		uploading = true;
	};
	let created = $state<Created[]>([]);

	// Only the year is chosen: an empty list means nothing is recorded yet, not a filter mistake
	const onlyYear = $derived(
		['search', 'building', 'categoryId', 'validity', 'periodStart'].some((key) =>
			$page.url.searchParams.get(key)
		)
			? ''
			: ($page.url.searchParams.get('year') ?? '')
	);
	const filtered = $derived(
		['search', 'building', 'categoryId', 'validity', 'year', 'periodStart'].some((key) =>
			$page.url.searchParams.get(key)
		)
	);
	// #454: the filter «Abrechnungsperiode», named with its building and rule
	const period = $derived.by(() => {
		const [start, end] = ['periodStart', 'periodEnd'].map((key) => $page.url.searchParams.get(key) ?? '');
		if (![start, end].every((day) => /^\d{4}-\d{2}-\d{2}$/.test(day))) return null; // as the loader sends them
		const building = data.buildings.find((b) => b.id === $page.url.searchParams.get('building'));
		const days = { start: formatDate(start), end: formatDate(end) };
		return building
			? m.invoices_period_filter({ building: building.name, ...days })
			: m.invoices_period_filter_all(days);
	});
</script>

<svelte:head>
	<title>{m.nav_invoices()} - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8">
	<PageHeader title={m.nav_invoices()} purpose={m.invoices_purpose()}>
		{#snippet action()}
			<div class="flex flex-wrap gap-4">
				<!-- a link to the address that opens the dialog: a click before the page's scripts run works too (#268) -->
				<Button variant="primary" icon="document" href="?upload" onclick={openUpload} testid="invoice-upload-button"
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
		latestKeys={data.latestKeys}
		kiOff={data.kiOff}
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

	{#if period}<p class="text-ink" data-testid="invoice-period-filter">{period}</p>{/if}

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
		<ResultList
			id="invoices-count"
			heading={data.total === 1 ? m.invoices_count_one() : m.invoices_count({ count: data.total })}
			listClass="divide-y divide-line rounded-panel border border-line bg-surface"
			url={$page.url}
			page={data.page}
			pageSize={data.pageSize}
			total={data.total}
		>
			<InvoiceItems invoices={data.invoices} grouped={!!period} />
		</ResultList>
	{/if}
</div>
