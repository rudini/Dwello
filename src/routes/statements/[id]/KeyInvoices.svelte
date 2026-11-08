<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { HintedInvoice } from '$lib/statement-wizard';
	import { formatCurrency, formatDate } from '$lib/utils/format';

	// #1309 (persona Anna 1309 P-1): the invoices whose key cannot be calculated, each to edit and back to `back`
	let { invoices, back }: { invoices: HintedInvoice[]; back: string } = $props();
</script>

{#if invoices.length}
	<ul class="flex flex-col gap-2">
		{#each invoices as invoice (invoice.id)}
			<li>
				<a
					href="/invoices/{invoice.id}/edit?returnTo={encodeURIComponent(back)}"
					class="inline-flex min-h-12 items-center text-accent underline underline-offset-4"
					data-testid="statement-later-key-invoice"
					>{m.statements_hinted_invoice({
						supplier: invoice.billingEntityName,
						description: invoice.description,
						date: formatDate(invoice.invoiceDate),
						amount: formatCurrency(parseFloat(invoice.amount))
					})}</a
				>
			</li>
		{/each}
	</ul>
{/if}
