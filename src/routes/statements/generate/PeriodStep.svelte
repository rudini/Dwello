<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';
	import DateInput from '$lib/ui/DateInput.svelte';

	// Step 1: the Abrechnungsperiode, proposed from the settings; both dates repeated in words
	let {
		periodStart = $bindable(),
		periodEnd = $bindable(),
		errors,
		running
	}: {
		periodStart: string;
		periodEnd: string;
		errors: Record<string, string>;
		running: boolean; // the backend says the period is not over (#815)
	} = $props();
</script>

<p class="text-ink-muted">{m.statements_period_proposed()}</p>

<div class="grid gap-6 md:grid-cols-2">
	<DateInput
		id="periodStart"
		label={m.statements_period_start()}
		bind:value={periodStart}
		error={errors.periodStart}
		testid="period-start-input"
	/>
	<DateInput
		id="periodEnd"
		label={m.statements_period_end()}
		bind:value={periodEnd}
		min={periodStart || undefined}
		error={errors.periodEnd}
		testid="period-end-input"
	/>
</div>

{#if running}
	<Alert tone="caution" title={m.statements_period_running()} testid="period-future-warning">
		<p>{m.statements_period_running_text()}</p>
	</Alert>
{/if}
