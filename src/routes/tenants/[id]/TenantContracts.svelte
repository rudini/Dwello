<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { historyPeriod, statusBadges } from '$lib/contract-status';
	import type { ContractHistory } from '$lib/types';
	import Badge from '$lib/ui/Badge.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import { formatCurrency } from '$lib/utils/format';

	// All contracts of the tenant, each opened by its apartment
	let { contracts }: { contracts: ContractHistory[] } = $props();
</script>

<Panel title={m.nav_contracts()}>
	{#if contracts.length === 0}
		<p class="text-ink-muted" data-testid="contract-history-empty">{m.common_no_contracts()}</p>
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
						data-testid="contract-history-link"
						>{m.tenants_contract_of({ apartment: contract.apartment ?? '' })}</a
					>
					<span><Badge {...statusBadges[contract.status]} /></span>
					<span class="tabular-nums text-ink sm:flex-1">{historyPeriod(contract)}</span>
					<span class="tabular-nums text-ink"
						>{formatCurrency(contract.monthlyTotal)}
						<span class="text-ink-muted">{m.common_monthly_total_suffix()}</span></span
					>
				</li>
			{/each}
		</ul>
	{/if}
</Panel>
