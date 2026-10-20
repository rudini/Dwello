<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { StatementWithDetails } from '$lib/types';
	import { claimed, paidHelp } from '$lib/statement';
	import Alert from '$lib/ui/Alert.svelte';
	import DateInput from '$lib/ui/DateInput.svelte';

	// The fields of «Als bezahlt markieren», on the list and the detail page: the day, the question before a day before
	// the Abrechnungsdatum is saved (#448), and what is paid
	let {
		statement,
		summary,
		paidDate = $bindable(),
		error,
		early
	}: {
		statement: StatementWithDetails;
		summary: string;
		paidDate: string;
		error: string;
		early: string | null; // asked once the landlord confirmed that day
	} = $props();
</script>

{#if claimed(statement)}<p>{m.statements_no_reminder_after()}</p>{/if}
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
