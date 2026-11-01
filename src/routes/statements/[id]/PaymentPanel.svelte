<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { StatementWithDetails } from '$lib/types';
	import Button from '$lib/ui/Button.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import { partPaid } from '$lib/statement';
	import { formatCurrency, formatDate } from '$lib/utils/format';

	// Who pays whom by when; a refund has no Zahlungsfrist for the tenant
	let { statement, onsettle }: { statement: StatementWithDetails; onsettle?: () => void } = $props();

	const amount = $derived(formatCurrency(Math.abs(statement.balance)));
	const refund = $derived(statement.balance < 0);
	const nextReminder = $derived(statement.reminderWaitsUntil);
	// a replaced statement asks for nothing: its berichtigte Abrechnung says what is still due (#120); the backend says so (#788)
	const replaced = $derived(!statement.asksPayment);
	// below CHF 5 nothing is paid: no Zahlungsfrist and no «Bezahlt am»; the Saldo is carried over (#448), on a
	// Schlussabrechnung claimed or paid out; settled under #94 (paid with 0.00) a Nachzahlung was waived, a refund is
	// carried over now (product owner 2026-10-19, Fachreview 448-2 V-18); the backend says which (#815)
	const waived = $derived(statement.waived);
	const noPayment = $derived(statement.noPayment);
	// #506: an Übertrag no statement counts any more, or one the landlord settled by hand (Fachreview 506-1 V-6)
	const carryText = () =>
		statement.carrySettledOn
			? m.statements_carry_settled_on({ date: formatDate(statement.carrySettledOn) })
			: statement.openCarry
				? m.statements_carry_open()
				: m.statements_summary_carried();
	const summary = $derived(
		replaced
			? m.statements_summary_replaced()
			: statement.balance === 0
				? m.statements_summary_settled()
				: waived
					? m.statements_summary_waived_due()
					: noPayment
						? carryText()
						: refund
							? m.statements_summary_refund({ amount })
							: m.statements_summary_due({ amount })
	);
	const deadline = $derived({
		label: refund ? m.statements_refund_by() : m.glossary_deadline_term(),
		date: replaced || noPayment ? undefined : statement.paymentDeadline,
		testid: 'statement-payment-deadline'
	});
	const rows = $derived(
		[
			deadline,
			{ label: m.statements_statement_date(), date: statement.statementDate },
			{ label: m.statements_paid_on(), date: noPayment ? null : statement.paidDate },
			{ label: m.statements_last_reminder(), date: statement.lastReminderDate, testid: 'statement-last-reminder' }
		].filter((row) => row.date)
	);
</script>

<Panel title={m.statements_payment()}>
	<p class="text-ink" data-testid="statement-payment-summary">{summary}</p>
	{#if partPaid(statement)}<p class="text-ink" data-testid="statement-open-rest">
			{partPaid(statement)}
		</p>{/if}
	{#if statement.openCarry && !replaced && onsettle}
		<div>
			<Button variant="secondary" icon="check" onclick={onsettle} testid="statement-carry-settle"
				>{m.statements_carry_settle()}</Button
			>
		</div>
	{/if}
	<dl class="grid gap-4 sm:grid-cols-2">
		{#each rows as row (row.label)}
			<div class="flex flex-col gap-1">
				<dt class="text-ink-muted">{row.label}</dt>
				<dd class="font-semibold text-ink" data-testid={'testid' in row ? row.testid : undefined}>
					{formatDate(row.date!)}
				</dd>
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
	{#if statement.reminderToPost}
		<p class="text-ink" data-testid="statement-reminder-to-send">{m.statements_reminder_waits()}</p>
	{/if}
	{#if statement.notes}
		<div class="flex flex-col gap-1">
			<h3 class="text-ink-muted">{m.statements_notes()}</h3>
			<p class="whitespace-pre-line text-ink" data-testid="statement-notes">{statement.notes}</p>
		</div>
	{/if}
</Panel>
