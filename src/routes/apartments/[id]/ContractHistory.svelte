<script lang="ts">
	import type { ContractHistory } from '$lib/types';
	import { formatCurrency } from '$lib/utils/format';
	import Badge from '$lib/ui/Badge.svelte';
	import Panel from '$lib/ui/Panel.svelte';

	// Every rental contract of the apartment; a whole row opens the contract, named by its tenant
	let { contracts }: { contracts: ContractHistory[] } = $props();

	// Vertragsstatus (UBIQUITOUS_LANGUAGE.md)
	const badges = {
		active: { label: 'Laufend', tone: 'positive' },
		future: { label: 'Künftig', tone: 'info' },
		ended: { label: 'Beendet', tone: 'neutral' }
	} as const;
</script>

<Panel title="Mietverträge der Wohnung">
	{#if contracts.length === 0}
		<p class="text-ink-muted" data-testid="contract-history-empty">Noch keine Mietverträge.</p>
	{:else}
		<ul class="flex flex-col divide-y divide-line">
			{#each contracts as contract (contract.id)}
				<li
					class="relative flex flex-wrap items-center justify-between gap-4 py-4 hover:bg-sunken"
					data-testid="contract-history-row"
				>
					<div class="flex flex-col gap-2">
						<a
							href="/contracts/{contract.id}"
							class="break-words font-semibold text-accent underline underline-offset-4 after:absolute after:inset-0 hover:text-accent-strong"
							data-testid="contract-history-link">{contract.tenantName}</a
						>
						<span class="text-ink-muted">{contract.period}</span>
						<span class="tabular-nums text-ink"
							>{formatCurrency(contract.rentBrutto)} pro Monat</span
						>
					</div>
					<Badge {...badges[contract.status]} />
				</li>
			{/each}
		</ul>
	{/if}
</Panel>
