<script lang="ts">
	import {
		searchAddress,
		streetToAddress,
		formatAddress,
		type OpenPlzStreet,
		type Address
	} from '$lib/services/openplz';
	import Field from '$lib/ui/Field.svelte';
	import Icon from '$lib/ui/Icon.svelte';
	import { controlClass } from '$lib/ui/field';

	// Looks up Swiss streets (openplz) while typing; choosing one fills the address fields
	interface Props {
		id?: string;
		label?: string;
		help?: string;
		example?: string;
		placeholder?: string;
		onselect?: (_address: Address, _street: OpenPlzStreet) => void;
	}

	let {
		id = 'address-search',
		label = 'Adresse suchen',
		help,
		example,
		placeholder,
		onselect
	}: Props = $props();

	let value = $state('');
	let results = $state<OpenPlzStreet[]>([]);
	let isLoading = $state(false);
	let isOpen = $state(false);
	let selectedIndex = $state(-1);
	let searchTimeout: ReturnType<typeof setTimeout> | null = null;

	// Debounced search
	function handleInput(e: Event) {
		value = (e.target as HTMLInputElement).value;
		selectedIndex = -1;
		if (searchTimeout) clearTimeout(searchTimeout);
		if (value.length < 2) {
			results = [];
			isOpen = false;
			return;
		}
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
		if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
			e.preventDefault();
			const step = e.key === 'ArrowDown' ? 1 : -1;
			selectedIndex = Math.min(Math.max(selectedIndex + step, 0), results.length - 1);
		} else if (e.key === 'Enter') {
			e.preventDefault();
			if (selectedIndex >= 0) handleSelect(results[selectedIndex]);
		} else if (e.key === 'Escape') {
			isOpen = false;
			selectedIndex = -1;
		}
	}

	function clear() {
		value = '';
		results = [];
		isOpen = false;
	}

	// Delay closing to allow a click on a result
	function handleBlur() {
		setTimeout(() => {
			isOpen = false;
			selectedIndex = -1;
		}, 200);
	}
</script>

<div class="relative">
	<Field {id} {label} {help} {example} optional>
		{#snippet children(control)}
			<div class="relative">
				<span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted">
					<Icon name="search" />
				</span>
				<input
					id={control.id}
					type="text"
					{value}
					{placeholder}
					autocomplete="off"
					oninput={handleInput}
					onkeydown={handleKeydown}
					onblur={handleBlur}
					onfocus={() => (isOpen = results.length > 0)}
					class="{controlClass(false)} pl-12 pr-16"
					role="combobox"
					aria-expanded={isOpen}
					aria-controls="{id}-results"
					aria-autocomplete="list"
					aria-describedby={control.describedBy}
					aria-activedescendant={selectedIndex >= 0 ? `${id}-result-${selectedIndex}` : undefined}
				/>
				<span class="absolute right-0 top-0 flex h-full items-center">
					{#if isLoading}
						<span class="flex size-12 items-center justify-center text-ink-muted" role="status">
							<span class="animate-spin"><Icon name="loading" /></span>
							<span class="sr-only">Adressen werden gesucht …</span>
						</span>
					{:else if value}
						<button
							type="button"
							onclick={clear}
							class="flex size-12 items-center justify-center rounded-control text-ink-muted hover:text-ink"
							aria-label="Suche löschen"
						>
							<Icon name="close" />
						</button>
					{/if}
				</span>
			</div>
		{/snippet}
	</Field>

	{#if isOpen && results.length > 0}
		<ul
			id="{id}-results"
			class="absolute z-50 mt-2 max-h-80 w-full overflow-auto rounded-control border border-line-strong bg-surface shadow-raised"
			role="listbox"
			aria-label="Gefundene Adressen"
		>
			{#each results as street, index (index)}
				<li
					id="{id}-result-{index}"
					role="option"
					aria-selected={index === selectedIndex}
					class="flex min-h-12 cursor-pointer items-start gap-4 px-4 py-2 {index === selectedIndex
						? 'bg-accent-soft'
						: 'hover:bg-sunken'}"
					onmousedown={() => handleSelect(street)}
				>
					<span class="text-ink-muted"><Icon name="location" /></span>
					<span class="flex min-w-0 flex-col">
						<span class="font-semibold text-ink">{street.name}</span>
						<span class="text-ink-muted"
							>{street.postalCode} {street.locality} ({street.canton.shortName})</span
						>
					</span>
				</li>
			{/each}
		</ul>
	{/if}
</div>
