<script lang="ts">
	import { flushSync } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import type { StatementsListData, StatementWithDetails } from '$lib/types';
	import { balanceLabel, paidDateError, paidHelp } from '$lib/statement';
	import { focusFirstError } from '$lib/ui/focus-error';
	import { addToast } from '$lib/stores';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import DateInput from '$lib/ui/DateInput.svelte';
	import Dialog from '$lib/ui/Dialog.svelte';
	import { localToday } from '$lib/contract-status';
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

	// Payment received on a day asked for (today proposed), after a confirmation; the endpoint stores it
	let paying = $state<StatementWithDetails | null>(null);
	let paidDate = $state(localToday());
	let saving = $state(false);
	let payError = $state('');
	let paidError = $state('');
	async function markPaid() {
		// a wrong date is said at the field, which gets the focus; nothing is sent
		paidError = '';
		flushSync(); // cleared first: the same error set again shows again
		paidError = paidDateError(paidDate) ?? '';
		if (paidError) return focusFirstError(document.querySelector('[role="dialog"]'));
		saving = true;
		payError = '';
		const failed = 'Abrechnung konnte nicht als bezahlt markiert werden. Versuchen Sie es erneut.';
		try {
			const response = await fetch(`/statements/${paying!.id}/mark-paid`, {
				method: 'POST',
				body: JSON.stringify({ paidDate })
			});
			if (!response.ok) {
				// the date check says what to do; any other refusal gets the general sentence
				payError = (await response.json().catch(() => ({}))).message ?? failed;
				return;
			}
			addToast('success', `Abrechnung ${paying!.statementNumber} als bezahlt markiert`);
			paying = null;
			await invalidateAll();
		} catch {
			payError = failed;
		} finally {
			saving = false;
		}
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
			<h2 id="statements-count" tabindex="-1" data-results class="text-xl font-bold text-ink">
				{data.total === 1 ? '1 Abrechnung' : `${data.total} Abrechnungen`}
			</h2>
			<ul class="divide-y divide-line rounded-panel border border-line bg-surface">
				{#each data.statements as statement (statement.id)}
					<StatementRow
						{statement}
						onmarkpaid={(chosen) => (
							(paying = chosen),
							(paidDate = localToday()),
							(paidError = '')
						)}
					/>
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
	onclose={() => {
		paying = null;
		payError = '';
	}}
>
	{#if paying}
		{#if paying.balance > 0}<p>Danach können Sie keine Mahnung mehr senden.</p>{/if}
		<DateInput
			id="paidDate"
			label="Bezahlt am"
			help={paidHelp(paying.balance)}
			error={paidError}
			bind:value={paidDate}
			testid="paid-date-input"
		/>
		<p class="rounded-panel bg-sunken p-4 font-semibold text-ink">
			{paying.statementNumber}, {paying.tenantName}: {balanceLabel(paying.balance)}
			{formatCurrency(Math.abs(paying.balance))}
		</p>
		{#if payError}
			<Alert tone="critical" title="Nicht gespeichert"><p>{payError}</p></Alert>
		{/if}
	{/if}
</Dialog>
