<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { Reconciliation } from '$lib/cost-reconciliation';
	import Table from '$lib/ui/Table.svelte';
	import ReconciliationExtras from './ReconciliationExtras.svelte';
	import ReconciliationNotes from './ReconciliationNotes.svelte';
	import ReconciliationRows from './ReconciliationRows.svelte';
	import ReconciliationSentences from './ReconciliationSentences.svelte';
	import { formatCurrency } from '$lib/utils/format';

	// #1126: the Kostenabstimmung of one building's period: per position the Kosten des Gebäudes against what the
	// statements bill the tenants; the Verwaltungspauschale and the non-allocable invoices beside it, each only when not
	// 0.00, also without positions (code review 1126-2 C-1); the notes only on «Berichte» (the preview's body has none)
	let {
		reconciliation,
		caption,
		testid
	}: { reconciliation: Reconciliation; caption: string; testid: string } = $props();

	const rows = $derived([
		...reconciliation.positions,
		{ ...reconciliation.total, label: m.reconciliation_total(), total: true }
	]);
	// #1138 (PO 06.11.2026): the total card on phones stands apart from the positions above it
	const card = (row: (typeof rows)[number]) =>
		'total' in row
			? { card: 'bg-sunken', label: 'font-bold', row: 'font-semibold', head: 'font-semibold' }
			: // #1464: no line between a position and the row of its Rechnungen below it
				{ card: '', label: 'font-semibold', row: 'border-b-0', head: 'font-normal' };
	const columns = [
		{ label: m.reconciliation_col_position() },
		{ label: m.statements_building_costs(), numeric: true },
		{ label: m.reconciliation_col_tenants(), numeric: true },
		{ label: m.reconciliation_col_landlord(), numeric: true }
	];
</script>

<div class="flex flex-col gap-4" data-testid={testid}>
	{#if reconciliation.positions.length}
		<!-- Phones get the positions one below the other, every amount in view; the table from md -->
		<ul class="flex flex-col gap-4 md:hidden" aria-label={caption}>
			{#each rows as row, i (i)}
				<li class="rounded-panel border border-line p-4 {card(row).card}">
					<dl class="grid grid-cols-2 gap-x-4 gap-y-2 tabular-nums">
						<dt class="text-ink-muted">{columns[0].label}</dt>
						<dd class="hyphens-auto break-words text-right text-ink {card(row).label}">
							{row.label}
						</dd>
						<dt class="text-ink-muted">{columns[1].label}</dt>
						<dd class="text-right text-ink">{formatCurrency(row.buildingCosts)}</dd>
						<dt class="text-ink-muted">{columns[2].label}</dt>
						<dd class="text-right text-ink">{formatCurrency(row.tenants)}</dd>
						<dt class="text-ink-muted">{columns[3].label}</dt>
						<dd class="text-right font-semibold text-ink">{formatCurrency(row.landlord)}</dd>
					</dl>
					{#if 'rows' in row}
						<div class="mt-2"><ReconciliationRows position={row.label} rows={row.rows} /></div>
					{/if}
				</li>
			{/each}
		</ul>
		<div class="hidden md:block">
			<Table {caption} captionHidden {columns} testid="cost-reconciliation-table">
				{#each rows as row, i (i)}
					<tr data-testid="cost-reconciliation-row" class={card(row).row}>
						<!-- the position names its row, so a screen reader names it with each amount (persona Sven 1126 P-4) -->
						<th
							scope="row"
							class="px-4 py-4 text-left text-ink {card(row).head}"
							data-testid="cost-reconciliation-cell">{row.label}</th
						>
						<td class="text-right text-ink" data-testid="cost-reconciliation-cell"
							>{formatCurrency(row.buildingCosts)}</td
						>
						<td class="text-right text-ink" data-testid="cost-reconciliation-cell"
							>{formatCurrency(row.tenants)}</td
						>
						<td class="text-right text-ink" data-testid="cost-reconciliation-cell"
							>{formatCurrency(row.landlord)}</td
						>
					</tr>
					{#if 'rows' in row}
						<tr>
							<td colspan="4"><ReconciliationRows position={row.label} rows={row.rows} /></td>
						</tr>
					{/if}
				{/each}
			</Table>
		</div>
	{/if}

	<ReconciliationExtras {reconciliation} />

	{#if reconciliation.positions.length}
		<p class="text-ink-muted" data-testid="cost-reconciliation-help">
			{m.reconciliation_landlord_help()}
		</p>
		<ReconciliationSentences {reconciliation} />
	{/if}

	<ReconciliationNotes {reconciliation} />
</div>
