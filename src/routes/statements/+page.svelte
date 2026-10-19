<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { flushSync, tick } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import type { StatementsListData, StatementWithDetails } from '$lib/types';
	import { balanceLabel, earlyPaidDate, paidDateError } from '$lib/statement';
	import { focusFirstError } from '$lib/ui/focus-error';
	import { addToast } from '$lib/stores';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Dialog from '$lib/ui/Dialog.svelte';
	import { localToday } from '$lib/contract-status';
	import EmptyState from '$lib/ui/EmptyState.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Pagination from '$lib/ui/Pagination.svelte';
	import { formatCurrency } from '$lib/utils/format';
	import PaidDateFields from './PaidDateFields.svelte';
	import StatementList from './StatementList.svelte';
	import StatementSearch from './StatementSearch.svelte';
	import StatusFilter from './StatusFilter.svelte';

	let { data }: { data: StatementsListData } = $props();

	const params = $derived($page.url.searchParams);
	const search = $derived(params.get('search') || '');
	const building = $derived(params.get('building') || '');
	const status = $derived(params.get('status') || '');
	const contract = $derived(params.get('contract') || '');
	const periodStart = $derived(params.get('periodStart') || '');
	const periodEnd = $derived(params.get('periodEnd') || '');
	const filtered = $derived(
		!!(search || building || status || contract || periodStart || periodEnd)
	);

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

	// Payment received on a day asked for (today proposed), after a confirmation; the endpoint stores it
	let paying = $state<StatementWithDetails | null>(null);
	let paidDate = $state(localToday());
	let saving = $state(false);
	let payError = $state('');
	let paidError = $state('');
	let earlyFor = $state('');
	const early = $derived(paying && earlyPaidDate(paidDate, paying.statementDate));
	const asking = $derived(!!early && earlyFor === paidDate);
	function startPaying(chosen: StatementWithDetails) {
		paying = chosen;
		paidDate = localToday();
		paidError = '';
		earlyFor = '';
	}
	// the confirmation asks once more for a day before the Abrechnungsdatum
	const confirm = $derived(
		asking
			? { label: m.statements_save_anyway(), testid: 'statement-list-mark-paid-early-confirm' }
			: { label: m.statements_mark_paid(), testid: 'statement-list-mark-paid-confirm' }
	);
	async function markPaid() {
		// a wrong date is said at the field, which gets the focus; nothing is sent
		paidError = '';
		flushSync(); // cleared first: the same error set again shows again
		paidError = paidDateError(paidDate, paying!.periodEnd) ?? '';
		if (paidError) return focusFirstError(document.querySelector('[role="dialog"]'));
		// #448: a day before the Abrechnungsdatum is saved after the landlord confirmed that very day
		if (early && earlyFor !== paidDate) return (earlyFor = paidDate);
		saving = true;
		payError = '';
		const failed = m.statements_mark_paid_failed();
		try {
			const response = await fetch(`/statements/${paying!.id}/mark-paid`, {
				method: 'POST',
				body: JSON.stringify({ paidDate, periodEnd: paying!.periodEnd })
			});
			if (!response.ok) {
				// the date check says what to do; any other refusal gets the general sentence
				payError = (await response.json().catch(() => ({}))).message ?? failed;
				return;
			}
			addToast('success', m.statements_marked_paid_number({ number: paying!.statementNumber }));
			paying = null;
			await invalidateAll();
			await tick(); // its row's button is gone now: the focus goes to the page title
			document.querySelector<HTMLElement>('h1')?.focus();
		} catch {
			payError = failed;
		} finally {
			saving = false;
		}
	}
</script>

<svelte:head>
	<title>{m.nav_statements()} - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8" data-testid="statements-page">
	<PageHeader title={m.nav_statements()} purpose={m.statements_purpose()}>
		{#snippet action()}
			<Button
				href="/statements/generate"
				variant="primary"
				icon="add"
				testid="statements-generate-button">{m.dashboard_create_statements()}</Button
			>
		{/snippet}
	</PageHeader>

	{#if data.scope}
		<p class="text-ink" data-testid="statements-scope">
			{data.scope}
			<a
				href="/statements"
				class="inline-flex min-h-12 items-center text-accent underline underline-offset-4 hover:text-accent-strong"
				>{m.statements_scope_all()}</a
			>
		</p>
	{/if}

	<StatusFilter
		counts={data.statusCounts}
		active={status}
		href={(value) => linkWith({ status: value })}
	/>
	<StatementSearch
		{search}
		{building}
		{status}
		{contract}
		{periodStart}
		{periodEnd}
		buildings={data.buildings}
	/>

	{#if data.statements.length === 0}
		<div data-testid="statements-empty">
			{#if filtered}
				<EmptyState
					illustration="no-results"
					title={m.statements_none_found()}
					text={m.statements_adjust_filters()}
					actionLabel={m.buildings_reset_filters()}
					actionHref="/statements"
				/>
			{:else}
				<EmptyState
					illustration="statement"
					title={m.statements_empty_title()}
					text={m.statements_empty_text()}
					actionLabel={m.dashboard_create_statements()}
					actionHref="/statements/generate"
				/>
			{/if}
		</div>
	{:else}
		<section class="flex flex-col gap-4" aria-labelledby="statements-count">
			<h2 id="statements-count" tabindex="-1" data-results class="text-xl font-bold text-ink">
				{data.total === 1
					? m.statements_count_one()
					: m.statements_count_many({ count: data.total })}
			</h2>
			<StatementList statements={data.statements} onmarkpaid={startPaying} />
		</section>
		<Pagination url={$page.url} page={data.page} pageSize={data.pageSize} total={data.total} />
	{/if}
</div>

<Dialog
	open={!!paying}
	title={m.statements_mark_paid_title()}
	confirmLabel={confirm.label}
	busy={saving}
	busyLabel={m.ui_saving()}
	confirmTestid={confirm.testid}
	onconfirm={markPaid}
	onclose={() => {
		paying = null;
		payError = '';
	}}
>
	{#if paying}
		<PaidDateFields
			statement={paying}
			summary="{paying.statementNumber}, {paying.tenantName}: {balanceLabel(
				paying.balance
			)} {formatCurrency(Math.abs(paying.balance))}"
			bind:paidDate
			error={paidError}
			early={asking ? early : null}
		/>
		{#if payError}
			<Alert tone="critical" title={m.buildings_not_saved()}><p>{payError}</p></Alert>
		{/if}
	{/if}
</Dialog>
