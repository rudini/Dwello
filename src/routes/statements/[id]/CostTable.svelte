<script lang="ts">
	import type { StatementWithDetails } from '$lib/types';
	import { balanceLabel } from '$lib/statement';
	import Table from '$lib/ui/Table.svelte';
	import { formatCurrency } from '$lib/utils/format';

	// The costs line by line, then the Verwaltungspauschale, the Akonto and what remains: the Saldo
	let { statement }: { statement: StatementWithDetails } = $props();

	const subtotal = $derived(statement.lineItems.reduce((sum, item) => sum + item.tenantShare, 0));
	// TODO(fachlich prüfen): «Rundung auf 5 Rappen» is not in the glossary (offene-punkte.md)
	// The Saldo goes to 5 Rappen. As in the PDF: the amount before, its rounding seen from the amount shown (a refund
	// that grows gets +), the Saldo; only a real rounding (under 5 Rappen)
	const cents = (amount: number) => Math.round(amount * 100) / 100;
	const unrounded = $derived(cents(statement.totalCosts - statement.totalAdvancePayments));
	const rounding = $derived(
		Math.abs(statement.balance - unrounded) < 0.05
			? cents(Math.abs(statement.balance) - Math.abs(unrounded))
			: 0
	);
	const columns = [
		{ label: 'Kategorie' },
		{ label: 'Verteilschlüssel' },
		{ label: 'Kosten des Gebäudes', numeric: true },
		{ label: 'Anteil', numeric: true },
		{ label: 'Betrag', numeric: true }
	];
</script>

{#if statement.lineItems.length === 0}
	<p class="text-ink-muted">
		Keine Abrechnungspositionen: Für diese Abrechnungsperiode waren keine Rechnungen erfasst.
	</p>
{:else}
	<!-- Phones get the lines one below the other, every amount in view; the table from md -->
	<ul class="flex flex-col gap-4 md:hidden" aria-label="Abrechnungspositionen">
		{#each statement.lineItems as item (item.id)}
			<li class="rounded-panel border border-line p-4" data-testid="statement-line-card">
				<dl class="grid grid-cols-2 gap-x-4 gap-y-2 tabular-nums">
					<dt class="text-ink-muted">Kategorie</dt>
					<dd class="hyphens-auto break-words text-right font-semibold text-ink">
						{item.categoryName}
					</dd>
					<dt class="text-ink-muted">Verteilschlüssel</dt>
					<dd class="hyphens-auto break-words text-right text-ink">
						{item.distributionKeyName}
					</dd>
					<dt class="text-ink-muted">Kosten des Gebäudes</dt>
					<dd class="text-right text-ink">{formatCurrency(item.totalAmount)}</dd>
					<dt class="text-ink-muted">Anteil</dt>
					<dd class="whitespace-nowrap text-right text-ink">{item.percentage} %</dd>
					<dt class="text-ink-muted">Betrag</dt>
					<dd class="text-right font-semibold text-ink">{formatCurrency(item.tenantShare)}</dd>
				</dl>
			</li>
		{/each}
	</ul>

	<div class="hidden md:block">
		<Table caption="Abrechnungspositionen" captionHidden {columns}>
			{#each statement.lineItems as item (item.id)}
				<tr data-testid="statement-line-item">
					<td class="text-ink">{item.categoryName}</td>
					<td class="text-ink-muted">{item.distributionKeyName}</td>
					<td class="text-right text-ink-muted">{formatCurrency(item.totalAmount)}</td>
					<td class="whitespace-nowrap text-right text-ink-muted">{item.percentage} %</td>
					<td class="text-right font-semibold text-ink">{formatCurrency(item.tenantShare)}</td>
				</tr>
			{/each}
		</Table>
	</div>
{/if}

<dl class="flex flex-col gap-2 tabular-nums">
	<div class="flex justify-between gap-4">
		<dt class="text-ink-muted">Zwischensumme</dt>
		<dd class="text-ink">{formatCurrency(subtotal)}</dd>
	</div>
	<div class="flex justify-between gap-4" data-testid="statement-management-fee">
		<dt class="flex flex-col text-ink-muted">
			<span>Verwaltungspauschale</span>
			<!-- as the PDF says it: a share of the tenant's own costs -->
			<span>{statement.managementFeePercent} % der Zwischensumme</span>
		</dt>
		<dd class="text-ink">{formatCurrency(statement.managementFee)}</dd>
	</div>
	<div class="flex justify-between gap-4 border-t border-line pt-2 font-semibold">
		<dt class="text-ink">Gesamtkosten</dt>
		<dd class="text-ink">{formatCurrency(statement.totalCosts)}</dd>
	</div>
	<div class="flex justify-between gap-4">
		<dt class="text-ink-muted">Geleistete Akontobeiträge</dt>
		<dd class="whitespace-nowrap text-ink">− {formatCurrency(statement.totalAdvancePayments)}</dd>
	</div>
	{#if rounding}
		<div class="flex flex-col gap-2" data-testid="statement-rounding">
			<div class="flex justify-between gap-4">
				<dt class="text-ink-muted">{balanceLabel(unrounded)} vor Rundung</dt>
				<dd class="whitespace-nowrap text-ink">{formatCurrency(Math.abs(unrounded))}</dd>
			</div>
			<div class="flex justify-between gap-4">
				<dt class="text-ink-muted">Rundung auf 5 Rappen</dt>
				<dd class="whitespace-nowrap text-ink">
					{rounding > 0 ? '+' : '−'} {formatCurrency(Math.abs(rounding))}
				</dd>
			</div>
		</div>
	{/if}
	<div
		class="flex justify-between gap-4 border-t border-line pt-2 text-lg font-bold"
		data-testid="statement-balance"
	>
		<dt class="text-ink">Saldo: {balanceLabel(statement.balance)}</dt>
		<dd class="text-ink">{formatCurrency(Math.abs(statement.balance))}</dd>
	</div>
</dl>
