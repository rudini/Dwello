<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';

	// Mock buildings for dropdown
	const buildings = [
		{ id: 'building-001', name: 'Musterhaus Zentrum', address: 'Musterstraße 12, 8000 Zürich' },
		{ id: 'building-002', name: 'Seepark Residenz', address: 'Seestrasse 45, 6004 Luzern' },
		{ id: 'building-003', name: 'Alpenblick', address: 'Bergweg 7, 3012 Bern' }
	];

	// Form state
	let buildingId = $state('');
	let floor = $state('');
	let addressUnit = $state('');
	let sizeM2 = $state('');
	let roomCount = $state('');

	let isSubmitting = $state(false);
	let errors = $state<Record<string, string>>({});

	// Common floor options
	const floorOptions = ['UG', 'EG', '1.OG', '2.OG', '3.OG', '4.OG', '5.OG', 'DG'];

	// Common room count options
	const roomOptions = ['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5', '5.5', '6', '6.5'];

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
			// const response = await fetch('/api/apartments', {
			// 	method: 'POST',
			// 	headers: { 'Content-Type': 'application/json' },
			// 	body: JSON.stringify({
			// 		building_id: buildingId,
			// 		floor,
			// 		address_unit: addressUnit,
			// 		size_m2: parseFloat(sizeM2),
			// 		room_count: parseFloat(roomCount),
			// 		occupancy_status: 'Leer'
			// 	})
			// });

			// Mock success
			await new Promise((r) => setTimeout(r, 500));
			await goto('/apartments');
		} catch (error) {
			console.error('Error creating apartment:', error);
			errors = { form: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.' };
		} finally {
			isSubmitting = false;
		}
	}
</script>

<svelte:head>
	<title>Neue Wohnung - Dwello</title>
</svelte:head>

<div class="max-w-2xl mx-auto space-y-6">
	<!-- Breadcrumb -->
	<nav class="flex items-center text-sm text-gray-500">
		<a href="/apartments" class="hover:text-primary transition-colors">Wohnungen</a>
		<Icon name="chevron_right" size={16} class="mx-2" />
		<span class="text-gray-900 font-medium">Neue Wohnung</span>
	</nav>

	<!-- Header -->
	<div>
		<h1 class="text-2xl font-bold text-gray-900">Neue Wohnung erstellen</h1>
		<p class="text-gray-500 mt-1">Fügen Sie eine neue Wohnung zu einem Gebäude hinzu.</p>
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
					{#each buildings as building}
						<option value={building.id}>
							{building.name || building.address}
						</option>
					{/each}
				</select>
				{#if errors.buildingId}
					<p class="mt-1 text-sm text-red-600">{errors.buildingId}</p>
				{:else}
					<p class="mt-1 text-sm text-gray-500">
						Die Wohnung wird diesem Gebäude zugeordnet.
					</p>
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

			<!-- Info Note -->
			<div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
				<div class="flex items-start gap-3">
					<Icon name="info" size={20} class="text-primary mt-0.5" />
					<div class="text-sm text-blue-800">
						<p class="font-medium">Hinweis</p>
						<p class="mt-1">
							Die Wohnung wird zunächst als "Leer" markiert. Sie können später einen Mieter zuweisen,
							indem Sie einen Mietvertrag erstellen.
						</p>
					</div>
				</div>
			</div>

			<!-- Actions -->
			<div class="flex gap-3 pt-4 border-t border-gray-200">
				<Button href="/apartments" variant="secondary">Abbrechen</Button>
				<Button type="submit" variant="primary" disabled={isSubmitting}>
					{#if isSubmitting}
						<span class="animate-spin">
							<Icon name="refresh" size={18} />
						</span>
						Wird erstellt...
					{:else}
						<Icon name="add" size={18} />
						Wohnung erstellen
					{/if}
				</Button>
			</div>
		</form>
	</Card>
</div>
