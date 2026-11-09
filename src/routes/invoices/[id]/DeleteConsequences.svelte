<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { BilledStatement, InvoiceWithDetails } from '$lib/types';
	import { formatCurrency, formatDate } from '$lib/utils/format';
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

	// #1410: until when to keep it and why; a wertvermehrende Investition until the sale (Fachreview 1410-1 V-2)
	const retention = $derived(
		invoice.keepUntil === 'sale'
			? m.invoices_delete_retention_investment()
			: invoice.keepUntil && m.invoices_delete_retention({ date: formatDate(invoice.keepUntil) })
	);
</script>

<p>{m.invoices_delete_text({ name: invoice.billingEntity, amount: formatCurrency(invoice.amount) })}</p>
{#if retention}<p data-testid="invoice-delete-retention-note">{retention}</p>{/if}
{#if invoice.beleg}
	<p data-testid="invoice-delete-document-note">{m.invoices_delete_beleg()}</p>
{/if}
<!-- after its Aufbewahrungsfrist no statement is to correct (Fachreview 1410-1 V-3) -->
{#if billedIn?.length && invoice.keepUntil !== null}
	<BilledWarning periods={billedIn} {statements}>
		<p data-testid="invoice-delete-billed-text">{m.invoices_delete_billed_text()}</p>
		{#if invoice.beleg}
			<p data-testid="invoice-delete-billed-document-note">{m.invoices_delete_beleg_billed()}</p>
		{/if}
	</BilledWarning>
{/if}
