<script lang="ts">
	import Alert from '$lib/ui/Alert.svelte';
	import { formatDate } from '$lib/utils/format';
	import type { Snippet } from 'svelte';

	// The periods whose statements took this invoice: changing or deleting it makes them wrong
	let { periods, children }: { periods: { start: string; end: string }[]; children: Snippet } =
		$props();
</script>

<Alert tone="caution" title="Rechnung schon abgerechnet" testid="invoice-billed-warning">
	{#each periods as period (`${period.start}-${period.end}`)}
		<p>
			Für die Abrechnungsperiode {formatDate(period.start)} – {formatDate(period.end)} gibt es schon Abrechnungen
			mit dieser Rechnung.
		</p>
	{/each}
	{@render children()}
</Alert>
