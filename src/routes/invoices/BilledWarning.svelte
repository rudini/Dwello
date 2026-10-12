<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';
	import { formatDate } from '$lib/utils/format';
	import type { Snippet } from 'svelte';

	// The periods whose statements took this invoice: changing or deleting it makes them wrong
	let { periods, children }: { periods: { start: string; end: string }[]; children: Snippet } =
		$props();
</script>

<Alert tone="caution" title={m.invoices_billed_title()} testid="invoice-billed-warning">
	{#each periods as period (`${period.start}-${period.end}`)}
		<p>
			{m.invoices_billed_period({ start: formatDate(period.start), end: formatDate(period.end) })}
		</p>
	{/each}
	{@render children()}
</Alert>
