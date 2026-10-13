<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { apartmentChoices } from '$lib/contract-wizard';
	import Alert from '$lib/ui/Alert.svelte';
	import ContractsUnknown from './ContractsUnknown.svelte';
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
		error
	}: {
		apartmentId: string;
		apartments: { id: string; unit: string; building: string; size?: string }[];
		availability: Map<string, AvailabilityInfo>;
		loading: boolean;
		notice: string | null; // when the chosen apartment becomes free
		unknown?: boolean; // the chosen apartment's contracts could not be loaded
		onretry: () => void; // loads them again
		error?: string;
	} = $props();
</script>

{#if loading}
	<p role="status" class="text-ink-muted">{m.contracts_checking_apartments()}</p>
{:else}
	<Select
		id="apartment"
		label={m.tenants_apartment()}
		help={m.contracts_apartment_help()}
		options={apartmentChoices(apartments, availability)}
		bind:value={apartmentId}
		placeholder={m.contracts_choose_apartment()}
		{error}
		testid="apartment-select"
	/>
{/if}

<!-- always present, so screen readers hear the hint when it appears -->
<div role="status">
	{#if unknown}
		<ContractsUnknown {onretry} testid="apartment-contracts-unknown" />
	{/if}
</div>

{#if notice}
	<Alert title={m.contracts_free_later()} testid="availability-info">
		<p>{m.contracts_free_later_text({ notice })}</p>
	</Alert>
{/if}
