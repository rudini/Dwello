<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { BilledStatement, InvoiceWithDetails } from '$lib/types';
	import { formatCurrency } from '$lib/utils/format';
	import BilledWarning from '../BilledWarning.svelte';

	// What deleting the invoice does: it and its Beleg go, and statements that billed it are wrong afterwards
	let {
		invoice,
		billedIn,
		statements
	}: {
		invoice: InvoiceWithDetails;
		billedIn?: { start: string; end: string }[];
		statements?: BilledStatement[];
	} = $props();
</script>

<p>{m.invoices_delete_text({ name: invoice.billingEntity, amount: formatCurrency(invoice.amount) })}</p>
{#if invoice.beleg}
	<p data-testid="invoice-delete-document-note">{m.invoices_delete_beleg()}</p>
{/if}
{#if billedIn?.length}
	<BilledWarning periods={billedIn} {statements}>
		<p data-testid="invoice-delete-billed-text">{m.invoices_delete_billed_text()}</p>
		{#if invoice.beleg}
			<p data-testid="invoice-delete-billed-document-note">{m.invoices_delete_beleg_billed()}</p>
		{/if}
	</BilledWarning>
{/if}
