<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { MonthlyCosts } from '$lib/types';
	import { formatCurrency } from '$lib/utils/format';
	import Panel from '$lib/ui/Panel.svelte';

	// What the current tenant pays each month, with the glossary's names
	let { costs }: { costs: MonthlyCosts } = $props();

	const costItems = $derived([
		{ label: m.common_net_rent(), value: costs.baseRent },
		...(costs.advancePayment
			? [{ label: m.common_advance_payment(), value: costs.advancePayment }]
			: []),
		...(costs.flatRateUtilityCharge
			? [{ label: m.common_flat_rate_utility_charge(), value: costs.flatRateUtilityCharge }]
			: []),
		...(costs.additionalRent
			? [{ label: m.common_additional_rent(), value: costs.additionalRent }]
			: [])
	]);
</script>

<Panel title={m.apartments_monthly_rent()}>
	<dl class="flex flex-col gap-2 tabular-nums">
		{#each costItems as item (item.label)}
			<div class="flex justify-between gap-4">
				<dt class="text-ink-muted">{item.label}</dt>
				<dd class="text-ink">{formatCurrency(item.value)}</dd>
			</div>
		{/each}
		<div class="flex justify-between gap-4 border-t border-line pt-2">
			<dt class="font-semibold text-ink">{m.common_monthly_total()}</dt>
			<dd class="font-bold text-ink" data-testid="monthly-costs-total">
				{formatCurrency(costs.monthlyTotal)}
			</dd>
		</div>
	</dl>
</Panel>
