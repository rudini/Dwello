<script lang="ts">
	import { contractPeriod, statusBadges } from '$lib/contract-status';
	import type { ContractHistory } from '$lib/types';
	import Badge from '$lib/ui/Badge.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import { formatCurrency } from '$lib/utils/format';

	// All contracts of the tenant, each opened by its apartment
	let { contracts }: { contracts: ContractHistory[] } = $props();
</script>

<Panel title="Mietverträge">
	{#if contracts.length === 0}
		<p class="text-ink-muted" data-testid="contract-history-empty">Noch keine Mietverträge.</p>
	{:else}
		<ul class="flex flex-col divide-y divide-line">
			{#each contracts as contract (contract.id)}
				<li
					class="relative flex flex-col gap-2 py-4 hover:bg-sunken sm:flex-row sm:items-center sm:gap-6"
					data-testid="contract-history-row"
				>
					<a
						href="/contracts/{contract.id}"
						class="font-semibold text-accent underline underline-offset-4 after:absolute after:inset-0 sm:w-1/4"
						data-testid="contract-history-link">Mietvertrag {contract.apartment}</a
					>
					<span><Badge {...statusBadges[contract.status]} /></span>
					<span class="tabular-nums text-ink sm:flex-1"
						>{contractPeriod(
							contract.startDate,
							contract.endDate,
							contract.status,
							contract.terminated
						)}</span
					>
					<!-- TODO(fachlich prüfen): no glossary term for the monthly total, as in the contract wizard -->
					<span class="tabular-nums text-ink"
						>{formatCurrency(contract.rentBrutto)}
						<span class="text-ink-muted">monatlich total</span></span
					>
				</li>
			{/each}
		</ul>
	{/if}
</Panel>
