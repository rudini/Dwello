<script lang="ts">
	import { contractEnd, statusBadges } from '$lib/contract-status';
	import type { ContractHistory } from '$lib/types';
	import Badge from '$lib/ui/Badge.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import { formatCurrency, formatDate } from '$lib/utils/format';

	// From when to when, and what the tenant pays each month
	let {
		startDate,
		endDate,
		terminated,
		status,
		rent
	}: {
		startDate: string;
		endDate?: string | null;
		terminated?: boolean;
		status: ContractHistory['status'];
		rent: { baseRent: number; additionalRent: number; advancePayment: number; total: number };
	} = $props();

	const amounts = $derived([
		['Nettomiete', rent.baseRent],
		['Akonto', rent.advancePayment],
		['Zusatzmiete', rent.additionalRent]
	] as const);
</script>

<Panel title="Vertragsdauer">
	<div>
		<Badge {...statusBadges[status]} testid="contract-status" />
	</div>
	<dl class="flex flex-col gap-4 tabular-nums">
		<div>
			<dt class="text-ink-muted">Vertragsbeginn</dt>
			<dd class="font-semibold text-ink">{formatDate(startDate)}</dd>
		</div>
		<div>
			<dt class="text-ink-muted">Vertragsende</dt>
			<dd class="font-semibold text-ink" data-testid="contract-end-date">
				{contractEnd(endDate, terminated)}
			</dd>
		</div>
	</dl>
</Panel>

<Panel title="Miete pro Monat">
	<dl class="flex flex-col divide-y divide-line tabular-nums">
		{#each amounts as [label, amount] (label)}
			<div class="flex justify-between gap-4 py-2">
				<dt class="text-ink-muted">{label}</dt>
				<dd class="text-ink">{formatCurrency(amount)}</dd>
			</div>
		{/each}
		<div class="flex justify-between gap-4 py-2 text-lg">
			<!-- TODO(fachlich prüfen): no glossary term for the monthly total, as in the contract wizard -->
			<dt class="font-semibold text-ink">Monatlich total</dt>
			<dd class="font-bold text-ink" data-testid="contract-total-rent">
				{formatCurrency(rent.total)}
			</dd>
		</div>
	</dl>
</Panel>
