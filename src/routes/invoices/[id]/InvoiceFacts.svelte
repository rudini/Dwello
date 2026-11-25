<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { statusLabels } from '$lib/statement';
	import type { BilledStatement, InvoiceWithDetails } from '$lib/types';
	import Panel from '$lib/ui/Panel.svelte';
	import DeductedHint from '../DeductedHint.svelte';
	import { formatCurrency, formatDate, formatDateTime } from '$lib/utils/format';
	import { tankDelivery } from '$lib/invoice';

	// What the invoice says: date, amount, building and service, and the statements it is in; tank: the category of
	// the building's tank (#1469); fuel: whether the invoice's category is a fuel
	let {
		invoice,
		statements,
		tank,
		fuel
	}: { invoice: InvoiceWithDetails; statements: BilledStatement[]; tank?: string; fuel?: boolean } =
		$props();
	const delivery = $derived(tankDelivery(tank, invoice));
	// beside the tank, a one-day invoice of another fuel counts over the whole period too (#1478, Code-Review 1478-1 C-1)
	const fuelDelivery = $derived(
		!!tank &&
			invoice.isValidUtilityCost &&
			!!fuel &&
			invoice.servicePeriodStart === invoice.servicePeriodEnd
	);

	const changed = (iso?: string) => (iso ? formatDateTime(iso) : '–');
</script>

{#snippet tankHint()}
	{#if delivery !== undefined}
		<dd class="text-ink-muted" data-testid="invoice-tank-hint">
			{delivery ? m.invoices_tank_delivery() : m.invoices_tank_not_delivery()}
		</dd>
	{/if}
{/snippet}

<Panel title={m.invoices_record()}>
	<dl class="grid gap-4 sm:grid-cols-2">
		<div class="flex flex-col gap-1">
			<dt class="text-ink-muted">{m.invoices_date()}</dt>
			<dd class="text-ink">{formatDate(invoice.invoiceDate)}</dd>
			{#if !invoice.servicePeriodStart}
				<dd class="text-ink-muted">{m.invoices_date_decides()}</dd>
				{@render tankHint()}
			{/if}
		</div>
		{#if invoice.servicePeriodStart && invoice.servicePeriodEnd}
			<div class="flex flex-col gap-1">
				<dt class="text-ink-muted">{m.invoices_service_period()}</dt>
				<dd class="text-ink">
					{formatDate(invoice.servicePeriodStart)} – {formatDate(invoice.servicePeriodEnd)}
				</dd>
				<!-- a delivery into the tank counts over the whole period (Fachreview 1469-3 V-9) -->
				{#if delivery !== true && !fuelDelivery}
					<dd class="text-ink-muted">{m.invoices_service_period_days()}</dd>
				{/if}
				{@render tankHint()}
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
			{#if invoice.beleg?.deductedAmount}
				<dd>
					<DeductedHint amount={invoice.beleg.deductedAmount} />
				</dd>
			{/if}
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
		<!-- always: «abgerechnet» means in a statement of any status (#455, #263) -->
		<div class="flex flex-col gap-1 sm:col-span-2">
			<dt class="text-ink-muted">{m.invoices_billed_in()}</dt>
			<dd class="flex flex-col" data-testid="invoice-billed-in">
				{#each statements as statement (statement.id)}
					<a
						href="/statements/{statement.id}"
						class="inline-flex min-h-12 items-center font-semibold text-accent underline underline-offset-4"
						data-testid="invoice-billed-in-link"
						>{m.invoices_billed_in_entry({
							number: statement.statementNumber,
							status: statusLabels[statement.status]
						})}</a
					>
				{:else}
					<span class="text-ink">{m.invoices_billed_in_none()}</span>
				{/each}
			</dd>
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
