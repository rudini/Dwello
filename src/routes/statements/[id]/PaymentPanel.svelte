<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { StatementWithDetails } from '$lib/types';
	import Panel from '$lib/ui/Panel.svelte';
	import { belowMinimum, nextReminderLater } from '$lib/statement';
	import { formatCurrency, formatDate } from '$lib/utils/format';

	// Who pays whom by when; a refund has no Zahlungsfrist for the tenant
	let { statement }: { statement: StatementWithDetails } = $props();

	const amount = $derived(formatCurrency(Math.abs(statement.balance)));
	const refund = $derived(statement.balance < 0);
	const nextReminder = $derived(nextReminderLater(statement));
	// below CHF 5 nothing is paid: no Zahlungsfrist and no «Bezahlt am» (#94)
	const waived = $derived(belowMinimum(statement.balance));
	const summary = $derived(
		statement.balance === 0
			? m.statements_summary_settled()
			: waived
				? refund
					? m.statements_summary_waived_refund()
					: m.statements_summary_waived_due()
				: refund
					? m.statements_summary_refund({ amount })
					: m.statements_summary_due({ amount })
	);
	const rows = $derived(
		[
			{ label: m.statements_statement_date(), date: statement.statementDate },
			{ label: m.statements_paid_on(), date: waived ? null : statement.paidDate },
			{ label: m.statements_last_reminder(), date: statement.lastReminderDate }
		].filter((row) => row.date)
	);
</script>

<Panel title={m.statements_payment()}>
	<p class="text-ink" data-testid="statement-payment-summary">{summary}</p>
	<dl class="grid gap-4 sm:grid-cols-2">
		{#if !waived}
			<div class="flex flex-col gap-1">
				<dt class="text-ink-muted">
					{refund ? m.statements_refund_by() : m.glossary_deadline_term()}
				</dt>
				<dd class="font-semibold text-ink" data-testid="statement-payment-deadline">
					{formatDate(statement.paymentDeadline)}
				</dd>
			</div>
		{/if}
		{#each rows as row (row.label)}
			<div class="flex flex-col gap-1">
				<dt class="text-ink-muted">{row.label}</dt>
				<dd class="font-semibold text-ink">{formatDate(row.date!)}</dd>
			</div>
		{/each}
		{#if nextReminder}
			<div class="flex flex-col gap-1">
				<dt class="text-ink-muted">{m.statements_next_reminder()}</dt>
				<dd class="font-semibold text-ink" data-testid="statement-next-reminder">
					{formatDate(nextReminder)}
				</dd>
			</div>
		{/if}
	</dl>
	{#if statement.notes}
		<div class="flex flex-col gap-1">
			<h3 class="text-ink-muted">{m.statements_notes()}</h3>
			<p class="whitespace-pre-line text-ink" data-testid="statement-notes">{statement.notes}</p>
		</div>
	{/if}
</Panel>
