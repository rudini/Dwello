<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { contractEnd, statusBadges } from '$lib/contract-status';
	import type { ContractHistory } from '$lib/types';
	import Badge from '$lib/ui/Badge.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import AdvancePeriods from './AdvancePeriods.svelte';
	import { formatCurrency, formatDate } from '$lib/utils/format';

	// From when to when, and what the tenant pays each month
	let {
		startDate,
		endDate,
		terminated,
		noticeReceivedOn,
		billedUntil,
		status,
		rent,
		fee,
		agreedCosts,
		advancePayments = [],
		advanceDelete = null
	}: {
		startDate: string;
		endDate?: string | null;
		terminated?: boolean;
		noticeReceivedOn?: string | null;
		billedUntil?: string | null; // «Abgerechnet bis» (#133)
		status: ContractHistory['status'];
		rent: {
			baseRent: number;
			additionalRent: number;
			advancePayment: number;
			flatRateUtilityCharge: number; // «Nebenkostenpauschale» (#429)
			total: number;
		};
		fee: string; // «Verwaltungspauschale» in words (#89)
		agreedCosts: string[] | null; // the agreed Nebenkosten (#91); null when the categories could not be loaded
		advancePayments?: { validFrom: string; amount: string }[]; // each Akonto with its «Gültig ab» (#464)
		advanceDelete?: { validFrom: string; error: string } | null; // a refused deletion, shown in its dialog
	} = $props();

	const amounts = $derived([
		[m.common_net_rent(), rent.baseRent, undefined],
		[m.common_advance_payment(), rent.advancePayment, undefined],
		[m.common_flat_rate_utility_charge(), rent.flatRateUtilityCharge, 'contract-flat-rate'],
		[m.common_additional_rent(), rent.additionalRent, undefined]
	] as const);
</script>

<Panel title={m.contracts_period()}>
	<div>
		<Badge {...statusBadges[status]} testid="contract-status" />
	</div>
	<dl class="flex flex-col gap-4 tabular-nums">
		<div>
			<dt class="text-ink-muted">{m.tenants_contract_start()}</dt>
			<dd class="font-semibold text-ink">{formatDate(startDate)}</dd>
		</div>
		<div>
			<dt class="text-ink-muted">{m.dashboard_kind_contract_end()}</dt>
			<dd class="font-semibold text-ink" data-testid="contract-end-date">
				{contractEnd(endDate, terminated)}
			</dd>
		</div>
		{#if noticeReceivedOn}
			<div>
				<dt class="text-ink-muted">{m.contracts_notice_received()}</dt>
				<dd class="font-semibold text-ink" data-testid="contract-notice-received">
					{formatDate(noticeReceivedOn)}
				</dd>
			</div>
		{/if}
		{#if billedUntil}
			<div>
				<dt class="text-ink-muted">{m.contracts_billed_until()}</dt>
				<dd class="font-semibold text-ink" data-testid="contract-billed-until">
					{formatDate(billedUntil)}
				</dd>
			</div>
		{/if}
		<div>
			<dt class="text-ink-muted">{m.contracts_fee_label()}</dt>
			<dd class="font-semibold text-ink" data-testid="contract-management-fee">{fee}</dd>
		</div>
		{#if agreedCosts}
			<div>
				<dt class="text-ink-muted">{m.contracts_agreed_costs_label()}</dt>
				<dd class="font-semibold text-ink" data-testid="contract-agreed-costs">
					{agreedCosts.join(', ') || m.contracts_agreed_costs_none()}
				</dd>
			</div>
		{/if}
	</dl>
</Panel>

<Panel title={m.contracts_rent_per_month()}>
	<dl class="flex flex-col divide-y divide-line tabular-nums">
		{#each amounts as [label, amount, testid] (label)}
			<div class="flex justify-between gap-4 py-2">
				<dt class="text-ink-muted">{label}</dt>
				<dd class="text-ink" data-testid={testid}>{formatCurrency(amount)}</dd>
			</div>
		{/each}
		<div class="flex justify-between gap-4 py-2 text-lg">
			<dt class="font-semibold text-ink">{m.common_monthly_total()}</dt>
			<dd class="font-bold text-ink" data-testid="contract-total-rent">
				{formatCurrency(rent.total)}
			</dd>
		</div>
	</dl>
	<AdvancePeriods {startDate} {endDate} {advancePayments} {advanceDelete} />
</Panel>
