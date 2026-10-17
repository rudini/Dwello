<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { historyPeriod, statusBadges } from '$lib/contract-status';
	import type { ContractHistory } from '$lib/types';
	import { formatCurrency } from '$lib/utils/format';
	import Badge from '$lib/ui/Badge.svelte';
	import Panel from '$lib/ui/Panel.svelte';

	// Every rental contract of the apartment, latest first: the running or future ones on top, the ended ones below as
	// its history (A-8, #117); a whole row opens the contract, named by its tenant
	let { contracts }: { contracts: ContractHistory[] } = $props();

	const current = $derived(contracts.filter((c) => c.status !== 'ended'));
	const earlier = $derived(contracts.filter((c) => c.status === 'ended'));
</script>

{#snippet rows(list: ContractHistory[])}
	<ul class="flex flex-col divide-y divide-line">
		{#each list as contract (contract.id)}
			<li
				class="relative flex flex-wrap items-center justify-between gap-4 py-4 hover:bg-sunken"
				data-testid="contract-history-row"
			>
				<div class="flex flex-col gap-2">
					<a
						href="/contracts/{contract.id}"
						class="break-words font-semibold text-accent underline underline-offset-4 after:absolute after:inset-0 hover:text-accent-strong"
						data-testid="contract-history-link"
						>{m.apartments_contract_of({ name: contract.tenantName })}</a
					>
					<span class="text-ink-muted">{historyPeriod(contract)}</span>
					<span class="tabular-nums text-ink"
						>{formatCurrency(contract.monthlyTotal)}
						<span class="text-ink-muted">{m.common_monthly_total_suffix()}</span></span
					>
				</div>
				<div class="flex flex-col items-start gap-2">
					<Badge {...statusBadges[contract.status]} />
					{#if contract.status === 'ended'}
						<span class="text-ink-muted">{m.apartments_contract_history_help()}</span>
					{/if}
				</div>
			</li>
		{/each}
	</ul>
{/snippet}

<Panel title={m.apartments_contracts_title()}>
	{#if contracts.length === 0}
		<p class="text-ink-muted" data-testid="contract-history-empty">{m.common_no_contracts()}</p>
	{:else}
		{#if current.length}
			<div data-testid="contract-history-current">{@render rows(current)}</div>
		{/if}
		{#if earlier.length}
			<section class="flex flex-col gap-2" data-testid="contract-history-earlier">
				<h3 class="text-lg font-semibold text-ink">{m.apartments_contracts_earlier()}</h3>
				{@render rows(earlier)}
			</section>
		{/if}
	{/if}
</Panel>
