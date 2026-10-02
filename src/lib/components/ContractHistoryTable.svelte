<script lang="ts">
	import Card from './Card.svelte';
	import StatusBadge from './StatusBadge.svelte';
	import type { ContractHistory } from '../types';
	import { formatCurrency } from '$lib/utils/format';

	let { contracts }: { contracts: ContractHistory[] } = $props();

	const initials = (name: string) =>
		name
			.split(' ')
			.map((word) => word[0])
			.join('')
			.slice(0, 2)
			.toUpperCase();
	const badge = (contract: ContractHistory) =>
		contract.isActive
			? ({ status: 'AKTIV', variant: 'success' } as const)
			: ({ status: 'Beendet', variant: 'gray' } as const);
	const headerClass = 'text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-text-secondary';
</script>

<Card>
	<h3 class="text-lg font-bold text-text-dark mb-6">Mietvertragshistorie</h3>

	{#if contracts.length === 0}
		<p class="text-sm text-text-secondary" data-testid="contract-history-empty">Noch keine Mietverträge.</p>
	{:else}
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead>
					<tr class="border-b border-slate-200">
						<th class="{headerClass} px-0">Mieter</th>
						<th class={headerClass}>Zeitraum</th>
						<th class={headerClass}>Mietzins (brutto)</th>
						<th class={headerClass}>Status</th>
					</tr>
				</thead>
				<tbody>
					{#each contracts as contract (contract.id)}
						<tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors" data-testid="contract-history-row">
							<td class="py-4 px-0">
								<a href="/contracts/{contract.id}" class="flex items-center gap-3" data-testid="contract-history-link">
									<span
										class="w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white text-xs font-semibold"
									>
										{initials(contract.tenantName)}
									</span>
									<span class="text-sm font-medium text-text-dark hover:text-primary">{contract.tenantName}</span>
								</a>
							</td>
							<td class="py-4 px-4 text-sm text-text-dark">{contract.period}</td>
							<td class="py-4 px-4 text-sm font-medium text-text-dark">{formatCurrency(contract.rentBrutto)}</td>
							<td class="py-4 px-4">
								<StatusBadge {...badge(contract)} />
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</Card>
