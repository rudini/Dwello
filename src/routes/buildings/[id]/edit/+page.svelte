<script lang="ts">
	import { enhance } from '$app/forms';
	import type { BuildingEditData } from './+page.server';
	import type { ActionData } from './$types';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';
	import FieldError from '$lib/components/FieldError.svelte';

	let { data, form }: { data: BuildingEditData; form: ActionData } = $props();

	// Reactive building reference for display
	const building = $derived(data.building);

	// Form state initialized from building data
	let name = $state(data.building.name || '');
	let address = $state(data.building.address);
	let postalCode = $state(data.building.postalCode);
	let city = $state(data.building.city);
	let canton = $state(data.building.canton || '');
	let buildingType = $state(data.building.buildingType || '');
	let yearBuilt = $state(data.building.yearBuilt?.toString() || '');

	let isSubmitting = $state(false);

	// Get errors from form action
	const errors = $derived(form?.errors || {});

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
</script>

<svelte:head>
	<title>Gebäude bearbeiten - Dwello</title>
</svelte:head>

<div class="max-w-2xl mx-auto space-y-6">
	<!-- Breadcrumb -->
	<nav class="flex items-center text-sm text-gray-500">
		<a href="/buildings" data-testid="breadcrumb-link" class="hover:text-blue-600 transition-colors">Gebäude</a>
		<Icon name="chevron_right" size={16} class="mx-2" />
		<a href="/buildings/{building.id}" data-testid="breadcrumb-link" class="hover:text-blue-600 transition-colors">
			{building.name || building.address}
		</a>
		<Icon name="chevron_right" size={16} class="mx-2" />
		<span class="text-gray-900 font-medium">Bearbeiten</span>
	</nav>

	<!-- Header -->
	<div>
		<h1 class="text-2xl font-bold text-gray-900">Gebäude bearbeiten</h1>
		<p class="text-gray-500 mt-1">
			Bearbeiten Sie die Details von {building.name || building.address}.
		</p>
	</div>

	<!-- Form -->
	<Card>
		<form method="POST" use:enhance={() => {
			isSubmitting = true;
			return async ({ update }) => {
				await update({ reset: false });
				isSubmitting = false;
			};
		}} class="space-y-6">
			{#if errors.form}
				<div class="bg-red-50 border border-red-200 rounded-lg p-4">
					<p class="text-sm text-red-700" data-testid="form-error">{errors.form}</p>
				</div>
			{/if}

			<!-- Name -->
			<div>
				<label for="name" class="block text-sm font-medium text-gray-700 mb-1">
					Gebäudename <span class="text-red-500">*</span>
				</label>
				<input
					id="name"
					data-testid="building-name-input"
					name="name"
					type="text"
					bind:value={name}
					placeholder="z.B. Musterhaus Zentrum"
					class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
				/>
				<p class="mt-1 text-sm text-gray-500">
					Ein Name zur besseren Identifikation des Gebäudes.
				</p>
				<FieldError message={errors.name} />
			</div>

			<!-- Address -->
			<div>
				<label for="address" class="block text-sm font-medium text-gray-700 mb-1">
					Adresse <span class="text-red-500">*</span>
				</label>
				<input
					id="address"
					data-testid="building-address-input"
					name="address"
					type="text"
					bind:value={address}
					placeholder="Strasse und Hausnummer"
					class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 {errors.address
						? 'border-red-500'
						: 'border-gray-300'}"
				/>
				<FieldError message={errors.address} />
			</div>

			<!-- Postal Code & City -->
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<div>
					<label for="postalCode" class="block text-sm font-medium text-gray-700 mb-1">
						PLZ <span class="text-red-500">*</span>
					</label>
					<input
						id="postalCode"
						data-testid="building-postal-code-input"
						name="postalCode"
						type="text"
						bind:value={postalCode}
						placeholder="8000"
						maxlength="4"
						class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 {errors.postalCode
							? 'border-red-500'
							: 'border-gray-300'}"
					/>
					<FieldError message={errors.postalCode} />
				</div>
				<div class="sm:col-span-2">
					<label for="city" class="block text-sm font-medium text-gray-700 mb-1">
						Stadt <span class="text-red-500">*</span>
					</label>
					<input
						id="city"
						data-testid="building-city-input"
						name="city"
						type="text"
						bind:value={city}
						placeholder="Zürich"
						class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 {errors.city
							? 'border-red-500'
							: 'border-gray-300'}"
					/>
					<FieldError message={errors.city} />
				</div>
			</div>

			<!-- Canton -->
			<div>
				<label for="canton" class="block text-sm font-medium text-gray-700 mb-1">
					Kanton <span class="text-red-500">*</span>
				</label>
				<select
					id="canton"
					data-testid="building-canton-select"
					name="canton"
					bind:value={canton}
					class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
				>
					<option value="">Kanton auswählen...</option>
					{#each cantons as c}
						<option value={c.value}>{c.label} ({c.value})</option>
					{/each}
				</select>
				<FieldError message={errors.canton} />
			</div>

			<!-- Building Type & Year Built -->
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div>
					<label for="buildingType" class="block text-sm font-medium text-gray-700 mb-1">
						Gebäudetyp <span class="text-gray-400">(optional)</span>
					</label>
					<select
						id="buildingType"
						name="buildingType"
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
						data-testid="building-year-built-input"
						name="yearBuilt"
						type="number"
						bind:value={yearBuilt}
						placeholder="z.B. 1985"
						min="1800"
						max={new Date().getFullYear()}
						class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 {errors.yearBuilt
							? 'border-red-500'
							: 'border-gray-300'}"
					/>
					<FieldError message={errors.yearBuilt} />
				</div>
			</div>

			<!-- Actions -->
			<div class="flex gap-3 pt-4 border-t border-gray-200">
				<Button href="/buildings/{building.id}" variant="secondary" testid="form-cancel">Abbrechen</Button>
				<Button type="submit" variant="primary" disabled={isSubmitting} testid="building-form-submit">
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
