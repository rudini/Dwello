<script lang="ts">
	import Card from './Card.svelte';
	import type { MonthlyCosts } from '../types';

	interface Props {
		costs: MonthlyCosts;
	}

	let { costs }: Props = $props();

	function formatCurrency(value: number): string {
		return new Intl.NumberFormat('de-CH', {
			style: 'currency',
			currency: 'CHF',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(value);
	}

	const costItems = $derived([
		{ label: 'Nettomiete', value: costs.base_rent },
		...(costs.advance_payment ? [{ label: 'Nebenkosten (Aconto)', value: costs.advance_payment }] : []),
		...(costs.parking ? [{ label: 'Parkplatz (Nr. 12)', value: costs.parking }] : [])
	]);
</script>

<Card>
	<h3 class="text-lg font-bold text-text-dark mb-6">Monatliche Kosten</h3>

	<div class="space-y-4 mb-4">
		{#each costItems as item}
			<div class="flex justify-between items-center">
				<span class="text-sm text-text-secondary">{item.label}</span>
				<span class="text-sm font-medium text-text-dark">{formatCurrency(item.value)}</span>
			</div>
		{/each}
	</div>

	<div class="border-t border-slate-200 pt-4">
		<div class="flex justify-between items-center">
			<span class="font-bold text-text-dark">Total Brutto</span>
			<span class="text-2xl font-bold text-primary">{formatCurrency(costs.total_brutto)}</span>
		</div>
	</div>
</Card>
