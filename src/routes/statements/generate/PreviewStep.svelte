<script lang="ts">
	import { invoiceRows } from '$lib/statement-wizard';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Checkbox from '$lib/ui/Checkbox.svelte';
	import { formatCurrency } from '$lib/utils/format';
	import type { PreviewRow } from './preview';

	// Step 4: what each rental contract will get, and the invoices behind it; missing invoices are flagged
	let {
		previewRows,
		invoices,
		buildings,
		periodLabel,
		confirmed = $bindable(),
		error
	}: {
		previewRows: PreviewRow[];
		invoices: Parameters<typeof invoiceRows>[0];
		buildings: { id: string; name: string }[];
		periodLabel: string;
		confirmed: boolean;
		error?: string;
	} = $props();

	const total = $derived(previewRows.reduce((sum, row) => sum + row.totalCosts, 0));
	const rows = $derived(invoiceRows(invoices, buildings));
	const missing = $derived(rows.filter((row) => row.missing));
	// Saldo > 0: the tenant pays the difference, < 0: the tenant gets it back
	const saldo = (balance: number) =>
		`${balance >= 0 ? 'Nachzahlung' : 'Rückerstattung'} ${formatCurrency(Math.abs(balance))}`;
</script>

<dl class="grid gap-4 sm:grid-cols-3">
	<div class="flex flex-col gap-1 rounded-panel bg-sunken p-4">
		<dt class="text-ink-muted">Abrechnungsperiode</dt>
		<dd class="font-semibold text-ink">{periodLabel}</dd>
	</div>
	<div class="flex flex-col gap-1 rounded-panel bg-sunken p-4">
		<dt class="text-ink-muted">Anzahl Abrechnungen</dt>
		<dd class="font-semibold tabular-nums text-ink" data-testid="preview-count">
			{previewRows.length}
		</dd>
	</div>
	<div class="flex flex-col gap-1 rounded-panel bg-sunken p-4">
		<dt class="text-ink-muted">Kosten aller Abrechnungen</dt>
		<dd class="font-semibold tabular-nums text-ink">{formatCurrency(total)}</dd>
	</div>
</dl>

<section aria-labelledby="invoices-heading" class="flex flex-col gap-2">
	<h3 id="invoices-heading" class="text-xl font-bold text-ink">
		Rechnungen in der Abrechnungsperiode
	</h3>
	<ul class="flex flex-col divide-y divide-line">
		{#each rows as row (row.buildingId)}
			<li class="flex flex-wrap justify-between gap-x-4 py-2" data-testid="preview-invoices">
				<span class="font-semibold text-ink">{row.name}</span>
				<span class={row.missing ? 'font-semibold text-critical' : 'text-ink-muted'}
					>{row.text}</span
				>
			</li>
		{/each}
	</ul>
</section>

{#if missing.length}
	<Alert tone="caution" title="Rechnungen fehlen" testid="missing-invoices">
		<p>
			Für {missing.map((row) => row.name).join(', ')} sind in der Abrechnungsperiode keine Rechnungen
			erfasst. Ohne Rechnungen werden CHF 0.00 Nebenkosten verteilt, und jeder Mieter erhält sein Akonto
			zurück.
		</p>
		<p>Erfassen Sie zuerst die Rechnungen – oder bestätigen Sie, dass es keine gibt.</p>
		{#snippet action()}
			<div class="flex flex-col gap-2">
				<Button href="/invoices/new" icon="invoice">Rechnung erfassen</Button>
				<Checkbox
					id="confirm-missing"
					label="Die Abrechnungen trotzdem erstellen"
					bind:checked={confirmed}
					testid="confirm-missing-invoices"
				/>
				{#if error}
					<p class="font-semibold text-critical" data-testid="form-error">{error}</p>
				{/if}
			</div>
		{/snippet}
	</Alert>
{/if}

<section aria-labelledby="statements-heading" class="flex flex-col gap-2">
	<h3 id="statements-heading" class="text-xl font-bold text-ink">Abrechnungen pro Mietvertrag</h3>
	{#if previewRows.length === 0}
		<p class="text-ink-muted" data-testid="preview-empty">
			In dieser Abrechnungsperiode gibt es keine Mietverträge in den gewählten Gebäuden.
		</p>
	{:else}
		<!-- a list instead of a table: readable on phones without scrolling sideways -->
		<ul class="flex flex-col divide-y divide-line">
			{#each previewRows as row (row.contractId)}
				<li
					class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2"
					data-testid="preview-row"
				>
					<span class="flex flex-col">
						<span class="font-semibold text-ink">{row.tenantName}</span>
						<span class="text-ink-muted">Wohnung {row.apartmentNumber}</span>
					</span>
					<span class="flex flex-col text-right tabular-nums">
						<span class="text-ink">Kosten {formatCurrency(row.totalCosts)}</span>
						<span class="font-semibold text-ink">{saldo(row.balance)}</span>
					</span>
				</li>
			{/each}
		</ul>
	{/if}
</section>
