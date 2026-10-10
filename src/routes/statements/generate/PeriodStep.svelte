<script lang="ts">
	import TextInput from '$lib/ui/TextInput.svelte';
	import { formatDateLong } from '$lib/utils/format';

	// Step 1: the Abrechnungsperiode, proposed from the settings; both dates repeated in words
	let {
		periodStart = $bindable(),
		periodEnd = $bindable(),
		errors
	}: { periodStart: string; periodEnd: string; errors: Record<string, string> } = $props();
</script>

{#snippet inWords(date: string)}
	{#if date}<p class="font-semibold text-ink">{formatDateLong(date)}</p>{/if}
{/snippet}

<p class="text-ink-muted">
	Vorgeschlagen ist die letzte abgelaufene Abrechnungsperiode aus den Einstellungen.
</p>

<div class="grid gap-6 md:grid-cols-2">
	<div class="flex flex-col gap-2">
		<TextInput
			id="periodStart"
			label="Beginn"
			type="date"
			bind:value={periodStart}
			error={errors.periodStart}
			testid="period-start-input"
		/>
		{@render inWords(periodStart)}
	</div>
	<div class="flex flex-col gap-2">
		<TextInput
			id="periodEnd"
			label="Ende"
			type="date"
			bind:value={periodEnd}
			min={periodStart || undefined}
			error={errors.periodEnd}
			testid="period-end-input"
		/>
		{@render inWords(periodEnd)}
	</div>
</div>
