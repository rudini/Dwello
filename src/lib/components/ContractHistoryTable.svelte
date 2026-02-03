<script lang="ts">
	import Card from './Card.svelte';
	import StatusBadge from './StatusBadge.svelte';
	import Icon from './Icon.svelte';
	import type { ContractHistory } from '../types';

	interface Props {
		contracts: ContractHistory[];
	}

	let { contracts }: Props = $props();

	function formatCurrency(value: number): string {
		return new Intl.NumberFormat('de-CH', {
			style: 'currency',
			currency: 'CHF',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(value);
	}

	function getInitials(firstName: string, lastName: string): string {
		return `${firstName[0]}${lastName[0]}`.toUpperCase();
	}
</script>

<Card>
	<div class="flex justify-between items-center mb-6">
		<h3 class="text-lg font-bold text-text-dark">Mietvertragshistorie</h3>
		<button type="button" class="text-sm text-primary hover:underline font-medium">Alle anzeigen</button>
	</div>

	<div class="overflow-x-auto">
		<table class="w-full">
			<thead>
				<tr class="border-b border-slate-200">
					<th class="text-left py-3 px-0 text-xs font-semibold uppercase tracking-wide text-text-secondary"
						>MIETER</th
					>
					<th class="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-text-secondary"
						>ZEITRAUM</th
					>
					<th class="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-text-secondary"
						>MIETZINS (BRUTTO)</th
					>
					<th class="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-text-secondary"
						>STATUS</th
					>
					<th class="text-right py-3 px-4"></th>
				</tr>
			</thead>
			<tbody>
				{#each contracts as contract (contract.id)}
					<tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
						<td class="py-4 px-0">
							<div class="flex items-center gap-3">
								<div
									class="w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white text-xs font-semibold"
								>
									{getInitials(contract.tenantFirstName, contract.tenantLastName)}
								</div>
								<div>
									<p class="text-sm font-medium text-text-dark">{contract.tenantName}</p>
									<p class="text-xs text-text-secondary">Privat</p>
								</div>
							</div>
						</td>
						<td class="py-4 px-4">
							<p class="text-sm text-text-dark">{contract.period}</p>
						</td>
						<td class="py-4 px-4">
							<p class="text-sm font-medium text-text-dark">{formatCurrency(contract.rentBrutto)}</p>
						</td>
						<td class="py-4 px-4">
							<StatusBadge status={contract.isActive ? 'AKTIV' : 'Beendet'} variant={contract.isActive ? 'success' : 'gray'} />
						</td>
						<td class="py-4 px-4">
							<button
								class="text-slate-400 hover:text-text-secondary transition-colors p-1"
								aria-label="More options"
							>
								<Icon name="more_vert" size={18} />
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="mt-6 text-center">
		<p class="text-xs text-text-secondary">
			<Icon name="info" size={14} class="inline mr-1" />
			Archiv älter als 2015 anzeigen
		</p>
	</div>
</Card>
