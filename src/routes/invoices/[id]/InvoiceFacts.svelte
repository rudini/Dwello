<script lang="ts">
	import type { InvoiceWithDetails } from '$lib/types';
	import Panel from '$lib/ui/Panel.svelte';
	import { formatCurrency, formatDate } from '$lib/utils/format';

	// What the invoice says: date, amount, building and service
	let { invoice }: { invoice: InvoiceWithDetails } = $props();

	const changed = (iso?: string) => (iso ? new Date(iso).toLocaleString('de-CH') : '–');
</script>

<Panel title="Rechnung">
	<dl class="grid gap-4 sm:grid-cols-2">
		<div class="flex flex-col gap-1">
			<dt class="text-ink-muted">Rechnungsdatum</dt>
			<dd class="text-ink">{formatDate(invoice.invoiceDate)}</dd>
			<dd class="text-ink-muted">Bestimmt, in welche Abrechnungsperiode die Rechnung fällt.</dd>
		</div>
		<div class="flex flex-col gap-1">
			<dt class="text-ink-muted">Betrag</dt>
			<dd class="text-xl font-semibold tabular-nums text-ink" data-testid="invoice-amount">
				{formatCurrency(invoice.amount)}
			</dd>
		</div>
		<div class="flex flex-col gap-1 sm:col-span-2">
			<dt class="text-ink-muted">Gebäude</dt>
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
			<dt class="text-ink-muted">Beschreibung</dt>
			<dd class="text-ink">{invoice.description}</dd>
		</div>
		<div class="flex flex-col gap-1">
			<dt class="text-ink-muted">Erfasst</dt>
			<dd class="text-ink">{changed(invoice.createdAt)}</dd>
		</div>
		<div class="flex flex-col gap-1">
			<dt class="text-ink-muted">Zuletzt geändert</dt>
			<dd class="text-ink">{changed(invoice.updatedAt)}</dd>
		</div>
	</dl>
</Panel>
