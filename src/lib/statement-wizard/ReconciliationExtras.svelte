<script lang="ts">
	import type { Reconciliation } from '$lib/cost-reconciliation';
	import { m } from '$lib/paraglide/messages';
	import ReconciliationRows from './ReconciliationRows.svelte';
	import { formatCurrency } from '$lib/utils/format';

	// #1126: beside the comparison, each only when not 0.00, also without positions (code review 1126-2 C-1): the
	// Verwaltungspauschale and the non-allocable invoices, which expand like a position (#1464)
	let { reconciliation, back }: { reconciliation: Reconciliation; back?: string } = $props();

	const extras = $derived(
		[
			{ label: m.reconciliation_fee_row(), amount: reconciliation.managementFee, rows: null },
			{
				label: m.reconciliation_not_allocable_row(),
				amount: reconciliation.nonAllocable,
				rows: reconciliation.nonAllocableRows
			}
		].filter((extra) => extra.amount !== 0)
	);
</script>

{#if extras.length}
	<dl class="flex flex-col gap-2 tabular-nums">
		{#each extras as extra (extra.label)}
			<div
				class="flex flex-wrap justify-between gap-x-4 gap-y-2"
				data-testid="cost-reconciliation-extra"
			>
				<dt class="min-w-0 flex-1 text-ink-muted" data-testid="cost-reconciliation-label">
					{extra.label}
				</dt>
				<dd class="whitespace-nowrap text-ink" data-testid="cost-reconciliation-amount">
					{formatCurrency(extra.amount)}
				</dd>
				{#if extra.rows}
					<dd class="w-full">
						<ReconciliationRows position={extra.label} rows={extra.rows} {back} />
					</dd>
				{/if}
			</div>
		{/each}
	</dl>
{/if}
