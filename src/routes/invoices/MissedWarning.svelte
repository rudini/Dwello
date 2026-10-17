<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';
	import { formatDate } from '$lib/utils/format';

	// Recorded after the statements of its period were created: they lack this invoice
	let { periods }: { periods: { start: string; end: string }[] } = $props();
</script>

<Alert tone="caution" title={m.invoices_missed_title()} testid="invoice-missed-warning">
	{#each periods as period (`${period.start}-${period.end}`)}
		<p>
			{m.invoices_missed_period({ start: formatDate(period.start), end: formatDate(period.end) })}
		</p>
	{/each}
	<p>{m.invoices_missed_text()}</p>
</Alert>
