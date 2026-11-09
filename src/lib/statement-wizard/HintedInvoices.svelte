<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { HintedInvoice } from '$lib/statement-wizard';
	import { formatCurrency, formatDate } from '$lib/utils/format';

	// Invoices a hint names, each to edit and back to `back` after saving or cancelling (Persona Dr. Weber P-2,
	// #452; on a statement, persona Anna 1309 P-1)
	let {
		invoices,
		back,
		label,
		testid = 'hinted-invoice'
	}: { invoices: HintedInvoice[]; back: string; label?: string; testid?: string } = $props();
</script>

<ul class="flex flex-col gap-2" aria-label={label}>
	{#each invoices as invoice (invoice.id)}
		<li data-testid={testid}>
			<a
				href="/invoices/{invoice.id}/edit?returnTo={encodeURIComponent(back)}"
				class="inline-flex min-h-12 items-center text-accent underline underline-offset-4"
				>{m.statements_hinted_invoice({
					supplier: invoice.billingEntityName,
					description: invoice.description,
					date: formatDate(invoice.invoiceDate),
					amount: formatCurrency(parseFloat(invoice.amount))
				})}</a
			>
			{#if invoice.note}<p>{invoice.note}</p>{/if}
		</li>
	{/each}
</ul>
