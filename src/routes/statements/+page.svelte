<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import type { StatementsListData, StatementWithDetails } from '$lib/types';
	import { balanceLabel } from '$lib/statement';
	import Button from '$lib/ui/Button.svelte';
	import Dialog from '$lib/ui/Dialog.svelte';
	import EmptyState from '$lib/ui/EmptyState.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Pagination from '$lib/ui/Pagination.svelte';
	import { formatCurrency } from '$lib/utils/format';
	import StatementRow from './StatementRow.svelte';
	import StatementSearch from './StatementSearch.svelte';
	import StatusFilter from './StatusFilter.svelte';

	let { data }: { data: StatementsListData } = $props();

	const params = $derived($page.url.searchParams);
	const search = $derived(params.get('search') || '');
	const building = $derived(params.get('building') || '');
	const status = $derived(params.get('status') || '');
	const filtered = $derived(!!(search || building || status));

	// Filters and paging live in the URL so the server filters across all statements
	function linkWith(changes: Record<string, string>): string {
		const next = new URLSearchParams(params);
		for (const [key, value] of Object.entries(changes)) {
			if (value) next.set(key, value);
			else next.delete(key);
		}
		if (!('page' in changes)) next.delete('page');
		return `/statements?${next}`;
	}

	// Payment received today, after a confirmation; the endpoint stores it in the database
	let paying = $state<StatementWithDetails | null>(null);
	let saving = $state(false);
	async function markPaid() {
		saving = true;
		await fetch(`/statements/${paying!.id}/mark-paid`, { method: 'POST' });
		await invalidateAll();
		saving = false;
		paying = null;
	}
</script>

<svelte:head>
	<title>Nebenkostenabrechnungen - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8" data-testid="statements-page">
	<PageHeader
		title="Nebenkostenabrechnungen"
		purpose="Prüfen, versenden und verfolgen Sie die Abrechnungen Ihrer Mieter."
	>
		{#snippet action()}
			<Button
				href="/statements/generate"
				variant="primary"
				icon="add"
				testid="statements-generate-button">Abrechnungen erstellen</Button
			>
		{/snippet}
	</PageHeader>

	<StatusFilter
		counts={data.statusCounts}
		active={status}
		href={(value) => linkWith({ status: value })}
	/>
	<StatementSearch {search} {building} {status} buildings={data.buildings} />

	{#if data.statements.length === 0}
		<div data-testid="statements-empty">
			{#if filtered}
				<EmptyState
					illustration="no-results"
					title="Keine Abrechnungen gefunden"
					text="Versuchen Sie, Ihre Filter anzupassen."
					actionLabel="Filter zurücksetzen"
					actionHref="/statements"
				/>
			{:else}
				<EmptyState
					illustration="statement"
					title="Noch keine Abrechnungen"
					text="Erstellen Sie Ihre erste Nebenkostenabrechnung."
					actionLabel="Abrechnungen erstellen"
					actionHref="/statements/generate"
				/>
			{/if}
		</div>
	{:else}
		<section class="flex flex-col gap-4" aria-labelledby="statements-count">
			<h2 id="statements-count" class="text-xl font-bold text-ink">
				{data.total === 1 ? '1 Abrechnung' : `${data.total} Abrechnungen`}
			</h2>
			<ul class="divide-y divide-line rounded-panel border border-line bg-surface">
				{#each data.statements as statement (statement.id)}
					<StatementRow {statement} onmarkpaid={(chosen) => (paying = chosen)} />
				{/each}
			</ul>
		</section>
		<Pagination url={$page.url} page={data.page} pageSize={data.pageSize} total={data.total} />
	{/if}
</div>

<Dialog
	open={!!paying}
	title="Abrechnung als bezahlt markieren"
	confirmLabel="Als bezahlt markieren"
	busy={saving}
	busyLabel="Wird gespeichert …"
	confirmTestid="statement-list-mark-paid-confirm"
	onconfirm={markPaid}
	onclose={() => (paying = null)}
>
	{#if paying}
		<p>Das heutige Datum wird als Zahlungsdatum eingetragen.</p>
		<p class="rounded-panel bg-sunken p-4 font-semibold text-ink">
			{paying.statementNumber}, {paying.tenantName}: {balanceLabel(paying.balance)}
			{formatCurrency(Math.abs(paying.balance))}
		</p>
	{/if}
</Dialog>
