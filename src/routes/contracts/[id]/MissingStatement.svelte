<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { periodDays, periodName } from '$lib/accounting-period';

	type Missing = {
		start: string;
		end: string;
		href: string | null; // none when step 2 would refuse its period (Fachreview 199-1 V-1)
		way: { kind: string; start: string; end: string };
		invoices: { href: string; label: string };
	};
	// Rent days in ended Abrechnungsperioden without a statement, the newest first, each with its way to the wizard
	// (A-10, #142): the whole period, the period of a statement of the building that holds the days, or a short
	// period for days no statement of the building covers (#199, #408 point 2); and to the building's invoices (#211)
	let { missing }: { missing: Missing[] } = $props();

	const single = $derived(missing.length === 1);
	const parts = $derived(missing.filter((period) => period.way.kind !== 'whole' || !period.href));
	const title = $derived(
		single
			? m.contracts_statement_missing({ period: periodName(missing[0]) })
			: m.contracts_statements_missing({ count: missing.length })
	);
	// the general text says «noch keine Nebenkostenabrechnung», untrue for a single part
	const text = $derived(
		single
			? !parts.length && m.contracts_statement_missing_text()
			: m.contracts_statements_missing_text()
	);
	// «Abgerechnet bis» (#133) would change the statement that covers the rest (Fachreview 2 V-9)
	const hint = $derived(
		parts.length
			? m.contracts_statement_missing_partial({ periods: parts.map(periodName).join(', ') })
			: single
				? m.contracts_statement_missing_billed_elsewhere()
				: m.contracts_statements_missing_billed_elsewhere()
	);
	const firstShort = $derived(missing.find((period) => period.href && period.way.kind === 'short'));
	// several: short labels side by side, each with its verb (#142 personas, code review C-8)
	const createLabel = ({ way, ...period }: Missing) =>
		way.kind === 'existing'
			? m.statements_period_choose({ period: periodDays(way) })
			: way.kind === 'short'
				? m.statements_period_short({ period: periodDays(way) })
				: single
					? m.dashboard_create_statements()
					: m.contracts_statement_create({ period: periodName(period) });
</script>

{#if missing.length}
	<Alert tone="caution" {title} testid="contract-missing-statement">
		{#if text}<p>{text}</p>{/if}
		<p>{hint}</p>
		<!-- each period's links on their own row (personas Helga P-4, Anna P-5 #211) -->
		<div class="flex flex-col gap-2">
			{#each missing as period (period.start)}
				<div
					class="flex flex-wrap gap-2"
					data-testid="contract-missing-statement-period-{period.start}"
				>
					{#if period.href}
						<Button
							href={period.href}
							icon="calculate"
							testid="contract-missing-statement-link-{period.start}">{createLabel(period)}</Button
						>
					{/if}
					<Button
						href={period.invoices.href}
						variant="ghost"
						icon="invoice"
						testid="contract-missing-statement-invoices-{period.start}"
						>{period.invoices.label}</Button
					>
					<!-- #486: the Abrechnungsperiode may be part of the Mietvertrag; said at the short period, not at an
					     earlier one (#512, Fachreview 512-1 V-2) -->
					{#if period === firstShort}
						<p class="w-full" data-testid="contract-missing-statement-short-help">
							{m.statements_short_period_help()}
						</p>
					{/if}
				</div>
			{/each}
		</div>
	</Alert>
{/if}
