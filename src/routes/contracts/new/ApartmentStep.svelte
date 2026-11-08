<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { apartmentChoices } from '$lib/contract-wizard';
	import Alert from '$lib/ui/Alert.svelte';
	import ContractsUnknown from './ContractsUnknown.svelte';
	import LiveRegion from '$lib/ui/LiveRegion.svelte';
	import OverlapLink from '../OverlapLink.svelte';
	import Select from '$lib/ui/Select.svelte';
	import type { AvailabilityInfo } from '$lib/utils/contract-availability';

	// Step 2: which apartment; rented ones are listed but cannot be chosen
	let {
		apartmentId = $bindable(),
		apartments,
		availability,
		loading,
		notice,
		unknown = false,
		onretry,
		cleared = $bindable(),
		error
	}: {
		apartmentId: string;
		apartments: { id: string; unit: string; building: string; size?: string }[];
		availability: Map<string, AvailabilityInfo | null>; // null: the contracts could not be loaded
		loading: boolean;
		notice: string | null; // when the chosen apartment becomes free
		unknown?: boolean; // the chosen apartment's contracts could not be loaded
		onretry: () => void; // loads them again
		cleared?: { apartment: string; contract?: { id: string; tenant?: string } } | null; // a choice «Erneut versuchen» cleared (#1153)
		error?: string;
	} = $props();
	// the hint is for the cleared choice: once an apartment is chosen it is gone for good (code review 1153 C-1)
	$effect(() => {
		if (apartmentId) cleared = null;
	});
</script>

{#if loading}
	<p role="status" class="text-ink-muted">{m.contracts_checking_apartments()}</p>
{:else}
	<Select
		id="apartment"
		label={m.tenants_apartment()}
		help={[...availability.values()].includes(null)
			? `${m.contracts_apartment_help()} ${m.contracts_apartment_help_unchecked()}`
			: m.contracts_apartment_help()}
		options={apartmentChoices(apartments, availability)}
		bind:value={apartmentId}
		placeholder={m.contracts_choose_apartment()}
		{error}
		describedby={unknown
			? 'apartment-contracts-unknown-title apartment-contracts-unknown-text'
			: cleared
				? 'apartment-cleared-title apartment-cleared-text' // why the choice is gone (Sven 1288 P-2)
				: undefined}
		testid="apartment-select"
	/>
{/if}

<ContractsUnknown {onretry} shown={unknown} testid="apartment-contracts-unknown" />

<!-- stays until an apartment is chosen (#1153, Sven S-7, Helga H-6); the only word on it, announced once (#1289) -->
<LiveRegion shown={!!cleared}>
	{#if cleared}
		<Alert
			tone="caution"
			title={m.contracts_apartment_cleared_title({ apartment: cleared.apartment })}
			titleId="apartment-cleared-title"
			testid="apartment-cleared"
		>
			<p id="apartment-cleared-text" data-testid="apartment-cleared-text">
				{m.contracts_apartment_cleared_text()}
			</p>
			{#if cleared.contract}<OverlapLink contract={cleared.contract} />{/if}
		</Alert>
	{/if}
</LiveRegion>

{#if notice}
	<Alert title={m.contracts_free_later()} testid="availability-info">
		<p>{m.contracts_free_later_text({ notice })}</p>
	</Alert>
{/if}
