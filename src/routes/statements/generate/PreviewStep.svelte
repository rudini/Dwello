<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { balanceLabel } from '$lib/statement';
	import { akontoHint, invoiceRows } from '$lib/statement-wizard';
	import Icon from '$lib/ui/Icon.svelte';
	import { formatCurrency } from '$lib/utils/format';
	import PreviewChecks from './PreviewChecks.svelte';
	import PreviewEmpty from './PreviewEmpty.svelte';
	import type { PreviewRow } from './preview';

	// Step 4: what each rental contract will get, and the invoices behind it; missing invoices are flagged
	let {
		previewRows,
		invoices,
		buildings,
		periodLabel,
		period,
		heatingProfile,
		feePercent,
		confirmed = $bindable(),
		errors
	}: {
		previewRows: PreviewRow[];
		invoices: Parameters<typeof invoiceRows>[0];
		buildings: { id: string; name: string }[];
		periodLabel: string;
		period: { periodStart: string; periodEnd: string };
		heatingProfile?: string; // what step 3 chose, to check before creating
		feePercent: number;
		confirmed: boolean;
		errors: Record<string, string>;
	} = $props();

	const total = $derived(previewRows.reduce((sum, row) => sum + row.totalCosts, 0));
	const rows = $derived(invoiceRows(invoices, buildings, period));
	const billed = $derived(rows.filter((row) => row.existing > 0));
	// Saldo > 0: the tenant pays the difference, < 0: the tenant gets it back, 0: Ausgeglichen
	const saldo = (balance: number) =>
		`${balanceLabel(balance)} ${formatCurrency(Math.abs(balance))}`;
</script>

<dl class="grid gap-4 sm:grid-cols-3">
	<div class="flex flex-col gap-1 rounded-panel bg-sunken p-4">
		<dt class="text-ink-muted">{m.glossary_period_term()}</dt>
		<dd class="font-semibold text-ink">{periodLabel}</dd>
	</div>
	<div class="flex flex-col gap-1 rounded-panel bg-sunken p-4">
		<dt class="text-ink-muted">{m.statements_count_label()}</dt>
		<dd class="font-semibold tabular-nums text-ink" data-testid="preview-count">
			{previewRows.length}
		</dd>
	</div>
	<div class="flex flex-col gap-1 rounded-panel bg-sunken p-4">
		<dt class="text-ink-muted">{m.statements_all_costs()}</dt>
		<dd class="font-semibold tabular-nums text-ink">{formatCurrency(total)}</dd>
		<!-- Glossary (Vermieter, Proration): the landlord bears the costs of vacancy -->
		<dd class="text-ink-muted">{m.statements_vacancy_note()}</dd>
	</div>
	{#if heatingProfile}
		<div class="flex flex-col gap-1 rounded-panel bg-sunken p-4">
			<dt class="text-ink-muted">{m.glossary_profile_term()}</dt>
			<dd class="font-semibold text-ink" data-testid="preview-heating-profile">{heatingProfile}</dd>
		</div>
	{/if}
	<div class="flex flex-col gap-1 rounded-panel bg-sunken p-4">
		<dt class="text-ink-muted">{m.glossary_fee_term()}</dt>
		<dd class="font-semibold text-ink" data-testid="preview-fee">
			{m.statements_fee_of_own({ percent: feePercent })}
		</dd>
	</div>
</dl>

<section aria-labelledby="invoices-heading" class="flex flex-col gap-2">
	<h3 id="invoices-heading" class="text-xl font-bold text-ink">
		{m.statements_invoices_in_period()}
	</h3>
	<ul class="flex flex-col divide-y divide-line">
		{#each rows as row (row.buildingId)}
			<li class="flex flex-wrap justify-between gap-x-4 py-2" data-testid="preview-invoices">
				<span class="font-semibold text-ink">{row.name}</span>
				<span class={row.missing ? 'font-semibold text-critical' : 'text-ink-muted'}
					>{row.text}</span
				>
			</li>
		{/each}
	</ul>
</section>

{#if previewRows.length}
	<PreviewChecks {rows} {period} bind:confirmed error={errors.confirm} />
{/if}

<section aria-labelledby="statements-heading" class="flex flex-col gap-2">
	<h3 id="statements-heading" class="text-xl font-bold text-ink">
		{m.statements_per_contract()}
	</h3>
	{#if previewRows.length === 0}
		<PreviewEmpty {billed} error={errors.preview} />
	{:else}
		<!-- a list instead of a table: readable on phones without scrolling sideways -->
		<ul class="flex flex-col divide-y divide-line">
			{#each previewRows as row (row.contractId)}
				{@const hint = akontoHint(row)}
				<li
					class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2"
					data-testid="preview-row"
				>
					<span class="flex flex-col">
						<span class="font-semibold text-ink">{row.tenantName}</span>
						<span class="text-ink-muted"
							>{m.buildings_apartment_number({ number: row.apartmentNumber })}</span
						>
					</span>
					<span class="flex flex-col text-right tabular-nums">
						<span class="text-ink"
							>{m.statements_costs_amount({ amount: formatCurrency(row.totalCosts) })}</span
						>
						<span class="font-semibold text-ink">{saldo(row.balance)}</span>
						{#if hint}
							<span
								class="flex items-center justify-end gap-2 text-caution"
								data-testid="preview-akonto-hint"
							>
								<Icon name="warning" />{hint}
							</span>
						{/if}
					</span>
				</li>
			{/each}
		</ul>
	{/if}
</section>
