<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { formatDate } from '$lib/utils/format';

	// Rent days in the last ended Abrechnungsperiode without a statement, and the way to the wizard (A-10)
	let { missing }: { missing: { start: string; end: string; href: string } | null } = $props();

	// a calendar year by its number, a period across the turn of the year by its two days
	function periodOf({ start, end }: { start: string; end: string }) {
		const year = start.slice(0, 4);
		return start === `${year}-01-01` && end === `${year}-12-31`
			? year
			: `${formatDate(start)} – ${formatDate(end)}`;
	}
</script>

{#if missing}
	<Alert
		tone="caution"
		title={m.contracts_statement_missing({ period: periodOf(missing) })}
		testid="contract-missing-statement"
	>
		<p>{m.contracts_statement_missing_text()}</p>
		<div>
			<Button href={missing.href} icon="calculate" testid="contract-missing-statement-link"
				>{m.dashboard_create_statements()}</Button
			>
		</div>
	</Alert>
{/if}
