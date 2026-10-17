<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';
	import { formatDate } from '$lib/utils/format';

	// Recorded after the statements of its period were created: they lack this invoice
	let {
		periods,
		invoice
	}: {
		periods: { start: string; end: string }[];
		invoice: { buildingId: string; buildingName?: string };
	} = $props();
</script>

<!-- TODO(fachlich prüfen, #120): how far costs can still be claimed after a statement was sent is not settled -->
<Alert tone="caution" title={m.invoices_missed_title()} testid="invoice-missed-warning">
	{#each periods as period (`${period.start}-${period.end}`)}
		<p>
			{m.invoices_missed_period({ start: formatDate(period.start), end: formatDate(period.end) })}
		</p>
		<!-- #378: the statements to create again or correct -->
		<a
			href="/statements?building={invoice.buildingId}&periodStart={period.start}&periodEnd={period.end}"
			class="inline-flex min-h-12 items-center text-accent underline underline-offset-4"
			data-testid="invoice-missed-statements-link"
			>{m.statements_view_of({ name: invoice.buildingName ?? '' })}</a
		>
	{/each}
	<p>{m.invoices_missed_text()}</p>
</Alert>
