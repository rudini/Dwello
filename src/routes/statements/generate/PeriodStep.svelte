<script lang="ts">
	import Alert from '$lib/ui/Alert.svelte';
	import DateInput from '$lib/ui/DateInput.svelte';
	import { localToday } from '$lib/contract-status';

	// Step 1: the Abrechnungsperiode, proposed from the settings; both dates repeated in words
	let {
		periodStart = $bindable(),
		periodEnd = $bindable(),
		errors
	}: { periodStart: string; periodEnd: string; errors: Record<string, string> } = $props();

	// ISO dates compare as text
	const notOver = $derived(!!periodEnd && periodEnd >= localToday());
</script>

<p class="text-ink-muted">
	Vorgeschlagen ist die letzte abgelaufene Abrechnungsperiode aus den Einstellungen.
</p>

<div class="grid gap-6 md:grid-cols-2">
	<DateInput
		id="periodStart"
		label="Beginn"
		bind:value={periodStart}
		error={errors.periodStart}
		testid="period-start-input"
	/>
	<DateInput
		id="periodEnd"
		label="Ende"
		bind:value={periodEnd}
		min={periodStart || undefined}
		error={errors.periodEnd}
		testid="period-end-input"
	/>
</div>

{#if notOver}
	<Alert tone="caution" title="Periode läuft noch" testid="period-future-warning">
		<p>
			Die Abrechnungsperiode ist noch nicht zu Ende. Die Abrechnungen zählen das Akonto aller Monate,
			auch der noch nicht bezahlten, und Rechnungen bis zum Ende der Periode fehlen noch. Erstellen Sie
			die Abrechnungen erst nach dem Ende der Periode.
		</p>
	</Alert>
{/if}
