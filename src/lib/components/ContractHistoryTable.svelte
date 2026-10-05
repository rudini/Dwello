<script lang="ts">
	import Card from './Card.svelte';
	import StatusBadge from './StatusBadge.svelte';
	import type { ContractHistory } from '../types';
	import { formatCurrency } from '$lib/utils/format';
	import { contractBadges } from '$lib/contract-status';

	// On an apartment page each contract is named by its tenant, on a tenant page by its apartment
	let { contracts, by = 'tenant' }: { contracts: ContractHistory[]; by?: 'tenant' | 'apartment' } =
		$props();

	const party = (contract: ContractHistory) =>
		by === 'tenant' ? contract.tenantName : contract.apartment;
	const headerClass =
		'text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-text-secondary';
</script>

<Card>
	<h3 class="text-lg font-bold text-text-dark mb-6">Mietvertragshistorie</h3>

	{#if contracts.length === 0}
		<p class="text-sm text-text-secondary" data-testid="contract-history-empty">
			Noch keine Mietverträge.
		</p>
	{:else}
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead>
					<tr class="border-b border-slate-200">
						<th class="{headerClass} px-0">{by === 'tenant' ? 'Mieter' : 'Wohnung'}</th>
						<th class={headerClass}>Zeitraum</th>
						<th class={headerClass}>Mietzins (brutto)</th>
						<th class={headerClass}>Status</th>
					</tr>
				</thead>
				<tbody>
					{#each contracts as contract (contract.id)}
						<tr
							class="border-b border-slate-100 hover:bg-slate-50 transition-colors"
							data-testid="contract-history-row"
						>
							<td class="py-4 px-0">
								<a
									href="/contracts/{contract.id}"
									class="text-sm font-medium text-text-dark hover:text-primary"
									data-testid="contract-history-link">{party(contract)}</a
								>
							</td>
							<td class="py-4 px-4 text-sm text-text-dark">{contract.period}</td>
							<td class="py-4 px-4 text-sm font-medium text-text-dark"
								>{formatCurrency(contract.rentBrutto)}</td
							>
							<td class="py-4 px-4">
								<StatusBadge {...contractBadges[contract.status]} />
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</Card>
