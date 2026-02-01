<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';

	interface PageData {
		buildings: Array<{ id: string; name: string; address: string }>;
		presetBuildingId: string | null;
	}

	interface ActionData {
		errors?: Record<string, string>;
		values?: Record<string, string>;
	}

	let { data, form }: { data: PageData; form: ActionData | null } = $props();

	// Get buildings from server data
	const buildings = data.buildings;

	// Check if building is preset from URL query parameter
	const presetBuildingId = data.presetBuildingId;
	const presetBuilding = presetBuildingId ? buildings.find(b => b.id === presetBuildingId) : null;
	const isBuildingPreset = !!presetBuilding;

	// Form state - use form data if available (after failed submission)
	let buildingId = $state(form?.values?.buildingId || presetBuildingId || '');
	let floor = $state(form?.values?.floor || '');
	let addressUnit = $state(form?.values?.number || '');
	let sizeM2 = $state(form?.values?.area || '');
	let roomCount = $state(form?.values?.rooms || '');

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

		isCheckingDuplicate = true;

		try {
			const response = await fetch(
				`/api/apartments/check-number?buildingId=${encodeURIComponent(buildingId)}&number=${encodeURIComponent(trimmedNumber)}`
			);

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

	// Get errors from form action response
	const errors = $derived(form?.errors || {});

	// Common floor options (as numeric values for the backend)
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
</script>

<svelte:head>
	<title>Neue Wohnung - Dwello</title>
</svelte:head>

<div class="max-w-2xl mx-auto space-y-6">
	<!-- Breadcrumb -->
	<nav class="flex items-center text-sm text-gray-500">
		{#if isBuildingPreset && presetBuilding}
			<a href="/buildings" class="hover:text-primary transition-colors">Gebäude</a>
			<Icon name="chevron_right" size={16} class="mx-2" />
			<a href="/buildings/{presetBuilding.id}" class="hover:text-primary transition-colors">{presetBuilding.name}</a>
			<Icon name="chevron_right" size={16} class="mx-2" />
			<span class="text-gray-900 font-medium">Neue Wohnung</span>
		{:else}
			<a href="/apartments" class="hover:text-primary transition-colors">Wohnungen</a>
			<Icon name="chevron_right" size={16} class="mx-2" />
			<span class="text-gray-900 font-medium">Neue Wohnung</span>
		{/if}
	</nav>

	<!-- Header -->
	<div>
		<h1 class="text-2xl font-bold text-gray-900">Neue Wohnung erstellen</h1>
		<p class="text-gray-500 mt-1">Fügen Sie eine neue Wohnung zu einem Gebäude hinzu.</p>
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
				{#if isBuildingPreset && presetBuilding}
					<!-- Read-only field when building is preset from URL -->
					<div class="relative">
						<input
							id="building"
							type="text"
							value={presetBuilding.name}
							readonly
							class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
						/>
						<input type="hidden" name="buildingId" value={presetBuildingId} />
						<Icon name="lock" size={18} class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
					</div>
					<p class="mt-1 text-sm text-gray-500">
						{presetBuilding.address}
					</p>
				{:else}
					<!-- Dropdown when no building is preset -->
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
				<Button href={isBuildingPreset ? `/buildings/${presetBuildingId}` : '/apartments'} variant="secondary">Abbrechen</Button>
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
