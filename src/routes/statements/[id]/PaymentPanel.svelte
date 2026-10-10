<script lang="ts">
	import type { StatementWithDetails } from '$lib/types';
	import Panel from '$lib/ui/Panel.svelte';
	import { formatCurrency, formatDate } from '$lib/utils/format';

	// Who pays whom by when; a refund has no Zahlungsfrist for the tenant
	let { statement }: { statement: StatementWithDetails } = $props();

	const amount = $derived(formatCurrency(Math.abs(statement.balance)));
	const refund = $derived(statement.balance < 0);
	const summary = $derived(
		refund
			? `Sie erstatten dem Mieter ${amount} zurück.`
			: statement.balance > 0
				? `Der Mieter bezahlt die Nachzahlung von ${amount}.`
				: 'Es ist nichts zu bezahlen.'
	);
	const rows = $derived(
		[
			{ label: 'Abrechnungsdatum', date: statement.statementDate },
			{ label: 'Bezahlt am', date: statement.paidDate },
			{ label: 'Letzte Mahnung', date: statement.lastReminderDate }
		].filter((row) => row.date)
	);
</script>

<Panel title="Zahlung">
	<p class="text-ink">{summary}</p>
	<dl class="grid gap-4 sm:grid-cols-2">
		<div class="flex flex-col gap-1">
			<!-- TODO(fachlich prüfen): the glossary has no term for the date by which a refund is paid out -->
			<dt class="text-ink-muted">{refund ? 'Rückerstattung bis' : 'Zahlungsfrist'}</dt>
			<dd class="font-semibold text-ink" data-testid="statement-payment-deadline">
				{formatDate(statement.paymentDeadline)}
			</dd>
		</div>
		{#each rows as row (row.label)}
			<div class="flex flex-col gap-1">
				<dt class="text-ink-muted">{row.label}</dt>
				<dd class="font-semibold text-ink">{formatDate(row.date!)}</dd>
			</div>
		{/each}
	</dl>
	{#if statement.notes}
		<div class="flex flex-col gap-1">
			<h3 class="text-ink-muted">Bemerkungen</h3>
			<p class="whitespace-pre-line text-ink" data-testid="statement-notes">{statement.notes}</p>
		</div>
	{/if}
</Panel>
