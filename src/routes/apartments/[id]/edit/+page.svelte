<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';
	import type { Apartment } from '$lib/types';

	interface PageData {
		apartment: Apartment;
		buildings: { id: string; name: string; address: string }[];
	}

	interface ActionData {
		errors?: Record<string, string>;
		values?: Record<string, string>;
	}

	let { data, form }: { data: PageData; form: ActionData | null } = $props();

	// Form state - initialized from apartment data or form values after failed submission
	let buildingId = $state(form?.values?.buildingId || data.apartment.buildingId);
	let floor = $state(form?.values?.floor || String(data.apartment.floor ?? ''));
	let addressUnit = $state(form?.values?.number || data.apartment.number);
	let sizeM2 = $state(form?.values?.area || String(data.apartment.area ?? ''));
	let roomCount = $state(form?.values?.rooms || String(data.apartment.rooms ?? ''));
	let occupancyStatus = $state(data.apartment.status);

	let isSubmitting = $state(false);

	// Duplicate apartment number check
	let isCheckingDuplicate = $state(false);
	let duplicateApartment = $state<{ id: string; number: string } | null>(null);
	let checkTimeout: ReturnType<typeof setTimeout> | null = null;

	// Check if apartment number already exists in the building
	async function checkDuplicateNumber() {
		const trimmedNumber = addressUnit?.trim();

		// Skip check if no building selected or no number entered
		if (!buildingId || !trimmedNumber) {
			duplicateApartment = null;
			return;
		}

		// Skip check if the number hasn't changed from the original
		if (trimmedNumber === data.apartment.number && buildingId === data.apartment.buildingId) {
			duplicateApartment = null;
			return;
		}

		isCheckingDuplicate = true;

		try {
			const response = await fetch(`/api/apartments/check-number?buildingId=${encodeURIComponent(buildingId)}&number=${encodeURIComponent(trimmedNumber)}&excludeId=${data.apartment.id}`);

			if (response.ok) {
				const result = await response.json();
				if (result.exists) {
					duplicateApartment = { id: result.apartmentId, number: trimmedNumber };
				} else {
					duplicateApartment = null;
				}
			}
		} catch (error) {
			console.error('Error checking duplicate apartment number:', error);
		} finally {
			isCheckingDuplicate = false;
		}
	}

	// Debounced check when apartment number or building changes
	function handleNumberChange() {
		if (checkTimeout) {
			clearTimeout(checkTimeout);
		}
		checkTimeout = setTimeout(checkDuplicateNumber, 500);
	}

	// Get errors from form action
	const errors = $derived(form?.errors || {});

	// Floor options (as numeric values for the backend)
	const floorOptions = [
		{ value: '-1', label: 'UG' },
		{ value: '0', label: 'EG' },
		{ value: '1', label: '1.OG' },
		{ value: '2', label: '2.OG' },
		{ value: '3', label: '3.OG' },
		{ value: '4', label: '4.OG' },
		{ value: '5', label: '5.OG' },
		{ value: '6', label: 'DG' }
	];

	// Common room count options
	const roomOptions = ['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5', '5.5', '6', '6.5'];

	// Status options
	const statusOptions = [
		{ value: 'Vermietet', label: 'Vermietet', color: 'text-green-600' },
		{ value: 'Leer', label: 'Leer', color: 'text-amber-600' },
		{ value: 'Gesperrt', label: 'Gesperrt', color: 'text-red-600' }
	];
</script>

<svelte:head>
	<title>Wohnung {data.apartment.number} bearbeiten - Dwello</title>
</svelte:head>

<div class="max-w-2xl mx-auto space-y-6">
	<!-- Breadcrumb -->
	<nav class="flex items-center text-sm text-gray-500">
		<a href="/apartments" class="hover:text-primary transition-colors">Wohnungen</a>
		<Icon name="chevron_right" size={16} class="mx-2" />
		<a href="/apartments/{data.apartment.id}" class="hover:text-primary transition-colors">
			Wohnung {data.apartment.number}
		</a>
		<Icon name="chevron_right" size={16} class="mx-2" />
		<span class="text-gray-900 font-medium">Bearbeiten</span>
	</nav>

	<!-- Header -->
	<div>
		<h1 class="text-2xl font-bold text-gray-900">Wohnung {data.apartment.number} bearbeiten</h1>
		<p class="text-gray-500 mt-1">Ändern Sie die Wohnungsdaten.</p>
	</div>

	<!-- Form -->
	<Card>
		<form method="POST" use:enhance={() => {
			isSubmitting = true;
			return async ({ update }) => {
				await update();
				isSubmitting = false;
			};
		}} class="space-y-6">
			{#if errors.form}
				<div class="bg-red-50 border border-red-200 rounded-lg p-4">
					<p class="text-sm text-red-700">{errors.form}</p>
				</div>
			{/if}

			<!-- Building Selection -->
			<div>
				<label for="building" class="block text-sm font-medium text-gray-700 mb-1">
					Gebäude <span class="text-red-500">*</span>
				</label>
				<select
					id="building"
					name="buildingId"
					bind:value={buildingId}
					onchange={handleNumberChange}
					class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white {errors.buildingId
						? 'border-red-500'
						: 'border-gray-300'}"
				>
					<option value="">Gebäude auswählen...</option>
					{#each data.buildings as building}
						<option value={building.id}>
							{building.name || building.address}
						</option>
					{/each}
				</select>
				{#if errors.buildingId}
					<p class="mt-1 text-sm text-red-600">{errors.buildingId}</p>
				{/if}
			</div>

			<!-- Floor & Address Unit -->
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div>
					<label for="floor" class="block text-sm font-medium text-gray-700 mb-1">
						Stockwerk <span class="text-red-500">*</span>
					</label>
					<select
						id="floor"
						name="floor"
						bind:value={floor}
						class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white {errors.floor
							? 'border-red-500'
							: 'border-gray-300'}"
					>
						<option value="">Stockwerk auswählen...</option>
						{#each floorOptions as f}
							<option value={f.value}>{f.label}</option>
						{/each}
					</select>
					{#if errors.floor}
						<p class="mt-1 text-sm text-red-600">{errors.floor}</p>
					{/if}
				</div>
				<div>
					<label for="addressUnit" class="block text-sm font-medium text-gray-700 mb-1">
						Wohnungsnummer <span class="text-red-500">*</span>
					</label>
					<input
						id="addressUnit"
						name="number"
						type="text"
						bind:value={addressUnit}
						oninput={handleNumberChange}
						placeholder="z.B. 2.04"
						class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary {errors.number || duplicateApartment
							? 'border-red-500'
							: 'border-gray-300'}"
					/>
					{#if isCheckingDuplicate}
						<p class="mt-1 text-sm text-gray-500 flex items-center gap-1">
							<span class="animate-spin inline-block">
								<Icon name="refresh" size={14} />
							</span>
							Prüfe Verfügbarkeit...
						</p>
					{:else if duplicateApartment}
						<div class="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
							<div class="flex items-start gap-2">
								<Icon name="warning" size={18} class="text-amber-600 mt-0.5" />
								<div class="text-sm text-amber-800">
									<p class="font-medium">Wohnungsnummer bereits vergeben</p>
									<p class="mt-1">
										Die Wohnungsnummer "{duplicateApartment.number}" existiert bereits in diesem Gebäude.
										Bitte wählen Sie eine andere Nummer.
									</p>
								</div>
							</div>
						</div>
					{:else if errors.number}
						<p class="mt-1 text-sm text-red-600">{errors.number}</p>
					{/if}
				</div>
			</div>

			<!-- Size & Rooms -->
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div>
					<label for="sizeM2" class="block text-sm font-medium text-gray-700 mb-1">
						Fläche (m²) <span class="text-red-500">*</span>
					</label>
					<div class="relative">
						<input
							id="sizeM2"
							name="area"
							type="number"
							step="0.1"
							min="1"
							bind:value={sizeM2}
							placeholder="85"
							class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary {errors.area
								? 'border-red-500'
								: 'border-gray-300'}"
						/>
						<span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">m²</span>
					</div>
					{#if errors.area}
						<p class="mt-1 text-sm text-red-600">{errors.area}</p>
					{/if}
				</div>
				<div>
					<label for="roomCount" class="block text-sm font-medium text-gray-700 mb-1">
						Zimmeranzahl <span class="text-red-500">*</span>
					</label>
					<select
						id="roomCount"
						name="rooms"
						bind:value={roomCount}
						class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white {errors.rooms
							? 'border-red-500'
							: 'border-gray-300'}"
					>
						<option value="">Zimmer auswählen...</option>
						{#each roomOptions as r}
							<option value={r}>{r} Zimmer</option>
						{/each}
					</select>
					{#if errors.rooms}
						<p class="mt-1 text-sm text-red-600">{errors.rooms}</p>
					{/if}
				</div>
			</div>

			<!-- Occupancy Status -->
			<div>
				<label for="status" class="block text-sm font-medium text-gray-700 mb-1">
					Status
				</label>
				<select
					id="status"
					bind:value={occupancyStatus}
					class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
				>
					{#each statusOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
				<p class="mt-1 text-sm text-gray-500">
					Der Status ändert sich automatisch bei Vertragsänderungen.
				</p>
			</div>

			<!-- Warning if changing status while rented -->
			{#if data.apartment.status === 'occupied' && occupancyStatus !== 'occupied'}
				<div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
					<div class="flex items-start gap-3">
						<Icon name="warning" size={20} class="text-amber-600 mt-0.5" />
						<div class="text-sm text-amber-800">
							<p class="font-medium">Achtung</p>
							<p class="mt-1">
								Diese Wohnung ist aktuell vermietet. Wenn Sie den Status ändern, sollten Sie
								zuerst den aktiven Mietvertrag beenden.
							</p>
						</div>
					</div>
				</div>
			{/if}

			<!-- Actions -->
			<div class="flex gap-3 pt-4 border-t border-gray-200">
				<Button href="/apartments/{data.apartment.id}" variant="secondary">Abbrechen</Button>
				<Button type="submit" variant="primary" disabled={isSubmitting}>
					{#if isSubmitting}
						<span class="animate-spin">
							<Icon name="refresh" size={18} />
						</span>
						Wird gespeichert...
					{:else}
						<Icon name="save" size={18} />
						Änderungen speichern
					{/if}
				</Button>
			</div>
		</form>
	</Card>
</div>
