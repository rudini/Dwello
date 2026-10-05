<script lang="ts">
	import FieldError from '$lib/components/FieldError.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { apartmentOption, fieldBorder } from '$lib/contract-form';
	import type { AvailabilityInfo } from '$lib/utils/contract-availability';

	// Apartment of a contract, each with its availability; the notice tells when the chosen apartment becomes free
	let {
		value = $bindable(),
		apartments,
		availability,
		loading,
		currentApartmentId,
		error,
		notice
	}: {
		value: string;
		apartments: { id: string; unit: string; building: string }[];
		availability: Map<string, AvailabilityInfo>;
		loading: boolean;
		currentApartmentId?: string;
		error?: string;
		notice: string | null;
	} = $props();
</script>

<div>
	<label for="apartment" class="block text-sm font-medium text-gray-700 mb-1">
		Wohnung <span class="text-red-500">*</span>
	</label>
	{#if loading}
		<div
			class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center gap-2 text-gray-500"
		>
			<span class="animate-spin">
				<Icon name="refresh" size={16} />
			</span>
			Verfügbarkeit wird geprüft...
		</div>
	{:else}
		<select
			id="apartment"
			bind:value
			data-testid="apartment-select"
			class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white {fieldBorder(
				error
			)}"
		>
			<option value="">Wohnung auswählen...</option>
			{#each apartments as apt (apt.id)}
				{@const option = apartmentOption(
					apt,
					availability.get(apt.id),
					apt.id === currentApartmentId
				)}
				<option value={apt.id} disabled={option.disabled}>{option.label}</option>
			{/each}
		</select>
	{/if}
	<FieldError message={error} />

	{#if notice}
		<div
			class="mt-2 p-3 rounded-lg flex items-start gap-2 bg-blue-50 border border-blue-200"
			data-testid="availability-info"
		>
			<Icon name="info" size={18} class="text-blue-600" />
			<span class="text-sm text-blue-700">{notice}</span>
		</div>
	{/if}
</div>
