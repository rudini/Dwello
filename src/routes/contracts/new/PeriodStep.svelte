<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';
	import LiveRegion from '$lib/ui/LiveRegion.svelte';
	import ContractsUnknown from './ContractsUnknown.svelte';
	import OverlapLink from '../OverlapLink.svelte';
	import OverlapWarning from '../OverlapWarning.svelte';
	import type { Overlap } from '$lib/contract-form';
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
		billedUntil = $bindable(),
		offerBilledUntil = false,
		noticed = false,
		min,
		unknown = false,
		onretry,
		startPast,
		overlap,
		overlapSaid = false,
		newTab = false,
		errors
	}: {
		startDate: string;
		endDate: string;
		isUnlimited: boolean;
		terminated?: boolean;
		billedUntil?: string;
		offerBilledUntil?: boolean; // the wizard: «Abgerechnet bis» for a Vertragsbeginn before today (#453)
		noticed?: boolean; // the saved contract is open-ended and ended by notice: it can be withdrawn
		min?: string;
		unknown?: boolean; // the apartment's contracts could not be loaded: no earliest start is known
		onretry?: () => void; // loads them again; without it the hint points to the one at the top
		startPast: boolean; // the start lies before today, as the backend says (#815); the edit form: also before the saved one
		overlap: Overlap | null;
		overlapSaid?: boolean; // its words stand at the field already: only the link to the other contract (Weber b667 P-1)
		newTab?: boolean; // the link keeps the input of the edit form
		errors: Record<string, string>;
	} = $props();

	const pastStart = $derived(startDateNotice(startDate, startPast));

	const limited = {
		value: 'limited',
		label: m.contracts_limited(),
		description: m.contracts_limited_help()
	};
	// a notice keeps the contract open-ended (A-1); withdrawing it is a choice with its consequence and when it is
	// possible (glossary «Kündigung aufheben»)
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
	describedby={unknown ? 'start-contracts-unknown-title start-contracts-unknown-text' : undefined}
	testid="start-date-input"
/>

<!-- read out at the apartment choice already, and with «Vertragsbeginn» (#665): a second live region would say it
     twice (Sven B-13); step 3 opens only once the contracts are known («Weiter» waits for them, #468) -->
{#if unknown}
	<ContractsUnknown {onretry} testid="start-contracts-unknown" />
{/if}

<LiveRegion shown={!!pastStart} testid="start-date-notice">
	<Alert tone="caution" title={m.contracts_check_start()}>
		<p>{pastStart}</p>
		{#if offerBilledUntil}<p>{m.contracts_start_in_past_billed()}</p>{/if}
	</Alert>
</LiveRegion>

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

<!-- #453 (#328): a running contract recorded on the switch to Dwello, billed outside Dwello up to a day -->
{#if offerBilledUntil && pastStart}
	<DateInput
		id="billedUntil"
		label={m.contracts_billed_until()}
		help={m.contracts_billed_until_help()}
		bind:value={billedUntil}
		optional
		error={errors.billedUntil}
		testid="billed-until-input"
	/>
{/if}

{#if overlap && !overlapSaid}
	<OverlapWarning {overlap} {newTab} />
{:else if overlap}
	<OverlapLink contract={overlap.contract} {newTab} />
{/if}
