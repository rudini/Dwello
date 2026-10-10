<script lang="ts">
	import type { MonthlyCosts } from '../types';
	import { formatCurrency } from '$lib/utils/format';
	import Panel from '$lib/ui/Panel.svelte';

	// What the current tenant pays each month, with the glossary's names
	let { costs }: { costs: MonthlyCosts } = $props();

	const costItems = $derived([
		{ label: 'Nettomiete', value: costs.baseRent },
		...(costs.advancePayment ? [{ label: 'Akonto', value: costs.advancePayment }] : []),
		...(costs.additionalRent ? [{ label: 'Zusatzmiete', value: costs.additionalRent }] : [])
	]);
</script>

<Panel title="Monatliche Miete">
	<dl class="flex flex-col gap-2 tabular-nums">
		{#each costItems as item (item.label)}
			<div class="flex justify-between gap-4">
				<dt class="text-ink-muted">{item.label}</dt>
				<dd class="text-ink">{formatCurrency(item.value)}</dd>
			</div>
		{/each}
		<div class="flex justify-between gap-4 border-t border-line pt-2">
			<!-- TODO(fachlich prüfen): no glossary term for the monthly total, see docs/design/offene-punkte.md -->
			<dt class="font-semibold text-ink">Monatlich total</dt>
			<dd class="font-bold text-ink" data-testid="monthly-costs-total">
				{formatCurrency(costs.totalBrutto)}
			</dd>
		</div>
	</dl>
</Panel>
