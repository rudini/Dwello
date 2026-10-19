<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { StatementWithDetails } from '$lib/types';
	import { balanceLabel } from '$lib/statement';
	import Table from '$lib/ui/Table.svelte';
	import { formatCurrency } from '$lib/utils/format';
	import { getLocale } from '$lib/paraglide/runtime';
	import LineInvoices from './LineInvoices.svelte';

	// The costs line by line, then the Verwaltungspauschale, the Akonto and what remains: the Saldo
	let { statement }: { statement: StatementWithDetails } = $props();

	const subtotal = $derived(statement.lineItems.reduce((sum, item) => sum + item.tenantShare, 0));
	// The Saldo goes to 5 Rappen. As in the PDF: the amount before, its rounding seen from the amount shown (a refund
	// that grows gets +), the Saldo; only a real rounding (under 5 Rappen)
	const cents = (amount: number) => Math.round(amount * 100) / 100;
	// a berichtigte Abrechnung also offsets what was paid on the statements it replaced (#120); a refund paid counts negative
	const prior = $derived(statement.priorPayments ?? 0);
	// TODO(fachlich prüfen, #362): «Bereits bezahlt» has its glossary row; the help texts follow
	const priorLabel = (numbers: string) =>
		prior > 0 ? m.statements_prior_paid({ numbers }) : m.statements_prior_refunded({ numbers });
	const unrounded = $derived(cents(statement.totalCosts - statement.totalAdvancePayments - prior));
	const rounding = $derived(
		Math.abs(statement.balance - unrounded) < 0.05
			? cents(Math.abs(statement.balance) - Math.abs(unrounded))
			: 0
	);
	// «+ CHF 0.02» for an amount that adds, «− CHF 0.02» for one that subtracts
	const signed = (adds: boolean, amount: number) =>
		`${adds ? '+' : '−'} ${formatCurrency(Math.abs(amount))}`;
	// between the Akonto and the Saldo: what was already paid, the amount before rounding and the rounding
	const adjustments = $derived([
		...(prior
			? [
					{
						testid: 'statement-prior-payments',
						label: priorLabel(
							new Intl.ListFormat(getLocale(), { type: 'conjunction' }).format(
								statement.priorPaidOn ?? []
							)
						),
						value: signed(prior < 0, prior)
					}
				]
			: []),
		...(rounding
			? [
					{
						testid: 'statement-rounding',
						label: m.statements_before_rounding({ balance: balanceLabel(unrounded) }),
						value: formatCurrency(Math.abs(unrounded))
					},
					{
						testid: 'statement-rounding',
						label: m.statements_rounding(),
						value: signed(rounding > 0, rounding)
					}
				]
			: [])
	]);
	// Wohnungsanteil and Zeitanteil as the PDF shows them: the Zeitanteil as days where it is one (#104)
	type Item = StatementWithDetails['lineItems'][number];
	const apartmentShare = (item: Item) =>
		item.apartmentShare == null ? '–' : formatCurrency(item.apartmentShare);
	const percent = (share: number) => `${(Math.round(share * 10000) / 100).toFixed(2)} %`;
	// as the PDF: the days rented of the period where the share is exactly that (a tenant over the whole period)
	const periodDays = $derived(
		Math.round((Date.parse(statement.periodEnd) - Date.parse(statement.periodStart)) / 86_400_000) + 1
	);
	const rentedShare = (item: Item) =>
		!item.byProfile &&
		!item.invoices.some((invoice) => invoice.part) &&
		Math.abs(item.periodShare! - statement.rentalDays / periodDays) < 0.00005;
	const timeShare = (item: Item) => {
		if (item.shareDays) return m.statements_share_days(item.shareDays);
		if (item.periodShare == null) return '–';
		if (rentedShare(item))
			return m.statements_share_days({ days: statement.rentalDays, total: periodDays });
		return item.byProfile
			? m.statements_time_share_profile({ percent: percent(item.periodShare) })
			: percent(item.periodShare);
	};
	const columns = [
		{ label: m.buildings_category() },
		{ label: m.glossary_key_term() },
		{ label: m.statements_building_costs(), numeric: true },
		{ label: m.statements_apartment_share(), numeric: true },
		{ label: m.statements_time_share(), numeric: true },
		{ label: m.statements_share(), numeric: true },
		{ label: m.invoices_amount(), numeric: true }
	];
</script>

{#if statement.lineItems.length === 0}
	<p class="text-ink-muted">{m.statements_no_lines()}</p>
{:else}
	<!-- Phones get the lines one below the other, every amount in view; the table from md -->
	<ul class="flex flex-col gap-4 md:hidden" aria-label={m.statements_lines()}>
		{#each statement.lineItems as item (item.id)}
			<li class="rounded-panel border border-line p-4" data-testid="statement-line-card">
				<dl class="grid grid-cols-2 gap-x-4 gap-y-2 tabular-nums">
					<dt class="text-ink-muted">{m.buildings_category()}</dt>
					<dd class="hyphens-auto break-words text-right font-semibold text-ink">
						{item.categoryName}
					</dd>
					<dt class="text-ink-muted">{m.glossary_key_term()}</dt>
					<dd class="hyphens-auto break-words text-right text-ink">
						{item.distributionKeyName}
					</dd>
					<dt class="text-ink-muted">{m.statements_building_costs()}</dt>
					<dd class="text-right text-ink">{formatCurrency(item.totalAmount)}</dd>
					<dt class="text-ink-muted">{m.statements_apartment_share()}</dt>
					<dd class="text-right text-ink">{apartmentShare(item)}</dd>
					<dt class="text-ink-muted">{m.statements_time_share()}</dt>
					<dd class="whitespace-nowrap text-right text-ink">{timeShare(item)}</dd>
					<dt class="text-ink-muted">{m.statements_share()}</dt>
					<dd class="whitespace-nowrap text-right text-ink">{item.percentage} %</dd>
					<dt class="text-ink-muted">{m.invoices_amount()}</dt>
					<dd class="text-right font-semibold text-ink">{formatCurrency(item.tenantShare)}</dd>
				</dl>
				<div class="mt-4"><LineInvoices {item} /></div>
			</li>
		{/each}
	</ul>

	<div class="hidden md:block">
		<Table caption={m.statements_lines()} captionHidden {columns}>
			{#each statement.lineItems as item (item.id)}
				<tr data-testid="statement-line-item">
					<td class="text-ink">{item.categoryName}</td>
					<td class="text-ink-muted">{item.distributionKeyName}</td>
					<td class="text-right text-ink-muted">{formatCurrency(item.totalAmount)}</td>
					<td class="text-right text-ink-muted">{apartmentShare(item)}</td>
					<td class="whitespace-nowrap text-right text-ink-muted">{timeShare(item)}</td>
					<td class="whitespace-nowrap text-right text-ink-muted">{item.percentage} %</td>
					<td class="text-right font-semibold text-ink">{formatCurrency(item.tenantShare)}</td>
				</tr>
				{#if item.invoices.length}
					<tr>
						<td colspan={columns.length}><LineInvoices {item} /></td>
					</tr>
				{/if}
			{/each}
		</Table>
	</div>
{/if}

<dl class="flex flex-col gap-2 tabular-nums">
	{#if statement.heatingProfileName}
		<div class="flex justify-between gap-4" data-testid="statement-heating-profile">
			<dt class="text-ink-muted">{m.glossary_profile_term()}</dt>
			<dd class="text-ink">{statement.heatingProfileName}</dd>
		</div>
	{/if}
	<div class="flex justify-between gap-4">
		<dt class="text-ink-muted">{m.statements_subtotal()}</dt>
		<dd class="text-ink">{formatCurrency(subtotal)}</dd>
	</div>
	<!-- like the PDF: no line without a fee (no Verwaltungspauschale agreed, #89) -->
	{#if Number(statement.managementFee) > 0}
		<div class="flex justify-between gap-4" data-testid="statement-management-fee">
			<dt class="flex flex-col text-ink-muted">
				<span>{m.glossary_fee_term()}</span>
				<!-- as the PDF says it: a share of the tenant's own costs -->
				<span>{m.statements_fee_of_subtotal({ percent: statement.managementFeePercent })}</span>
			</dt>
			<dd class="text-ink">{formatCurrency(statement.managementFee)}</dd>
		</div>
	{/if}
	<div class="flex justify-between gap-4 border-t border-line pt-2 font-semibold">
		<dt class="text-ink" data-testid="statement-total-costs-label">{m.statements_total_costs()}</dt>
		<dd class="text-ink">{formatCurrency(statement.totalCosts)}</dd>
	</div>
	<div class="flex justify-between gap-4">
		<dt class="text-ink-muted">{m.statements_advance_paid()}</dt>
		<dd class="whitespace-nowrap text-ink" data-testid="statement-advance-paid">
			− {formatCurrency(statement.totalAdvancePayments)}
		</dd>
	</div>
	{#each adjustments as row (row.label)}
		<!-- each pair directly in the list: a <dl> holds only groups of <dt> and <dd> -->
		<div class="flex justify-between gap-4" data-testid={row.testid}>
			<!-- the statement number may break: Firefox does not break it at its hyphens, so with the amount beside it the
			     row was wider than a 390 px screen (#424) -->
			<dt class="min-w-0 break-words text-ink-muted">{row.label}</dt>
			<dd class="whitespace-nowrap text-ink">{row.value}</dd>
		</div>
	{/each}
	<div
		class="flex justify-between gap-4 border-t border-line pt-2 text-lg font-bold"
		data-testid="statement-balance"
	>
		<dt class="text-ink">{m.statements_balance({ balance: balanceLabel(statement.balance) })}</dt>
		<dd class="text-ink">{formatCurrency(Math.abs(statement.balance))}</dd>
	</div>
</dl>
