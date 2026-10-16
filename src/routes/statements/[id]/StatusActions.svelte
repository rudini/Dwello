<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { StatementWithDetails } from '$lib/types';
	import Button from '$lib/ui/Button.svelte';

	// What the statement's status allows next: a draft is sent; a sent one is marked paid, an overdue one also reminded
	let {
		status,
		owes,
		onremind,
		onmarkpaid,
		onsend,
		onresetpayment
	}: {
		status: StatementWithDetails['status'];
		owes: boolean; // an amount due; a refund is owed to the tenant and never reminded
		onremind: () => void;
		onmarkpaid: () => void;
		onsend: () => void;
		onresetpayment: () => void;
	} = $props();
</script>

{#if status === 'sent' || status === 'overdue'}
	<!-- a reminder only once the payment deadline has passed, and only for an amount due -->
	{#if status === 'overdue' && owes}
		<Button onclick={onremind} icon="mail" testid="statement-reminder-button"
			>{m.statements_send_reminder()}</Button
		>
	{/if}
	<Button variant="primary" onclick={onmarkpaid} icon="success" testid="statement-mark-paid-button"
		>{m.statements_mark_paid()}</Button
	>
{:else if status === 'paid'}
	<!-- #92: a payment recorded on the wrong statement or with a wrong date is taken back -->
	<Button onclick={onresetpayment} icon="refresh" testid="statement-reset-payment-button"
		>{m.statements_reset_payment()}</Button
	>
{:else if status === 'draft'}
	<Button variant="primary" onclick={onsend} icon="send" testid="statement-send-button"
		>{m.statements_mark_sent()}</Button
	>
{/if}
