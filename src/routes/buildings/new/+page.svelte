<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';

	// Form state
	let name = $state('');
	let address = $state('');
	let postalCode = $state('');
	let city = $state('');
	let canton = $state('');
	let buildingType = $state('');
	let yearBuilt = $state('');

	let isSubmitting = $state(false);
	let errors = $state<Record<string, string>>({});

	// Swiss cantons
	const cantons = [
		{ value: 'AG', label: 'Aargau' },
		{ value: 'AI', label: 'Appenzell Innerrhoden' },
		{ value: 'AR', label: 'Appenzell Ausserrhoden' },
		{ value: 'BE', label: 'Bern' },
		{ value: 'BL', label: 'Basel-Landschaft' },
		{ value: 'BS', label: 'Basel-Stadt' },
		{ value: 'FR', label: 'Fribourg' },
		{ value: 'GE', label: 'Genf' },
		{ value: 'GL', label: 'Glarus' },
		{ value: 'GR', label: 'Graubünden' },
		{ value: 'JU', label: 'Jura' },
		{ value: 'LU', label: 'Luzern' },
		{ value: 'NE', label: 'Neuenburg' },
		{ value: 'NW', label: 'Nidwalden' },
		{ value: 'OW', label: 'Obwalden' },
		{ value: 'SG', label: 'St. Gallen' },
		{ value: 'SH', label: 'Schaffhausen' },
		{ value: 'SO', label: 'Solothurn' },
		{ value: 'SZ', label: 'Schwyz' },
		{ value: 'TG', label: 'Thurgau' },
		{ value: 'TI', label: 'Tessin' },
		{ value: 'UR', label: 'Uri' },
		{ value: 'VD', label: 'Waadt' },
		{ value: 'VS', label: 'Wallis' },
		{ value: 'ZG', label: 'Zug' },
		{ value: 'ZH', label: 'Zürich' }
	];

	const buildingTypes = [
		'Mehrfamilienhaus',
		'Einfamilienhaus',
		'Geschäftshaus',
		'Gewerbegebäude',
		'Mischnutzung'
	];

	function validate(): boolean {
		const newErrors: Record<string, string> = {};

		if (!address.trim()) {
			newErrors.address = 'Adresse ist erforderlich';
		}
		if (!postalCode.trim()) {
			newErrors.postalCode = 'PLZ ist erforderlich';
		} else if (!/^\d{4}$/.test(postalCode)) {
			newErrors.postalCode = 'PLZ muss 4 Ziffern haben';
		}
		if (!city.trim()) {
			newErrors.city = 'Stadt ist erforderlich';
		}
		if (yearBuilt && (isNaN(parseInt(yearBuilt)) || parseInt(yearBuilt) < 1800 || parseInt(yearBuilt) > new Date().getFullYear())) {
			newErrors.yearBuilt = 'Baujahr muss zwischen 1800 und heute liegen';
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
			// const response = await fetch('/api/buildings', {
			// 	method: 'POST',
			// 	headers: { 'Content-Type': 'application/json' },
			// 	body: JSON.stringify({
			// 		name: name || undefined,
			// 		address,
			// 		postalCode,
			// 		city,
			// 		canton: canton || undefined,
			// 		buildingType: buildingType || undefined,
			// 		yearBuilt: yearBuilt ? parseInt(yearBuilt) : undefined
			// 	})
			// });

			// Mock success
			await new Promise((r) => setTimeout(r, 500));
			await goto('/buildings');
		} catch (error) {
			console.error('Error creating building:', error);
			errors = { form: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.' };
		} finally {
			isSubmitting = false;
		}
	}
</script>

<svelte:head>
	<title>Neues Gebäude - Dwello</title>
</svelte:head>

<div class="max-w-2xl mx-auto space-y-6">
	<!-- Breadcrumb -->
	<nav class="flex items-center text-sm text-gray-500">
		<a href="/buildings" class="hover:text-blue-600 transition-colors">Gebäude</a>
		<Icon name="chevron_right" size={16} class="mx-2" />
		<span class="text-gray-900 font-medium">Neues Gebäude</span>
	</nav>

	<!-- Header -->
	<div>
		<h1 class="text-2xl font-bold text-gray-900">Neues Gebäude erstellen</h1>
		<p class="text-gray-500 mt-1">Fügen Sie ein neues Gebäude zu Ihrem Portfolio hinzu.</p>
	</div>

	<!-- Form -->
	<Card>
		<form onsubmit={handleSubmit} class="space-y-6">
			{#if errors.form}
				<div class="bg-red-50 border border-red-200 rounded-lg p-4">
					<p class="text-sm text-red-700">{errors.form}</p>
				</div>
			{/if}

			<!-- Name (optional) -->
			<div>
				<label for="name" class="block text-sm font-medium text-gray-700 mb-1">
					Gebäudename <span class="text-gray-400">(optional)</span>
				</label>
				<input
					id="name"
					type="text"
					bind:value={name}
					placeholder="z.B. Musterhaus Zentrum"
					class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
				/>
				<p class="mt-1 text-sm text-gray-500">
					Ein optionaler Name zur besseren Identifikation des Gebäudes.
				</p>
			</div>

			<!-- Address -->
			<div>
				<label for="address" class="block text-sm font-medium text-gray-700 mb-1">
					Adresse <span class="text-red-500">*</span>
				</label>
				<input
					id="address"
					type="text"
					bind:value={address}
					placeholder="Strasse und Hausnummer"
					class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 {errors.address
						? 'border-red-500'
						: 'border-gray-300'}"
				/>
				{#if errors.address}
					<p class="mt-1 text-sm text-red-600">{errors.address}</p>
				{/if}
			</div>

			<!-- Postal Code & City -->
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<div>
					<label for="postalCode" class="block text-sm font-medium text-gray-700 mb-1">
						PLZ <span class="text-red-500">*</span>
					</label>
					<input
						id="postalCode"
						type="text"
						bind:value={postalCode}
						placeholder="8000"
						maxlength="4"
						class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 {errors.postalCode
							? 'border-red-500'
							: 'border-gray-300'}"
					/>
					{#if errors.postalCode}
						<p class="mt-1 text-sm text-red-600">{errors.postalCode}</p>
					{/if}
				</div>
				<div class="sm:col-span-2">
					<label for="city" class="block text-sm font-medium text-gray-700 mb-1">
						Stadt <span class="text-red-500">*</span>
					</label>
					<input
						id="city"
						type="text"
						bind:value={city}
						placeholder="Zürich"
						class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 {errors.city
							? 'border-red-500'
							: 'border-gray-300'}"
					/>
					{#if errors.city}
						<p class="mt-1 text-sm text-red-600">{errors.city}</p>
					{/if}
				</div>
			</div>

			<!-- Canton -->
			<div>
				<label for="canton" class="block text-sm font-medium text-gray-700 mb-1">
					Kanton <span class="text-gray-400">(optional)</span>
				</label>
				<select
					id="canton"
					bind:value={canton}
					class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
				>
					<option value="">Kanton auswählen...</option>
					{#each cantons as c}
						<option value={c.value}>{c.label} ({c.value})</option>
					{/each}
				</select>
			</div>

			<!-- Building Type & Year Built -->
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div>
					<label for="buildingType" class="block text-sm font-medium text-gray-700 mb-1">
						Gebäudetyp <span class="text-gray-400">(optional)</span>
					</label>
					<select
						id="buildingType"
						bind:value={buildingType}
						class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
					>
						<option value="">Typ auswählen...</option>
						{#each buildingTypes as type}
							<option value={type}>{type}</option>
						{/each}
					</select>
				</div>
				<div>
					<label for="yearBuilt" class="block text-sm font-medium text-gray-700 mb-1">
						Baujahr <span class="text-gray-400">(optional)</span>
					</label>
					<input
						id="yearBuilt"
						type="number"
						bind:value={yearBuilt}
						placeholder="z.B. 1985"
						min="1800"
						max={new Date().getFullYear()}
						class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 {errors.yearBuilt
							? 'border-red-500'
							: 'border-gray-300'}"
					/>
					{#if errors.yearBuilt}
						<p class="mt-1 text-sm text-red-600">{errors.yearBuilt}</p>
					{/if}
				</div>
			</div>

			<!-- Actions -->
			<div class="flex gap-3 pt-4 border-t border-gray-200">
				<Button href="/buildings" variant="secondary">Abbrechen</Button>
				<Button type="submit" variant="primary" disabled={isSubmitting}>
					{#if isSubmitting}
						<span class="animate-spin">
							<Icon name="refresh" size={18} />
						</span>
						Wird erstellt...
					{:else}
						<Icon name="add" size={18} />
						Gebäude erstellen
					{/if}
				</Button>
			</div>
		</form>
	</Card>
</div>
