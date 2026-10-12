<script lang="ts">
	import { m } from '$lib/paraglide/messages';
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
		label: m.contracts_limited(),
		description: m.contracts_limited_help()
	};
	// a notice keeps the contract open-ended (A-1); withdrawing it is a choice with its consequence
	// TODO(fachlich prüfen): «Kündigung aufheben» is not from the glossary (offene-punkte.md)
	const durations = $derived(
		noticed
			? [
					{
						value: 'terminated',
						label: endDate ? contractEnd(endDate, true) : m.contracts_duration_terminated(),
						description: m.contracts_duration_terminated_help()
					},
					{
						value: 'unlimited',
						label: m.contracts_withdraw_notice(),
						description: m.contracts_withdraw_notice_help()
					},
					limited
				]
			: [
					{
						value: 'unlimited',
						label: m.contracts_unlimited(),
						description: m.contracts_unlimited_help()
					},
					limited
				]
	);
	const duration = (unlimited: boolean, noticeGiven: boolean) =>
		unlimited ? 'unlimited' : noticeGiven ? 'terminated' : 'limited';
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
		() => duration(isUnlimited, terminated),
		(v) => ((isUnlimited = v === 'unlimited'), (terminated = v === 'terminated'))
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
