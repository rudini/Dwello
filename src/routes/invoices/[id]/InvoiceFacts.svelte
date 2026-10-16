<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { InvoiceWithDetails } from '$lib/types';
	import Panel from '$lib/ui/Panel.svelte';
	import { formatCurrency, formatDate, formatDateTime } from '$lib/utils/format';

	// What the invoice says: date, amount, building and service
	let { invoice }: { invoice: InvoiceWithDetails } = $props();

	const changed = (iso?: string) => (iso ? formatDateTime(iso) : '–');
</script>

<Panel title={m.invoices_record()}>
	<dl class="grid gap-4 sm:grid-cols-2">
		<div class="flex flex-col gap-1">
			<dt class="text-ink-muted">{m.invoices_date()}</dt>
			<dd class="text-ink">{formatDate(invoice.invoiceDate)}</dd>
			{#if !invoice.servicePeriodStart}
				<dd class="text-ink-muted">{m.invoices_date_decides()}</dd>
			{/if}
		</div>
		{#if invoice.servicePeriodStart && invoice.servicePeriodEnd}
			<div class="flex flex-col gap-1">
				<dt class="text-ink-muted">{m.invoices_service_period()}</dt>
				<dd class="text-ink">
					{formatDate(invoice.servicePeriodStart)} – {formatDate(invoice.servicePeriodEnd)}
				</dd>
				<dd class="text-ink-muted">{m.invoices_service_period_days()}</dd>
			</div>
		{/if}
		{#if invoice.invoiceNumber}
			<div class="flex flex-col gap-1">
				<dt class="text-ink-muted">{m.invoices_invoice_number()}</dt>
				<dd class="text-ink" data-testid="invoice-number">{invoice.invoiceNumber}</dd>
			</div>
		{/if}
		<div class="flex flex-col gap-1">
			<dt class="text-ink-muted">{m.invoices_amount()}</dt>
			<dd class="text-xl font-semibold tabular-nums text-ink" data-testid="invoice-amount">
				{formatCurrency(invoice.amount)}
			</dd>
		</div>
		<div class="flex flex-col gap-1 sm:col-span-2">
			<dt class="text-ink-muted">{m.apartments_building()}</dt>
			<dd>
				<a
					href="/buildings/{invoice.buildingId}"
					class="inline-flex min-h-12 items-center font-semibold text-accent underline underline-offset-4"
					data-testid="invoice-building-link">{invoice.buildingName}</a
				>
				<p class="text-ink-muted">{invoice.buildingAddress}</p>
			</dd>
		</div>
		<div class="flex flex-col gap-1 sm:col-span-2">
			<dt class="text-ink-muted">{m.invoices_description()}</dt>
			<dd class="text-ink">{invoice.description}</dd>
		</div>
		<div class="flex flex-col gap-1">
			<dt class="text-ink-muted">{m.invoices_created()}</dt>
			<dd class="text-ink">{changed(invoice.createdAt)}</dd>
		</div>
		<div class="flex flex-col gap-1">
			<dt class="text-ink-muted">{m.invoices_updated()}</dt>
			<dd class="text-ink">{changed(invoice.updatedAt)}</dd>
		</div>
	</dl>
</Panel>
