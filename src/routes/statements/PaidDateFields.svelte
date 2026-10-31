<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { StatementWithDetails } from '$lib/types';
	import { isPartPayment, paidHelp } from '$lib/statement';
	import Alert from '$lib/ui/Alert.svelte';
	import DateInput from '$lib/ui/DateInput.svelte';
	import MoneyInput from '$lib/ui/MoneyInput.svelte';

	// The fields of «Als bezahlt markieren», on the list and the detail page: the day, the question before a day before
	// the Abrechnungsdatum is saved (#448), what came in (#959), and what is paid
	let {
		statement,
		summary,
		paidDate = $bindable(),
		paidAmount = $bindable(),
		error,
		early
	}: {
		statement: StatementWithDetails;
		summary: string;
		paidDate: string;
		paidAmount: string; // without the sign of the Saldo; less than the open amount is a part payment (#959)
		error: string;
		early: string | null; // asked once the landlord confirmed that day
	} = $props();
</script>

<!-- after a part payment the rest is reminded on (Fachreview 959-1 V-1) -->
{#if statement.claimed && !isPartPayment(statement, paidAmount)}<p>
		{m.statements_no_reminder_after()}
	</p>{/if}
<DateInput
	id="paidDate"
	label={m.statements_paid_on()}
	help={paidHelp(statement.balance)}
	{error}
	bind:value={paidDate}
	testid="paid-date-input"
/>
<!-- read out when it appears: the focus stays on the button, whose name changes -->
<div aria-live="polite">
	{#if early}
		<Alert tone="caution" title={early} testid="paid-date-early-warning" />
	{/if}
</div>
<p class="rounded-panel bg-sunken p-4 font-semibold text-ink">{summary}</p>
<!-- what came in for this statement, also a part (#523, #959; Art. 69, 86 OR, Fachreview 959-1); below the
	Mindestbetrag no money moves (#94): no amount -->
{#if !statement.waived}<MoneyInput
	id="paidAmount"
	label={statement.balance < 0 ? m.statements_paid_amount_refund() : m.statements_paid_amount()}
	help={statement.balance < 0 ? m.statements_paid_partial_refund() : m.statements_paid_partial()}
	bind:value={paidAmount}
	testid="paid-amount-input"
	/>{/if}
