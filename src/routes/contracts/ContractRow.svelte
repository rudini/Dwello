<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { contractPeriod, statusBadges } from '$lib/contract-status';
	import type { ContractWithDetails } from '$lib/types';
	import Badge from '$lib/ui/Badge.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { formatCurrency } from '$lib/utils/format';

	// One contract in the list: the tenant's name opens it, the whole row is its link; its status from the backend
	let { contract }: { contract: ContractWithDetails } = $props();

	const status = $derived(contract.status);
	const badge = $derived(statusBadges[status]);
</script>

<li
	class="relative flex flex-col gap-2 px-6 py-4 hover:bg-sunken md:flex-row md:items-center md:gap-6"
	data-testid="contract-row-{contract.id}"
>
	<div class="flex flex-col gap-1 md:w-1/4">
		<a
			href="/contracts/{contract.id}"
			class="font-semibold text-accent underline underline-offset-4 after:absolute after:inset-0"
			data-testid="contract-view-button">{contract.tenantName}</a
		>
		<span class="text-ink-muted"
			>{m.buildings_apartment_number({ number: contract.apartmentNumber })} · {contract.buildingName}</span
		>
	</div>
	<div class="flex flex-col items-start gap-1 md:flex-1">
		<Badge tone={badge.tone} label={badge.label} />
		<span class="tabular-nums text-ink"
			>{contractPeriod(contract.startDate, contract.endDate, status, contract.terminated)}</span
		>
		<!-- after the Vertragsdauer, not read as one phrase with it (persona Helga #211) -->
		{#if contract.missingStatement}
			<Badge
				tone="caution"
				label={m.contracts_missing_statement_badge()}
				testid="contract-missing-statement-badge"
			/>
		{/if}
	</div>
	<dl class="flex flex-col gap-1 tabular-nums md:items-end">
		<div class="flex gap-2">
			<dt class="text-ink-muted">{m.common_net_rent()}</dt>
			<dd class="font-semibold text-ink">{formatCurrency(Number(contract.baseRent))}</dd>
		</div>
		<div class="flex gap-2">
			<dt class="text-ink-muted">{m.common_monthly_total()}</dt>
			<dd class="text-ink">{formatCurrency(contract.totalRent)}</dd>
		</div>
	</dl>
	<div class="relative self-start md:self-auto">
		<Button
			variant="ghost"
			href="/contracts/{contract.id}/edit"
			icon="edit"
			ariaLabel={m.contracts_edit_aria({ name: contract.tenantName })}
			testid="contract-edit-button">{m.buildings_edit()}</Button
		>
	</div>
</li>
