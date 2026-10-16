<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { localToday } from '$lib/contract-status';
	import { statusLabels } from '$lib/statement';
	import type { StatementWithDetails } from '$lib/types';
	import { formatDate } from '$lib/utils/format';
	import FormDialog from './FormDialog.svelte';

	// #92: a recorded payment taken back; the consequence with the status that then applies, by the payment deadline
	let { open = $bindable(), statement }: { open: boolean; statement: StatementWithDetails } =
		$props();

	const status = $derived(
		statement.paymentDeadline < localToday() ? statusLabels.overdue : statusLabels.sent
	);
</script>

<FormDialog
	bind:open
	action="?/resetPayment"
	title={m.statements_reset_payment_title()}
	confirmLabel={m.statements_reset_payment()}
	confirmTestid="statement-reset-payment-confirm"
	success={m.statements_reset_payment_done({ number: statement.statementNumber })}
>
	<p>
		{m.statements_reset_payment_text({
			number: statement.statementNumber,
			status,
			date: statement.paidDate ? formatDate(statement.paidDate) : '–'
		})}
	</p>
</FormDialog>
