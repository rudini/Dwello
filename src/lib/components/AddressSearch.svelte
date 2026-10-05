<script lang="ts">
	import {
		searchAddress,
		streetToAddress,
		formatAddress,
		type OpenPlzStreet,
		type Address
	} from '$lib/services/openplz';
	import Icon from './Icon.svelte';

	interface Props {
		id?: string;
		label?: string;
		placeholder?: string;
		value?: string;
		required?: boolean;
		disabled?: boolean;
		error?: string;
		class?: string;
		onselect?: (_address: Address, _street: OpenPlzStreet) => void;
	}

	let {
		id = 'address-search',
		label = 'Adresse suchen',
		placeholder = 'Strasse, PLZ oder Ort eingeben...',
		value = $bindable(''),
		required = false,
		disabled = false,
		error = '',
		class: className = '',
		onselect
	}: Props = $props();

	let results = $state<OpenPlzStreet[]>([]);
	let isLoading = $state(false);
	let isOpen = $state(false);
	let selectedIndex = $state(-1);
	let searchTimeout: ReturnType<typeof setTimeout> | null = null;

	// Debounced search
	async function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		value = target.value;
		selectedIndex = -1;

		// Clear previous timeout
		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}

		// Don't search if too short
		if (value.length < 2) {
			results = [];
			isOpen = false;
			return;
		}

		// Debounce search
		searchTimeout = setTimeout(async () => {
			isLoading = true;
			try {
				results = await searchAddress(value, 8);
				isOpen = results.length > 0;
			} catch (err) {
				console.error('Address search error:', err);
				results = [];
			} finally {
				isLoading = false;
			}
		}, 300);
	}

	function handleSelect(street: OpenPlzStreet) {
		const address = streetToAddress(street);
		value = formatAddress(address);
		results = [];
		isOpen = false;
		selectedIndex = -1;
		onselect?.(address, street);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!isOpen || results.length === 0) return;

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
				break;
			case 'ArrowUp':
				e.preventDefault();
				selectedIndex = Math.max(selectedIndex - 1, 0);
				break;
			case 'Enter':
				e.preventDefault();
				if (selectedIndex >= 0 && selectedIndex < results.length) {
					handleSelect(results[selectedIndex]);
				}
				break;
			case 'Escape':
				isOpen = false;
				selectedIndex = -1;
				break;
		}
	}

	function handleBlur() {
		// Delay closing to allow click on result
		setTimeout(() => {
			isOpen = false;
			selectedIndex = -1;
		}, 200);
	}

	function handleFocus() {
		if (results.length > 0) {
			isOpen = true;
		}
	}

	const inputClasses = $derived(
		`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
			error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
		} ${disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''} ${className}`
	);
</script>

<div class="relative">
	{#if label}
		<label for={id} class="block text-sm font-medium text-gray-700 mb-1">
			{label}
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</label>
	{/if}

	<div class="relative">
		<Icon
			name="search"
			size={20}
			class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
		/>

		<input
			{id}
			type="text"
			{value}
			{placeholder}
			{disabled}
			autocomplete="off"
			oninput={handleInput}
			onkeydown={handleKeydown}
			onblur={handleBlur}
			onfocus={handleFocus}
			class={inputClasses}
			role="combobox"
			aria-expanded={isOpen}
			aria-controls="address-results"
			aria-autocomplete="list"
		/>

		{#if isLoading}
			<span class="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400">
				<Icon name="refresh" size={18} />
			</span>
		{:else if value && !disabled}
			<button
				type="button"
				onclick={() => {
					value = '';
					results = [];
					isOpen = false;
				}}
				class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
				aria-label="Suche löschen"
			>
				<Icon name="close" size={18} />
			</button>
		{/if}
	</div>

	{#if error}
		<p class="mt-1 text-sm text-red-600">{error}</p>
	{/if}

	<!-- Results dropdown -->
	{#if isOpen && results.length > 0}
		<ul
			id="address-results"
			class="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
			role="listbox"
		>
			{#each results as street, index}
				<li
					role="option"
					aria-selected={index === selectedIndex}
					class="px-4 py-3 cursor-pointer transition-colors {index === selectedIndex
						? 'bg-primary/10 text-primary'
						: 'hover:bg-gray-50'}"
					onclick={() => handleSelect(street)}
					onkeydown={(e) => e.key === 'Enter' && handleSelect(street)}
					tabindex="-1"
				>
					<div class="flex items-start gap-3">
						<Icon name="location_on" size={20} class="text-gray-400 mt-0.5 flex-shrink-0" />
						<div class="flex-1 min-w-0">
							<p class="font-medium text-gray-900 truncate">{street.name}</p>
							<p class="text-sm text-gray-500">
								{street.postalCode}
								{street.locality}
								<span class="text-gray-400">({street.canton.shortName})</span>
							</p>
						</div>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>
