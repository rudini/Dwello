<script lang="ts">
	import type { Reconciliation } from '$lib/cost-reconciliation';
	import { m } from '$lib/paraglide/messages';
	import Button from '$lib/ui/Button.svelte';
	import { formatCurrency, formatDate } from '$lib/utils/format';

	// #1464 (PO 22.11.2026): under a position, collapsed at first, what its «Kosten des Gebäudes» is calculated from:
	// each Rechnung with its part in the period (a link to it), around them the Anfangs- and Endbestand of a tank
	type Row = Reconciliation['nonAllocableRows'][number];
	let { position, rows, back }: { position: string; rows: Row[]; back?: string } = $props();
	let open = $state(false);
	const id = $props.id(); // names the detail and the amount a Rechnung's link is described by (persona Sven 1464 P-2)
	const cell = 'cost-reconciliation-invoice-cell';

	function line(row: Row) {
		if (row.kind !== 'invoice')
			return {
				href: null,
				name: { opening: m.reconciliation_stock_opening, closing: m.reconciliation_stock_closing }[
					row.kind
				](),
				detail: m.reconciliation_stock_date({ date: formatDate(row.date) }),
				amount: row.amount
			};
		const { beyond } = row;
		return {
			href: `/invoices/${row.id}${back ? `?returnTo=${encodeURIComponent(back)}` : ''}`,
			name: m.reconciliation_invoice_name({
				issuer: row.billingEntityName,
				date: formatDate(row.invoiceDate)
			}),
			detail: beyond
				? m.reconciliation_invoice_part({
						amount: formatCurrency(row.amount),
						start: formatDate(beyond.start),
						end: formatDate(beyond.end),
						days: beyond.days,
						total: beyond.ofDays
					})
				: m.reconciliation_invoice_whole(),
			amount: row.inPeriod
		};
	}
	const lines = $derived(rows.map(line));
	const control = $derived(
		open
			? { label: m.reconciliation_invoices_hide(), name: m.reconciliation_invoices_hide_of }
			: { label: m.reconciliation_invoices_show(), name: m.reconciliation_invoices_show_of }
	);
</script>

<div class="flex flex-col items-start gap-2" data-testid="cost-reconciliation-invoices">
	<Button
		variant="ghost"
		expanded={open}
		ariaLabel={control.name({ position })}
		onclick={() => (open = !open)}
	>
		<span data-testid="cost-reconciliation-toggle-label">{control.label}</span>
	</Button>
	{#if open}
		<ul class="flex w-full flex-col divide-y divide-line rounded-control border border-line">
			{#each lines as line, i (i)}
				<li
					class="relative flex flex-wrap justify-between gap-x-4 gap-y-1 p-4 text-left font-normal tabular-nums"
				>
					<span class="flex min-w-0 flex-col break-words">
						{#if line.href}
							<a
								href={line.href}
								aria-describedby="{id}-detail-{i} {id}-amount-{i}"
								class="font-semibold text-accent underline underline-offset-4 after:absolute after:inset-0"
								data-testid={cell}>{line.name}</a
							>
						{:else}
							<span class="font-semibold text-ink" data-testid={cell}>{line.name}</span>
						{/if}
						<span id="{id}-detail-{i}" class="text-ink-muted" data-testid={cell}>{line.detail}</span
						>
					</span>
					<span id="{id}-amount-{i}" class="ml-auto whitespace-nowrap text-ink" data-testid={cell}
						>{formatCurrency(line.amount)}</span
					>
				</li>
			{:else}
				<li class="p-4 text-ink-muted" data-testid="cost-reconciliation-no-invoice">
					{m.reconciliation_no_invoice()}
				</li>
			{/each}
		</ul>
	{/if}
</div>
