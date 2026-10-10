<script lang="ts">
	import Alert from '$lib/ui/Alert.svelte';
	import RadioGroup from '$lib/ui/RadioGroup.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';
	import { formatDateLong } from '$lib/utils/format';

	// Step 3: from when, and until when or without end; each date is repeated in words
	let {
		startDate = $bindable(),
		endDate = $bindable(),
		isUnlimited = $bindable(),
		min,
		overlap,
		errors
	}: {
		startDate: string;
		endDate: string;
		isUnlimited: boolean;
		min?: string;
		overlap: string | null;
		errors: Record<string, string>;
	} = $props();

	const durations = [
		{
			value: 'unlimited',
			label: 'Unbefristet',
			description: 'Der Mietvertrag hat kein Vertragsende. Er läuft, bis er gekündigt wird.'
		},
		{
			value: 'limited',
			label: 'Befristet',
			description: 'Der Mietvertrag endet an einem festen Tag, ohne Kündigung.'
		}
	];
</script>

{#snippet inWords(date: string, testid: string)}
	{#if date}
		<p class="font-semibold text-ink" aria-live="polite" data-testid={testid}>
			{formatDateLong(date)}
		</p>
	{/if}
{/snippet}

<div class="flex flex-col gap-2">
	<TextInput
		id="startDate"
		label="Vertragsbeginn"
		type="date"
		help="Erster Tag des Mietverhältnisses."
		bind:value={startDate}
		{min}
		error={errors.startDate}
		testid="start-date-input"
	/>
	{@render inWords(startDate, 'start-date-words')}
</div>

<RadioGroup
	name="duration"
	legend="Vertragsdauer"
	options={durations}
	bind:value={
		() => (isUnlimited ? 'unlimited' : 'limited'), (v) => (isUnlimited = v === 'unlimited')
	}
	testid="contract-duration"
/>

{#if !isUnlimited}
	<div class="flex flex-col gap-2">
		<TextInput
			id="endDate"
			label="Vertragsende"
			type="date"
			help="Letzter Tag des Mietverhältnisses."
			bind:value={endDate}
			min={startDate || undefined}
			error={errors.endDate}
			testid="end-date-input"
		/>
		{@render inWords(endDate, 'end-date-words')}
	</div>
{/if}

{#if overlap}
	<Alert tone="caution" title="Zeitraum überschneidet sich" testid="overlap-warning">
		<p>{overlap}. Pro Wohnung darf sich kein Mietvertrag mit einem anderen überschneiden.</p>
	</Alert>
{/if}
