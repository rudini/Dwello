<script lang="ts">
	import Alert from '$lib/ui/Alert.svelte';
	import { formatDate } from '$lib/utils/format';

	// Recorded after the statements of its period were created: they lack this invoice
	let { periods }: { periods: { start: string; end: string }[] } = $props();
</script>

<!-- TODO(fachlich prüfen): how far costs can still be claimed after a statement was sent is not settled -->
<Alert tone="caution" title="Nicht in den Abrechnungen" testid="invoice-missed-warning">
	{#each periods as period (`${period.start}-${period.end}`)}
		<p>
			Für die Abrechnungsperiode {formatDate(period.start)} – {formatDate(period.end)} gibt es schon Abrechnungen
			ohne diese Rechnung.
		</p>
	{/each}
	<p>
		Entwürfe erstellen Sie neu, dann ist sie dabei. Ob Sie die Kosten bei versendeten Abrechnungen
		noch nachverlangen können, ist nicht in jedem Fall sicher.
	</p>
</Alert>
