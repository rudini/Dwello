<script lang="ts">
	import type { StatementWithDetails } from '$lib/types';
	import { balanceLabel } from '$lib/statement';
	import Table from '$lib/ui/Table.svelte';
	import { formatCurrency } from '$lib/utils/format';

	// The costs line by line, then the Verwaltungspauschale, the Akonto and what remains: the Saldo
	let { statement }: { statement: StatementWithDetails } = $props();

	const subtotal = $derived(statement.lineItems.reduce((sum, item) => sum + item.tenantShare, 0));
	const columns = [
		{ label: 'Kategorie' },
		{ label: 'Verteilschlüssel' },
		{ label: 'Kosten des Gebäudes', numeric: true },
		{ label: 'Anteil', numeric: true },
		{ label: 'Betrag', numeric: true }
	];
</script>

<Table caption="Abrechnungspositionen" captionHidden {columns}>
	{#each statement.lineItems as item (item.id)}
		<tr data-testid="statement-line-item">
			<td class="text-ink">{item.categoryName}</td>
			<td class="text-ink-muted">{item.distributionKeyName}</td>
			<td class="text-right text-ink-muted">{formatCurrency(item.totalAmount)}</td>
			<td class="text-right text-ink-muted">{item.percentage} %</td>
			<td class="text-right font-semibold text-ink">{formatCurrency(item.tenantShare)}</td>
		</tr>
	{/each}
</Table>

<dl class="flex flex-col gap-2 tabular-nums">
	<div class="flex justify-between gap-4">
		<dt class="text-ink-muted">Zwischensumme</dt>
		<dd class="text-ink">{formatCurrency(subtotal)}</dd>
	</div>
	<div class="flex justify-between gap-4" data-testid="statement-management-fee">
		<dt class="flex flex-col text-ink-muted">
			<span>Verwaltungspauschale</span>
			<span>
				{statement.managementFeePercent} % der Nebenkosten der Liegenschaft, Anteil dieser Wohnung für
				{statement.rentalDays} Mietstage
			</span>
		</dt>
		<dd class="text-ink">{formatCurrency(statement.managementFee)}</dd>
	</div>
	<div class="flex justify-between gap-4 border-t border-line pt-2 font-semibold">
		<dt class="text-ink">Gesamtkosten</dt>
		<dd class="text-ink">{formatCurrency(statement.totalCosts)}</dd>
	</div>
	<div class="flex justify-between gap-4">
		<dt class="text-ink-muted">Geleistete Akontobeiträge</dt>
		<dd class="text-ink">− {formatCurrency(statement.totalAdvancePayments)}</dd>
	</div>
	<div
		class="flex justify-between gap-4 border-t border-line pt-2 text-lg font-bold"
		data-testid="statement-balance"
	>
		<dt class="text-ink">Saldo: {balanceLabel(statement.balance)}</dt>
		<dd class="text-ink">{formatCurrency(Math.abs(statement.balance))}</dd>
	</div>
</dl>
