<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { invoiceRows } from '$lib/statement-wizard';
	import CostReconciliation from '../../reports/CostReconciliation.svelte';

	// #1126: the Kostenabstimmung of each building of the run; a building without allocable invoices (or statements
	// billing any) shows none
	let { rows }: { rows: ReturnType<typeof invoiceRows> } = $props();
	const reconciled = $derived(rows.filter((row) => row.reconciliation?.positions.length));
</script>

{#if reconciled.length}
	<section aria-labelledby="reconciliation-heading" class="flex flex-col gap-4">
		<div class="flex flex-col gap-1">
			<h3 id="reconciliation-heading" class="text-xl font-bold text-ink">
				{m.reconciliation_title()}
			</h3>
			<p class="text-ink-muted">{m.reconciliation_help()}</p>
		</div>
		{#each reconciled as row (row.buildingId)}
			<div class="flex flex-col gap-2">
				<h4 class="text-lg font-semibold text-ink">{row.name}</h4>
				<CostReconciliation
					reconciliation={row.reconciliation!}
					caption={`${m.reconciliation_title()} ${row.name}`}
					testid="preview-reconciliation-{row.buildingId}"
				/>
			</div>
		{/each}
	</section>
{/if}
