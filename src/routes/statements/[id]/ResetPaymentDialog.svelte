<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { statusLabels } from '$lib/statement';
	import type { StatementWithDetails } from '$lib/types';
	import { formatCurrency, formatDate } from '$lib/utils/format';
	import FormDialog from './FormDialog.svelte';

	// #92: a recorded payment taken back; the consequence with the status that then applies, by the payment deadline
	let { open = $bindable(), statement }: { open: boolean; statement: StatementWithDetails } =
		$props();

	const status = $derived(
		statement.deadlinePassed ? statusLabels.overdue : statusLabels.sent
	);
	// #999: the last recorded payment, also a part payment (no Zahlungsdatum yet); what was recorded before it stays
	// (Fachreview 999-1 V-3)
	const payments = $derived(statement.payments ?? []);
	const last = $derived(payments.at(-1));
	const kept = $derived(payments.slice(0, -1).reduce((sum, payment) => sum + payment.amount, 0));
	const chf = (amount: number) => formatCurrency(Math.abs(amount));
	const text = $derived.by(() => {
		const number = statement.statementNumber;
		if (last && payments.length > 1)
			return m.statements_reset_part_payment_text({
				date: formatDate(last.date),
				amount: chf(last.amount),
				kept: chf(kept),
				open: chf(statement.balance - kept),
				number,
				status
			});
		if (last && !statement.paidDate)
			return m.statements_reset_only_part_payment_text({
				date: formatDate(last.date),
				amount: chf(last.amount),
				open: chf(statement.balance),
				number,
				status
			});
		return m.statements_reset_payment_text({
			number,
			status,
			date: statement.paidDate ? formatDate(statement.paidDate) : '–'
		});
	});
</script>

<FormDialog
	bind:open
	action="?/resetPayment"
	title={m.statements_reset_payment_title()}
	confirmLabel={m.statements_reset_payment()}
	confirmTestid="statement-reset-payment-confirm"
	success={m.statements_reset_payment_done({ number: statement.statementNumber })}
>
	<p>{text}</p>
</FormDialog>
