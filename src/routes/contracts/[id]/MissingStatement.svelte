<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { formatDate } from '$lib/utils/format';

	// Rent days in ended Abrechnungsperioden without a statement, the newest first, each with its way to the wizard
	// (A-10, #142)
	let { missing }: { missing: { start: string; end: string; href: string }[] } = $props();

	// a calendar year by its number, a period across the turn of the year by its two days
	function periodOf({ start, end }: { start: string; end: string }) {
		const year = start.slice(0, 4);
		return start === `${year}-01-01` && end === `${year}-12-31`
			? year
			: `${formatDate(start)} – ${formatDate(end)}`;
	}

	const single = $derived(missing.length === 1);
</script>

{#if missing.length}
	<Alert
		tone="caution"
		title={single
			? m.contracts_statement_missing({ period: periodOf(missing[0]) })
			: m.contracts_statements_missing({ count: missing.length })}
		testid="contract-missing-statement"
	>
		<p>{single ? m.contracts_statement_missing_text() : m.contracts_statements_missing_text()}</p>
		<div class="flex flex-wrap gap-2">
			{#each missing as period (period.start)}
				<Button
					href={period.href}
					icon="calculate"
					variant={single ? undefined : 'secondary'}
					testid="contract-missing-statement-link-{period.start}"
					>{single
						? m.dashboard_create_statements()
						: m.contracts_statement_create({ period: periodOf(period) })}</Button
				>
			{/each}
		</div>
	</Alert>
{/if}
