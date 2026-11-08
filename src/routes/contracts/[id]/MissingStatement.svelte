<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { periodName } from '$lib/accounting-period';

	// no href: an older statement of the building overlaps the period, to bill outside Dwello (code review 1088-3 C-9)
	type Missing = { start: string; end: string; href: string | null; invoices: { href: string; label: string } };
	// Ended Abrechnungsperioden of the building with rent days but no statement, the newest first, each with its way to
	// the wizard (A-10, #142) and to the building's invoices (#211); whole periods only (#1088)
	let { missing }: { missing: Missing[] } = $props();

	const single = $derived(missing.length === 1);
	const title = $derived(
		single
			? m.contracts_statement_missing({ period: periodName(missing[0]) })
			: m.contracts_statements_missing({ count: missing.length })
	);
	// the wizard only where a period leads to it (code review 1088-4 C-12)
	const text = $derived(
		!missing.some((period) => period.href)
			? ''
			: single
				? m.contracts_statement_missing_text()
				: m.contracts_statements_missing_text()
	);
	// several: each label with its verb and period (#142 personas, code review C-8)
	const createLabel = (period: Missing) =>
		single ? m.dashboard_create_statements() : m.contracts_statement_create({ period: periodName(period) });
</script>

{#if missing.length}
	<Alert tone="caution" {title} testid="contract-missing-statement">
		{#if text}<p>{text}</p>{/if}
		<p>{m.contracts_statement_missing_billed_elsewhere()}</p>
		<!-- each period's links on their own row (personas Helga P-4, Anna P-5 #211), across its full width (#741) -->
		<div class="flex flex-col gap-2">
			<!-- the oldest first, as the text asks (#741, persona Marco P-1) -->
			{#each missing.toReversed() as period (period.start)}
				<div class="flex flex-col gap-2" data-testid="contract-missing-statement-period-{period.start}">
					{#if period.href}
						<Button
							href={period.href}
							icon="calculate"
							full
							testid="contract-missing-statement-link-{period.start}">{createLabel(period)}</Button
						>
					{:else}
						<p data-testid="contract-missing-statement-outside-{period.start}">
							{m.contracts_statement_missing_outside()}
						</p>
					{/if}
					<Button
						href={period.invoices.href}
						variant="ghost"
						icon="invoice"
						full
						testid="contract-missing-statement-invoices-{period.start}"
						>{period.invoices.label}</Button
					>
				</div>
			{/each}
		</div>
	</Alert>
{/if}
