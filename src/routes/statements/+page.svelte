<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { flushSync, tick } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import type { StatementsListData, StatementStatus, StatementWithDetails } from '$lib/types';
	import {
		balanceLabel,
		earlyPaidDate,
		isPartPayment,
		openAmount,
		paidDateError,
		signedPaid,
		statusLabels
	} from '$lib/statement';
	import { focusFirstError } from '$lib/ui/focus-error';
	import { addToast } from '$lib/stores';
	import { getXsrfTokenFromCookie } from '$lib/api';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Dialog from '$lib/ui/Dialog.svelte';
	import { localToday } from '$lib/contract-status';
	import EmptyState from '$lib/ui/EmptyState.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import ResultList from '$lib/ui/ResultList.svelte';
	import { formatCurrency } from '$lib/utils/format';
	import PaidDateFields from './PaidDateFields.svelte';
	import StatementRow from './StatementRow.svelte';
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
	// #1186: a status the list knows is named under the tiles, in the list's heading and in its empty result
	const chosen = $derived(
		Object.hasOwn(statusLabels, status) ? statusLabels[status as StatementStatus] : ''
	);
	const shown = $derived(
		data.total === 0
			? m.statements_status_shown_none({ status: chosen })
			: data.total === 1
				? m.statements_status_shown_one({ status: chosen })
				: m.statements_status_shown_many({ count: data.total, status: chosen })
	);
	const noneText = $derived(
		chosen ? m.statements_none_with_status({ status: chosen }) : m.statements_adjust_filters()
	);
	const counts = $derived(
		chosen
			? {
					one: () => m.statements_count_status_one({ status: chosen }),
					many: (inputs: { count: number }) =>
						m.statements_count_status_many({ ...inputs, status: chosen }),
					pageOne: (inputs: { from: number; total: number; page: number; pages: number }) =>
						m.statements_count_status_page_one({ ...inputs, status: chosen }),
					pageMany: (inputs: {
						from: number;
						to: number;
						total: number;
						page: number;
						pages: number;
					}) => m.statements_count_status_page_many({ ...inputs, status: chosen })
				}
			: {
					one: m.statements_count_one,
					many: m.statements_count_many,
					pageOne: m.statements_count_page_one,
					pageMany: m.statements_count_page_many
				}
	);
	// #673 (Marco P-4): a reset lifts search, building and status; the contract and the period stay
	const reset = $derived(
		search || building || status ? linkWith({ search: '', building: '', status: '' }) : ''
	);
	// without the sentence (a contract that is gone) the empty list still leads to all statements (fallback review)
	const emptyReset = $derived(reset || (data.scope ? '' : '/statements'));

	// Filters and paging live in the URL so the server filters across all statements
	function linkWith(changes: Record<string, string>): string {
		// eslint-disable-next-line svelte/prefer-svelte-reactivity -- a local copy, read once
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
	let paidAmount = $state(''); // #959: prefilled with the open amount, less is a part payment
	let saving = $state(false);
	let payError = $state('');
	let paidError = $state('');
	let earlyFor = $state('');
	const early = $derived(paying && earlyPaidDate(paidDate, paying.statementDate));
	const asking = $derived(!!early && earlyFor === paidDate);
	function startPaying(chosen: StatementWithDetails) {
		paying = chosen;
		paidDate = localToday();
		paidAmount = openAmount(chosen).toFixed(2);
		paidError = '';
		earlyFor = '';
	}
	// the confirmation asks once more for a day before the Abrechnungsdatum
	const confirm = $derived(
		asking
			? { label: m.statements_save_anyway(), testid: 'statement-list-mark-paid-early-confirm' }
			: {
					label:
						paying && isPartPayment(paying, paidAmount)
							? m.statements_record_part_payment()
							: m.statements_mark_paid(),
					testid: 'statement-list-mark-paid-confirm'
				}
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
				headers: { 'X-XSRF-TOKEN': getXsrfTokenFromCookie() ?? '' },
				body: JSON.stringify({
					paidDate,
					periodEnd: paying!.periodEnd,
					paidAmount: signedPaid(paying!, paidAmount)
				})
			});
			if (!response.ok) {
				// the date check says what to do; any other refusal gets the general sentence
				payError = (await response.json().catch(() => ({}))).message ?? failed;
				return;
			}
			const { id, statementNumber: number } = paying!;
			addToast(
				'success',
				isPartPayment(paying!, paidAmount)
					? m.statements_part_payment_recorded({ number })
					: m.statements_marked_paid_number({ number })
			);
			paying = null;
			await invalidateAll();
			await tick(); // its row's button is gone now: the focus goes to its row, not to the page title (#653);
			// in a list filtered by status the row is gone too: then to the list's result (code review 653-1 C-2)
			(
				document.querySelector<HTMLElement>(
					`[data-testid="statement-row-${id}"] [data-testid="statement-view-link"]`
				) ?? document.querySelector<HTMLElement>('[data-results]')
			)?.focus();
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

<!-- @container: filters and rows switch by the width of the page's column, not the window's (#658) -->
<div class="@container flex flex-col gap-8" data-testid="statements-page">
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

	<!-- #1186 (Marco P-1, Helga P-2): right under the tiles, still in view after a tap, what the list below shows -->
	<div class="flex flex-col gap-4">
		<StatusFilter
			scope={data.scope ?? ''}
			{contract}
			counts={data.statusCounts}
			active={status}
			href={(value) => linkWith({ status: value })}
		/>
		{#if chosen}
			<p class="text-ink" data-testid="status-filter-result">
				{shown}
			</p>
		{/if}
	</div>
	<StatementSearch
		{search}
		{building}
		{status}
		{contract}
		{periodStart}
		{periodEnd}
		reset={data.statements.length ? reset : ''}
		buildings={data.buildings}
	/>

	{#if data.statements.length === 0}
		<div data-testid="statements-empty">
			{#if filtered}
				<EmptyState
					illustration="no-results"
					title={m.statements_none_found()}
					text={noneText}
					actionLabel={m.buildings_reset_filters()}
					actionHref={emptyReset}
					actionTestid="statements-empty-reset"
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
		<ResultList
			id="statements-count"
			{counts}
			shown={data.statements.length}
			listClass="divide-y divide-line rounded-panel border border-line bg-surface"
			url={$page.url}
			page={data.page}
			pageSize={data.pageSize}
			total={data.total}
		>
			{#each data.statements as statement (statement.id)}
				<StatementRow {statement} onmarkpaid={startPaying} />
			{/each}
		</ResultList>
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
			)} {formatCurrency(openAmount(paying))}"
			bind:paidDate
			bind:paidAmount
			error={paidError}
			early={asking ? early : null}
		/>
		{#if payError}
			<Alert tone="critical" title={m.buildings_not_saved()}><p>{payError}</p></Alert>
		{/if}
	{/if}
</Dialog>
