<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { StatementLineInvoice, StatementLineItem } from '$lib/types';
	import { formatCurrency, formatDate } from '$lib/utils/format';

	// The invoices a position billed, each a way to its page (#104); where they bill different days, each with its days
	// and the calculation of the share, as the PDF (#226, #240). The change of the Tankbestand is no invoice: no link
	let { item }: { item: StatementLineItem } = $props();

	const number = (amount: number) => formatCurrency(amount).replace(/^CHF\s?/, '');
	const parted = $derived(item.invoices.filter((invoice) => invoice.part));
	// by the Heizprofil its share, as the PDF (#71; persona Dr. Weber P-1 of #451), else the days
	const factor = (part: NonNullable<StatementLineInvoice['part']>) =>
		part.profile ? `${part.profile.percent.toFixed(2)} %` : `${part.days}/${part.total}`;

	// by the Heizprofil its share instead of the days, as the PDF (#507)
	function partText({ part, start, end, amount, fuelStock }: StatementLineInvoice) {
		const { days, total, noPeriod, whole, profile } = part!;
		const values = {
			start: formatDate(start),
			end: formatDate(end),
			amount: formatCurrency(amount),
			days,
			total,
			wholeStart: whole ? formatDate(whole.start) : '',
			wholeEnd: whole ? formatDate(whole.end) : '',
			wholeAmount: whole ? formatCurrency(whole.amount) : '',
			percent: profile?.percent.toFixed(2) ?? ''
		};
		const [byDays, byProfile] = fuelStock
			? [m.statements_part_stock, m.statements_part_stock_profile]
			: noPeriod
				? [m.statements_part_no_period, m.statements_part_no_period_profile]
				: whole
					? [m.statements_part_beyond, m.statements_part_beyond_profile]
					: [m.statements_part_line, m.statements_part_line_profile];
		return (profile ? byProfile : byDays)(values);
	}

	// invoices summing to zero: their parts times the apartment's share by the key, as the PDF (#237)
	const share = $derived.by(() => {
		// a negative amount with a minus, as the PDF (#257, Fachreview V-24)
		const sum = parted
			.map((invoice, i) => {
				const sign = invoice.amount < 0 ? (i ? ' – ' : '– ') : i ? ' + ' : '';
				return `${sign}${number(Math.abs(invoice.amount))} × ${factor(invoice.part!)}`;
			})
			.join('');
		if (item.totalAmount === 0) return m.statements_part_share_zero({ sum, share: number(item.tenantShare) });
		const values = { apartment: number(item.apartmentShare ?? 0), costs: number(item.totalAmount) };
		return m.statements_part_share({ ...values, sum, share: number(item.tenantShare) });
	});
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
