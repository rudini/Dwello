<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { StatementLineInvoice, StatementLineItem } from '$lib/types';
	import { formatCurrency, formatDate } from '$lib/utils/format';

	// The invoices a position billed, each a way to its page (#104); where they bill different days, each with its days
	// and the calculation of the share, as the PDF (#226, #240). The change of the Tankbestand is no invoice: no link
	let { item }: { item: StatementLineItem } = $props();

	const number = (amount: number) => formatCurrency(amount).replace(/^CHF\s?/, '');
	const parted = $derived(item.invoices.filter((invoice) => invoice.part));

	function partText({ part, start, end, amount, fuelStock }: StatementLineInvoice) {
		const values = { start: formatDate(start), end: formatDate(end), amount: formatCurrency(amount), days: part!.days, total: part!.total };
		if (fuelStock) return m.statements_part_stock(values);
		if (part!.noPeriod) return m.statements_part_no_period(values);
		const whole = part!.whole;
		if (whole)
			return m.statements_part_beyond({
				...values,
				wholeStart: formatDate(whole.start),
				wholeEnd: formatDate(whole.end),
				wholeAmount: formatCurrency(whole.amount)
			});
		return m.statements_part_line(values);
	}

	const share = $derived(
		m.statements_part_share({
			apartment: number(item.apartmentShare ?? 0),
			sum: parted.map((invoice) => `${number(invoice.amount)} × ${invoice.part!.days}/${invoice.part!.total}`).join(' + '),
			costs: number(item.totalAmount),
			share: number(item.tenantShare)
		})
	);
</script>

{#if item.invoices.length}
	<div class="flex flex-col gap-2" data-testid="statement-line-invoices">
		<ul class="flex flex-col gap-2" aria-label={m.statements_line_invoices({ category: item.categoryName })}>
			{#each item.invoices as invoice (invoice.id)}
				<li class="flex flex-col" data-testid="statement-line-invoice">
					{#if invoice.fuelStock}
						<span class="text-ink">{m.statements_fuel_stock()}</span>
					{:else}
						<a
							href="/invoices/{invoice.id}"
							class="inline-flex min-h-12 items-center font-semibold text-accent underline underline-offset-4"
							data-testid="statement-line-invoice-link">{invoice.description}</a
						>
					{/if}
					<span class="text-ink-muted">{invoice.part ? partText(invoice) : formatCurrency(invoice.amount)}</span>
				</li>
			{/each}
		</ul>
		{#if parted.length && item.apartmentShare != null}<p class="text-ink-muted">{share}</p>{/if}
	</div>
{/if}
