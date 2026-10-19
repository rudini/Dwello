<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { HintedInvoice } from '$lib/statement-wizard';
	import Alert from '$lib/ui/Alert.svelte';
	import type { Tone } from '$lib/ui/tone';
	import { formatCurrency, formatDate } from '$lib/utils/format';

	// Invoices without Leistungszeitraum per building that may count in the wrong period; each opens to be edited
	let {
		buildings,
		title,
		text,
		tone = 'info',
		testid
	}: {
		buildings: { buildingId: string; name: string; invoices: HintedInvoice[] }[];
		title: string;
		text: string;
		tone?: Exclude<Tone, 'neutral'>;
		testid: string;
	} = $props();
</script>

{#if buildings.length}
	<Alert {tone} {title} {testid}>
		<p>{text}</p>
		{#each buildings as row (row.buildingId)}
			<p class="font-semibold" aria-hidden="true">{row.name}</p>
			<ul class="flex flex-col gap-2" aria-label={row.name}>
				{#each row.invoices as invoice (invoice.id)}
					<li data-testid="hinted-invoice">
						<a
							href="/invoices/{invoice.id}/edit"
							class="inline-flex min-h-12 items-center text-accent underline underline-offset-4"
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
		{/each}
	</Alert>
{/if}
