<script lang="ts">
	import { getAddressFromPostalCode, type Address } from '$lib/services/openplz';
	import Icon from './Icon.svelte';

	interface Props {
		id?: string;
		label?: string;
		postalCode?: string;
		city?: string;
		canton?: string;
		required?: boolean;
		disabled?: boolean;
		postalCodeError?: string;
		cityError?: string;
		class?: string;
		onchange?: (_address: Address | null) => void;
	}

	let {
		id = 'postal-code',
		label = 'PLZ / Ort',
		postalCode = $bindable(''),
		city = $bindable(''),
		canton = $bindable(''),
		required = false,
		disabled = false,
		postalCodeError = '',
		cityError = '',
		class: className = '',
		onchange
	}: Props = $props();

	let isLoading = $state(false);
	let lookupTimeout: ReturnType<typeof setTimeout> | null = null;

	async function handlePostalCodeInput(e: Event) {
		const target = e.target as HTMLInputElement;
		// Only allow digits
		const value = target.value.replace(/\D/g, '').slice(0, 4);
		postalCode = value;

		// Clear previous timeout
		if (lookupTimeout) {
			clearTimeout(lookupTimeout);
		}

		// Lookup when 4 digits entered
		if (value.length === 4) {
			lookupTimeout = setTimeout(async () => {
				isLoading = true;
				try {
					const address = await getAddressFromPostalCode(value);
					if (address) {
						city = address.city;
						canton = address.cantonShort;
						onchange?.(address);
					} else {
						// PLZ not found, clear city/canton
						city = '';
						canton = '';
						onchange?.(null);
					}
				} catch (err) {
					console.error('Postal code lookup error:', err);
				} finally {
					isLoading = false;
				}
			}, 300);
		} else {
			// Clear city/canton if PLZ incomplete
			city = '';
			canton = '';
		}
	}

	function handleCityInput(e: Event) {
		const target = e.target as HTMLInputElement;
		city = target.value;
	}

	const postalCodeClasses = $derived(
		`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
			postalCodeError ? 'border-red-500' : 'border-gray-300'
		} ${disabled ? 'bg-gray-50 text-gray-400' : ''}`
	);

	const cityClasses = $derived(
		`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
			cityError ? 'border-red-500' : 'border-gray-300'
		} ${disabled ? 'bg-gray-50 text-gray-400' : ''}`
	);
</script>

<div class={className}>
	{#if label}
		<label for={id} class="block text-sm font-medium text-gray-700 mb-1">
			{label}
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</label>
	{/if}

	<div class="grid grid-cols-3 gap-3">
		<!-- PLZ -->
		<div class="col-span-1">
			<div class="relative">
				<input
					{id}
					type="text"
					inputmode="numeric"
					maxlength="4"
					value={postalCode}
					placeholder="PLZ"
					{disabled}
					oninput={handlePostalCodeInput}
					class={postalCodeClasses}
				/>
				{#if isLoading}
					<span class="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400">
						<Icon name="refresh" size={16} />
					</span>
				{/if}
			</div>
			{#if postalCodeError}
				<p class="mt-1 text-sm text-red-600">{postalCodeError}</p>
			{/if}
		</div>

		<!-- City -->
		<div class="col-span-2">
			<div class="relative">
				<input
					id="{id}-city"
					type="text"
					value={city}
					placeholder="Ort"
					{disabled}
					oninput={handleCityInput}
					class={cityClasses}
				/>
				{#if canton}
					<span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
						{canton}
					</span>
				{/if}
			</div>
			{#if cityError}
				<p class="mt-1 text-sm text-red-600">{cityError}</p>
			{/if}
		</div>
	</div>

	<p class="mt-1 text-xs text-gray-400">PLZ eingeben für automatische Ortserkennung</p>
</div>
