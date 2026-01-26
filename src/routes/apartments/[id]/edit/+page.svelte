<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';
	import type { Apartment } from '$lib/types';

	interface PageData {
		apartment: Apartment;
		buildings: { id: string; name: string; address: string }[];
	}

	let { data }: { data: PageData } = $props();

	// Form state - using functions to capture initial values
	// This pattern is intentional for edit forms where we want initial snapshot
	let buildingId = $state((() => data.apartment.building_id)());
	let floor = $state((() => data.apartment.floor)());
	let addressUnit = $state((() => data.apartment.address_unit)());
	let sizeM2 = $state((() => data.apartment.size_m2.toString())());
	let roomCount = $state((() => data.apartment.room_count.toString())());
	let occupancyStatus = $state((() => data.apartment.occupancy_status)());

	let isSubmitting = $state(false);
	let errors = $state<Record<string, string>>({});

	// Common floor options
	const floorOptions = ['UG', 'EG', '1.OG', '2.OG', '3.OG', '4.OG', '5.OG', 'DG'];

	// Common room count options
	const roomOptions = ['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5', '5.5', '6', '6.5'];

	// Status options
	const statusOptions = [
		{ value: 'Vermietet', label: 'Vermietet', color: 'text-green-600' },
		{ value: 'Leer', label: 'Leer', color: 'text-amber-600' },
		{ value: 'Gesperrt', label: 'Gesperrt', color: 'text-red-600' }
	];

	function validate(): boolean {
		const newErrors: Record<string, string> = {};

		if (!buildingId) {
			newErrors.buildingId = 'Bitte wählen Sie ein Gebäude aus';
		}
		if (!floor.trim()) {
			newErrors.floor = 'Stockwerk ist erforderlich';
		}
		if (!addressUnit.trim()) {
			newErrors.addressUnit = 'Wohnungsnummer ist erforderlich';
		}
		if (!sizeM2.trim()) {
			newErrors.sizeM2 = 'Fläche ist erforderlich';
		} else if (isNaN(parseFloat(sizeM2)) || parseFloat(sizeM2) <= 0) {
			newErrors.sizeM2 = 'Bitte geben Sie eine gültige Fläche ein';
		}
		if (!roomCount) {
			newErrors.roomCount = 'Zimmeranzahl ist erforderlich';
		}

		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();

		if (!validate()) return;

		isSubmitting = true;

		try {
			// In production, call the API
			// const response = await fetch(`/api/apartments/${data.apartment.id}`, {
			// 	method: 'PUT',
			// 	headers: { 'Content-Type': 'application/json' },
			// 	body: JSON.stringify({
			// 		building_id: buildingId,
			// 		floor,
			// 		address_unit: addressUnit,
			// 		size_m2: parseFloat(sizeM2),
			// 		room_count: parseFloat(roomCount),
			// 		occupancy_status: occupancyStatus
			// 	})
			// });

			// Mock success
			await new Promise((r) => setTimeout(r, 500));
			await goto(`/apartments/${data.apartment.id}`);
		} catch (error) {
			console.error('Error updating apartment:', error);
			errors = { form: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.' };
		} finally {
			isSubmitting = false;
		}
	}
</script>

<svelte:head>
	<title>Wohnung {data.apartment.address_unit} bearbeiten - Dwello</title>
</svelte:head>

<div class="max-w-2xl mx-auto space-y-6">
	<!-- Breadcrumb -->
	<nav class="flex items-center text-sm text-gray-500">
		<a href="/apartments" class="hover:text-primary transition-colors">Wohnungen</a>
		<Icon name="chevron_right" size={16} class="mx-2" />
		<a href="/apartments/{data.apartment.id}" class="hover:text-primary transition-colors">
			Wohnung {data.apartment.address_unit}
		</a>
		<Icon name="chevron_right" size={16} class="mx-2" />
		<span class="text-gray-900 font-medium">Bearbeiten</span>
	</nav>

	<!-- Header -->
	<div>
		<h1 class="text-2xl font-bold text-gray-900">Wohnung {data.apartment.address_unit} bearbeiten</h1>
		<p class="text-gray-500 mt-1">Ändern Sie die Wohnungsdaten.</p>
	</div>

	<!-- Form -->
	<Card>
		<form onsubmit={handleSubmit} class="space-y-6">
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
					bind:value={buildingId}
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
						bind:value={floor}
						class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white {errors.floor
							? 'border-red-500'
							: 'border-gray-300'}"
					>
						<option value="">Stockwerk auswählen...</option>
						{#each floorOptions as f}
							<option value={f}>{f}</option>
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
						type="text"
						bind:value={addressUnit}
						placeholder="z.B. 2.04"
						class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary {errors.addressUnit
							? 'border-red-500'
							: 'border-gray-300'}"
					/>
					{#if errors.addressUnit}
						<p class="mt-1 text-sm text-red-600">{errors.addressUnit}</p>
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
							type="number"
							step="0.1"
							min="1"
							bind:value={sizeM2}
							placeholder="85"
							class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary {errors.sizeM2
								? 'border-red-500'
								: 'border-gray-300'}"
						/>
						<span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">m²</span>
					</div>
					{#if errors.sizeM2}
						<p class="mt-1 text-sm text-red-600">{errors.sizeM2}</p>
					{/if}
				</div>
				<div>
					<label for="roomCount" class="block text-sm font-medium text-gray-700 mb-1">
						Zimmeranzahl <span class="text-red-500">*</span>
					</label>
					<select
						id="roomCount"
						bind:value={roomCount}
						class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white {errors.roomCount
							? 'border-red-500'
							: 'border-gray-300'}"
					>
						<option value="">Zimmer auswählen...</option>
						{#each roomOptions as r}
							<option value={r}>{r} Zimmer</option>
						{/each}
					</select>
					{#if errors.roomCount}
						<p class="mt-1 text-sm text-red-600">{errors.roomCount}</p>
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
			{#if data.apartment.occupancy_status === 'Vermietet' && occupancyStatus !== 'Vermietet'}
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
