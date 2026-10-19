<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { apiCall } from '$lib/api';
	import type { AddressHit } from '$lib/server/building-register';
	import Field from '$lib/ui/Field.svelte';
	import Icon from '$lib/ui/Icon.svelte';
	import { controlClass } from '$lib/ui/field';

	// Looks up addresses in the Gebäuderegister while typing (#479); choosing one hands it on. `onfound` says whether the
	// search found nothing or could not reach the register, for the form to say so
	interface Props {
		id?: string;
		label?: string;
		help?: string;
		example?: string;
		placeholder?: string;
		onselect?: (_address: AddressHit) => void;
		onfound?: (_outcome: 'hits' | 'none' | 'unreachable') => void;
	}

	let {
		id = 'address-search',
		label = m.buildings_address_search(),
		help,
		example,
		placeholder,
		onselect,
		onfound
	}: Props = $props();

	let value = $state('');
	let results = $state<AddressHit[]>([]);
	let isLoading = $state(false);
	let isOpen = $state(false);
	let selectedIndex = $state(-1);
	let input = $state<HTMLInputElement>();
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
			const { data, error } = await apiCall<AddressHit[]>('/addresses', { params: { q: value } });
			results = data ?? [];
			isOpen = results.length > 0;
			isLoading = false;
			onfound?.(error ? 'unreachable' : results.length ? 'hits' : 'none');
		}, 300);
	}

	function handleSelect(address: AddressHit) {
		value = `${address.street}, ${address.postalCode} ${address.city}`;
		results = [];
		isOpen = false;
		selectedIndex = -1;
		onselect?.(address);
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

	// a hint about the last search goes with it; the focus stays in the field instead of falling to the page
	function clear() {
		value = '';
		results = [];
		isOpen = false;
		onfound?.('hits');
		input?.focus();
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
					bind:this={input}
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
					data-testid="building-address-search-input"
				/>
				<span class="absolute right-0 top-0 flex h-full items-center">
					{#if isLoading}
						<span class="flex size-12 items-center justify-center text-ink-muted" role="status">
							<span class="animate-spin"><Icon name="loading" /></span>
							<span class="sr-only">{m.buildings_address_searching()}</span>
						</span>
					{:else if value}
						<button
							type="button"
							onclick={clear}
							class="flex size-12 items-center justify-center rounded-control text-ink-muted hover:text-ink"
							aria-label={m.buildings_address_clear()}
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
			aria-label={m.buildings_address_results()}
		>
			{#each results as address, index (index)}
				<li
					id="{id}-result-{index}"
					role="option"
					aria-selected={index === selectedIndex}
					class="flex min-h-12 cursor-pointer items-start gap-4 px-4 py-2 {index === selectedIndex
						? 'bg-accent-soft'
						: 'hover:bg-sunken'}"
					onmousedown={() => handleSelect(address)}
					data-testid="building-address-result-{index}"
				>
					<span class="text-ink-muted"><Icon name="location" /></span>
					<span class="flex min-w-0 flex-col">
						<span class="font-semibold text-ink">{address.street}</span>
						<span class="text-ink-muted"
							>{address.postalCode} {address.city} ({address.canton})</span
						>
					</span>
				</li>
			{/each}
		</ul>
	{/if}
</div>
