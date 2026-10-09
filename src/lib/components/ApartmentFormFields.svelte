<script lang="ts">
	import { untrack } from 'svelte';
	import type { Apartment } from '$lib/types';
	import { floorOptions, roomOptions } from '$lib/apartment';
	import { normalizeDecimal } from '$lib/utils/format';
	import FieldError from './FieldError.svelte';
	import Icon from './Icon.svelte';

	let {
		buildingId,
		apartment = {},
		errors = {}
	}: {
		buildingId: string;
		apartment?: Partial<Apartment>;
		errors?: Record<string, string>;
	} = $props();

	const inputClass =
		'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white';
	const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

	const initial = $derived({
		floor: apartment.floor === undefined ? '' : String(apartment.floor),
		area: apartment.area ?? '',
		rooms: normalizeDecimal(String(apartment.rooms ?? ''))
	});

	let number = $state(untrack(() => apartment.number ?? ''));
	let numberTaken = $state(false);

	// Warn while typing when another apartment of the building already has this number
	$effect(() => {
		const candidate = number.trim();
		const params = new URLSearchParams({
			buildingId,
			number: candidate,
			excludeId: apartment.id ?? ''
		});
		if (!buildingId || !candidate) {
			numberTaken = false;
			return;
		}
		const timer = setTimeout(async () => {
			const response = await fetch(`/api/apartments/check-number?${params}`);
			numberTaken = response.ok && (await response.json()).exists;
		}, 300);
		return () => clearTimeout(timer);
	});
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
	<div>
		<label for="floor" class={labelClass}>Stockwerk <span class="text-critical">*</span></label>
		<select
			id="floor"
			name="floor"
			value={initial.floor}
			data-testid="apartment-floor-select"
			class={inputClass}
		>
			<option value="">Stockwerk auswählen...</option>
			{#each floorOptions as floor (floor.value)}
				<option value={floor.value}>{floor.label}</option>
			{/each}
		</select>
		<FieldError message={errors.floor} />
	</div>
	<div>
		<label for="number" class={labelClass}>Wohnungsnummer <span class="text-critical">*</span></label
		>
		<input
			id="number"
			name="number"
			value={number}
			oninput={(e) => (number = e.currentTarget.value)}
			placeholder="z.B. 2.04"
			data-testid="apartment-number-input"
			class={inputClass}
		/>
		{#if numberTaken}
			<p
				class="mt-2 flex items-start gap-2 text-sm text-caution bg-amber-50 border border-amber-200 rounded-lg p-3"
				data-testid="apartment-number-taken"
			>
				<Icon name="warning" size={18} class="text-caution" />
				Die Wohnungsnummer "{number.trim()}" existiert bereits in diesem Gebäude.
			</p>
		{/if}
		<FieldError message={errors.number} />
	</div>
</div>

<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
	<div>
		<label for="area" class={labelClass}>Fläche (m²) <span class="text-critical">*</span></label>
		<input
			id="area"
			name="area"
			type="number"
			step="0.1"
			min="1"
			value={initial.area}
			placeholder="85"
			data-testid="apartment-area-input"
			class={inputClass}
		/>
		<FieldError message={errors.area} />
	</div>
	<div>
		<label for="rooms" class={labelClass}>Zimmeranzahl <span class="text-critical">*</span></label>
		<select
			id="rooms"
			name="rooms"
			value={initial.rooms}
			data-testid="apartment-rooms-select"
			class={inputClass}
		>
			<option value="">Zimmer auswählen...</option>
			{#each roomOptions as rooms (rooms)}
				<option value={rooms}>{rooms} Zimmer</option>
			{/each}
		</select>
		<FieldError message={errors.rooms} />
	</div>
</div>
