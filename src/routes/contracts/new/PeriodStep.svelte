<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';
	import RadioGroup from '$lib/ui/RadioGroup.svelte';
	import DateInput from '$lib/ui/DateInput.svelte';
	import { startDateNotice } from '$lib/contract-wizard';

	// Step 3: from when, and until when or without end; each date is repeated in words
	let {
		startDate = $bindable(),
		endDate = $bindable(),
		isUnlimited = $bindable(),
		min,
		today,
		overlap,
		errors
	}: {
		startDate: string;
		endDate: string;
		isUnlimited: boolean;
		min?: string;
		today: string;
		overlap: string | null;
		errors: Record<string, string>;
	} = $props();

	// TODO(fachlich prüfen): explanations of unbefristet/befristet are not from the glossary
	const pastStart = $derived(startDateNotice(startDate, today));

	const durations = [
		{
			value: 'unlimited',
			label: m.contracts_unlimited(),
			description: m.contracts_unlimited_help()
		},
		{
			value: 'limited',
			label: m.contracts_limited(),
			description: m.contracts_limited_help()
		}
	];
</script>

<DateInput
	id="startDate"
	label={m.tenants_contract_start()}
	help={m.contracts_start_help()}
	bind:value={startDate}
	{min}
	error={errors.startDate}
	testid="start-date-input"
/>

<!-- always present, so screen readers hear the hint when it appears -->
<div role="status" data-testid="start-date-notice">
	{#if pastStart}
		<Alert tone="caution" title={m.contracts_check_start()}><p>{pastStart}</p></Alert>
	{/if}
</div>

<RadioGroup
	name="duration"
	legend={m.contracts_period()}
	options={durations}
	bind:value={
		() => (isUnlimited ? 'unlimited' : 'limited'), (v) => (isUnlimited = v === 'unlimited')
	}
	testid="contract-duration"
/>

{#if !isUnlimited}
	<DateInput
		id="endDate"
		label={m.dashboard_kind_contract_end()}
		help={m.contracts_end_help()}
		bind:value={endDate}
		min={startDate || undefined}
		error={errors.endDate}
		testid="end-date-input"
	/>
{/if}

{#if overlap}
	<Alert tone="caution" title={m.contracts_overlap_title()} testid="overlap-warning">
		<p>{m.contracts_overlap_text({ overlap })}</p>
	</Alert>
{/if}
