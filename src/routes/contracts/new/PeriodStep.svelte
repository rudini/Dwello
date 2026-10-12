<script lang="ts">
	import Alert from '$lib/ui/Alert.svelte';
	import RadioGroup from '$lib/ui/RadioGroup.svelte';
	import DateInput from '$lib/ui/DateInput.svelte';
	import { startDateNotice } from '$lib/contract-wizard';
	import { contractEnd } from '$lib/contract-status';

	// Step 3: from when, and until when or without end; each date is repeated in words
	let {
		startDate = $bindable(),
		endDate = $bindable(),
		isUnlimited = $bindable(),
		terminated = $bindable(false),
		noticed = false,
		min,
		today,
		overlap,
		errors
	}: {
		startDate: string;
		endDate: string;
		isUnlimited: boolean;
		terminated?: boolean;
		noticed?: boolean; // the saved contract is open-ended and ended by notice: it can be withdrawn
		min?: string;
		today: string;
		overlap: string | null;
		errors: Record<string, string>;
	} = $props();

	// TODO(fachlich prüfen): explanations of unbefristet/befristet are not from the glossary
	const pastStart = $derived(startDateNotice(startDate, today));

	const limited = {
		value: 'limited',
		label: 'Befristet',
		description: 'Der Mietvertrag endet an einem festen Tag, ohne Kündigung.'
	};
	// a notice keeps the contract open-ended (A-1); withdrawing it is a choice with its consequence
	const durations = $derived(
		noticed
			? [
					{
						value: 'terminated',
						label: endDate ? contractEnd(endDate, true) : 'Unbefristet, gekündigt',
						description:
							'Der Mietvertrag endet mit der Kündigung. Hat sich der Kündigungstermin verschoben, ändern Sie das Vertragsende.'
					},
					{
						value: 'unlimited',
						label: 'Kündigung aufheben',
						description: 'Der Mietvertrag läuft dann ohne Ende weiter.'
					},
					limited
				]
			: [
					{
						value: 'unlimited',
						label: 'Unbefristet',
						description: 'Der Mietvertrag hat kein Vertragsende. Er läuft, bis er gekündigt wird.'
					},
					limited
				]
	);
	const duration = (unlimited: boolean, noticeGiven: boolean) =>
		unlimited ? 'unlimited' : noticeGiven ? 'terminated' : 'limited';
</script>

<DateInput
	id="startDate"
	label="Vertragsbeginn"
	help="Erster Tag des Mietverhältnisses."
	bind:value={startDate}
	{min}
	error={errors.startDate}
	testid="start-date-input"
/>

<!-- always present, so screen readers hear the hint when it appears -->
<div role="status" data-testid="start-date-notice">
	{#if pastStart}
		<Alert tone="caution" title="Vertragsbeginn prüfen"><p>{pastStart}</p></Alert>
	{/if}
</div>

<RadioGroup
	name="duration"
	legend="Vertragsdauer"
	options={durations}
	bind:value={
		() => duration(isUnlimited, terminated),
		(v) => ((isUnlimited = v === 'unlimited'), (terminated = v === 'terminated'))
	}
	testid="contract-duration"
/>

{#if !isUnlimited}
	<DateInput
		id="endDate"
		label="Vertragsende"
		help="Letzter Tag des Mietverhältnisses."
		bind:value={endDate}
		min={startDate || undefined}
		error={errors.endDate}
		testid="end-date-input"
	/>
{/if}

{#if overlap}
	<Alert tone="caution" title="Zeitraum überschneidet sich" testid="overlap-warning">
		<p>
			{overlap}. Pro Wohnung darf sich kein Mietvertrag mit einem anderen überschneiden.
		</p>
	</Alert>
{/if}
