<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { Reconciliation } from '$lib/cost-reconciliation';
	import Table from '$lib/ui/Table.svelte';
	import ReconciliationNotes from './ReconciliationNotes.svelte';
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
	const extras = $derived(
		[
			{ label: m.reconciliation_fee_row(), amount: reconciliation.managementFee },
			{ label: m.reconciliation_not_allocable_row(), amount: reconciliation.nonAllocable }
		].filter((extra) => extra.amount !== 0)
	);
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
				<li class="rounded-panel border border-line p-4">
					<dl class="grid grid-cols-2 gap-x-4 gap-y-2 tabular-nums">
						<dt class="text-ink-muted">{columns[0].label}</dt>
						<dd class="hyphens-auto break-words text-right font-semibold text-ink">{row.label}</dd>
						<dt class="text-ink-muted">{columns[1].label}</dt>
						<dd class="text-right text-ink">{formatCurrency(row.buildingCosts)}</dd>
						<dt class="text-ink-muted">{columns[2].label}</dt>
						<dd class="text-right text-ink">{formatCurrency(row.tenants)}</dd>
						<dt class="text-ink-muted">{columns[3].label}</dt>
						<dd class="text-right font-semibold text-ink">{formatCurrency(row.landlord)}</dd>
					</dl>
				</li>
			{/each}
		</ul>
		<div class="hidden md:block">
			<Table {caption} captionHidden {columns} testid="cost-reconciliation-table">
				{#each rows as row, i (i)}
					<tr data-testid="cost-reconciliation-row" class={'total' in row ? 'font-semibold' : ''}>
						<!-- the position names its row, so a screen reader names it with each amount (persona Sven 1126 P-4) -->
						<th
							scope="row"
							class="px-4 py-4 text-left font-normal text-ink"
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
				{/each}
			</Table>
		</div>
	{/if}

	{#if extras.length}
		<dl class="flex flex-col gap-2 tabular-nums">
			{#each extras as extra (extra.label)}
				<div class="flex justify-between gap-4" data-testid="cost-reconciliation-extra">
					<dt class="text-ink-muted" data-testid="cost-reconciliation-label">{extra.label}</dt>
					<dd class="whitespace-nowrap text-ink" data-testid="cost-reconciliation-amount">
						{formatCurrency(extra.amount)}
					</dd>
				</div>
			{/each}
		</dl>
	{/if}

	{#if reconciliation.positions.length}
		<p class="text-ink-muted" data-testid="cost-reconciliation-help">
			{m.reconciliation_landlord_help()}
		</p>
	{/if}

	<ReconciliationNotes {reconciliation} />
</div>
