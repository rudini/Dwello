<script lang="ts">
	import { apartmentChoices } from '$lib/contract-wizard';
	import Alert from '$lib/ui/Alert.svelte';
	import Select from '$lib/ui/Select.svelte';
	import type { AvailabilityInfo } from '$lib/utils/contract-availability';

	// Step 2: which apartment; rented ones are listed but cannot be chosen
	let {
		apartmentId = $bindable(),
		apartments,
		availability,
		loading,
		notice,
		error
	}: {
		apartmentId: string;
		apartments: { id: string; unit: string; building: string }[];
		availability: Map<string, AvailabilityInfo>;
		loading: boolean;
		notice: string | null; // when the chosen apartment becomes free
		error?: string;
	} = $props();
</script>

{#if loading}
	<p role="status" class="text-ink-muted">Es wird geprüft, welche Wohnungen frei sind …</p>
{:else}
	<Select
		id="apartment"
		label="Wohnung"
		help="Freie Wohnungen stehen zuoberst. Vermietete Wohnungen sind mit «nicht verfügbar» markiert und lassen sich nicht wählen."
		options={apartmentChoices(apartments, availability)}
		bind:value={apartmentId}
		placeholder="Wohnung wählen"
		{error}
		testid="apartment-select"
	/>
{/if}

{#if notice}
	<Alert title="Wohnung wird später frei" testid="availability-info">
		<p>{notice}. Der Mietvertrag kann frühestens an diesem Tag beginnen.</p>
	</Alert>
{/if}
