<script lang="ts">
	import { untrack } from 'svelte';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import FieldError from '$lib/components/FieldError.svelte';
	import AddressSearch from '$lib/components/AddressSearch.svelte';
	import type { Address } from '$lib/services/openplz';

	interface BuildingValues {
		name?: string | null;
		address?: string;
		postalCode?: string;
		city?: string;
		canton?: string | null;
		buildingType?: string | null;
		yearBuilt?: number | null;
	}

	interface Props {
		mode: 'create' | 'edit';
		initial?: BuildingValues;
		errors: Record<string, string | undefined>;
		cancelHref: string;
	}

	let { mode, initial = {}, errors, cancelHref }: Props = $props();

	// Mode-specific UI copy and layout
	const modes = {
		create: {
			addressHeading: 'Adressdaten',
			addressLabel: 'Strasse und Hausnummer',
			addressPlaceholder: 'Musterstrasse 12',
			cantonHint: '(wird automatisch erkannt)',
			detailsHeading: 'Gebäudedetails',
			fieldHint: '',
			addressSectionClass: 'border-t border-gray-200 pt-6 space-y-4',
			detailsSectionClass: 'border-t border-gray-200 pt-6 space-y-4',
			submitIcon: 'add',
			submitLabel: 'Gebäude erstellen',
			submittingLabel: 'Wird erstellt...'
		},
		edit: {
			addressHeading: '',
			addressLabel: 'Adresse',
			addressPlaceholder: 'Strasse und Hausnummer',
			cantonHint: '',
			detailsHeading: '',
			fieldHint: '(optional)',
			addressSectionClass: 'space-y-6',
			detailsSectionClass: '',
			submitIcon: 'save',
			submitLabel: 'Änderungen speichern',
			submittingLabel: 'Wird gespeichert...'
		}
	};
	const copy = $derived(modes[mode]);
	const isCreate = $derived(mode === 'create');

	// Form state, seeded once from the initial values
	const start = untrack(() => initial);
	let name = $state(start.name || '');
	let address = $state(start.address || '');
	let postalCode = $state(start.postalCode || '');
	let city = $state(start.city || '');
	let canton = $state(start.canton || '');
	let buildingType = $state(start.buildingType || '');
	let yearBuilt = $state(start.yearBuilt?.toString() || '');

	let isSubmitting = $state(false);

	// Show the detected canton next to the city after an address search
	const showCantonBadge = $derived(isCreate && !!canton);

	// Keep edited values after a successful edit; clear the form after a create
	const submit: SubmitFunction = () => {
		isSubmitting = true;
		return async ({ update }) => {
			await update({ reset: isCreate });
			isSubmitting = false;
		};
	};

	const inputClass =
		'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary';
	const selectClass = `${inputClass} border-gray-300 bg-white`;
	const borderFor = (field: string) => (errors[field] ? 'border-red-500' : 'border-gray-300');

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

	// Handle address selection from OpenPLZ
	function handleAddressSelect(selectedAddress: Address) {
		if (selectedAddress.street) {
			address = selectedAddress.street;
		}
		postalCode = selectedAddress.postalCode;
		city = selectedAddress.city;
		canton = selectedAddress.cantonShort;
	}
</script>

{#snippet heading(text: string, hint = '')}
	{#if text}
		<h3 class="text-sm font-medium text-gray-700">
			{text} <span class="text-gray-400">{hint}</span>
		</h3>
	{/if}
{/snippet}

<form method="POST" use:enhance={submit} class="space-y-6">
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
			class="{inputClass} border-gray-300"
		/>
		<p class="mt-1 text-sm text-gray-500">Ein Name zur besseren Identifikation des Gebäudes.</p>
		<FieldError message={errors.name} />
	</div>

	{#if isCreate}
		<!-- Address Search with OpenPLZ -->
		<div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
			<div class="flex items-start gap-3 mb-3">
				<Icon name="search" size={20} class="text-blue-600 mt-0.5" />
				<div>
					<p class="font-medium text-blue-800">Adresse suchen</p>
					<p class="text-sm text-blue-600">
						Geben Sie Strasse, PLZ oder Ort ein - die Felder werden automatisch ausgefüllt.
					</p>
				</div>
			</div>
			<AddressSearch
				id="address-search"
				label=""
				placeholder="z.B. Bahnhofstrasse Zürich oder 8001"
				onselect={handleAddressSelect}
			/>
		</div>
	{/if}

	<!-- Address data (pre-filled by search or manual entry) -->
	<div class={copy.addressSectionClass}>
		{@render heading(copy.addressHeading)}

		<!-- Address -->
		<div>
			<label for="address" class="block text-sm font-medium text-gray-700 mb-1">
				{copy.addressLabel} <span class="text-red-500">*</span>
			</label>
			<input
				id="address"
				data-testid="building-address-input"
				name="address"
				type="text"
				bind:value={address}
				placeholder={copy.addressPlaceholder}
				class="{inputClass} {borderFor('address')}"
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
					class="{inputClass} {borderFor('postalCode')}"
				/>
				<FieldError message={errors.postalCode} />
			</div>
			<div class="sm:col-span-2">
				<label for="city" class="block text-sm font-medium text-gray-700 mb-1">
					Stadt <span class="text-red-500">*</span>
				</label>
				<div class="relative">
					<input
						id="city"
						data-testid="building-city-input"
						name="city"
						type="text"
						bind:value={city}
						placeholder="Zürich"
						class="{inputClass} {borderFor('city')}"
					/>
					{#if showCantonBadge}
						<span
							class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium"
						>
							{canton}
						</span>
					{/if}
				</div>
				<FieldError message={errors.city} />
			</div>
		</div>

		<!-- Canton -->
		<div>
			<label for="canton" class="block text-sm font-medium text-gray-700 mb-1">
				Kanton <span class="text-red-500">*</span>
				<span class="text-gray-400">{copy.cantonHint}</span>
			</label>
			<select
				id="canton"
				data-testid="building-canton-select"
				name="canton"
				bind:value={canton}
				class={selectClass}
			>
				<option value="">Kanton auswählen...</option>
				{#each cantons as c}
					<option value={c.value}>{c.label} ({c.value})</option>
				{/each}
			</select>
			<FieldError message={errors.canton} />
		</div>
	</div>

	<!-- Building Details -->
	<div class={copy.detailsSectionClass}>
		{@render heading(copy.detailsHeading, '(optional)')}

		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<div>
				<label for="buildingType" class="block text-sm font-medium text-gray-700 mb-1">
					Gebäudetyp <span class="text-gray-400">{copy.fieldHint}</span>
				</label>
				<select id="buildingType" name="buildingType" bind:value={buildingType} class={selectClass}>
					<option value="">Typ auswählen...</option>
					{#each buildingTypes as type}
						<option value={type}>{type}</option>
					{/each}
				</select>
			</div>
			<div>
				<label for="yearBuilt" class="block text-sm font-medium text-gray-700 mb-1">
					Baujahr <span class="text-gray-400">{copy.fieldHint}</span>
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
					class="{inputClass} {borderFor('yearBuilt')}"
				/>
				<FieldError message={errors.yearBuilt} />
			</div>
		</div>
	</div>

	<!-- Actions -->
	<div class="flex gap-3 pt-4 border-t border-gray-200">
		<Button href={cancelHref} variant="secondary" testid="form-cancel">Abbrechen</Button>
		<Button type="submit" variant="primary" disabled={isSubmitting} testid="building-form-submit">
			{#if isSubmitting}
				<span class="animate-spin">
					<Icon name="refresh" size={18} />
				</span>
				{copy.submittingLabel}
			{:else}
				<Icon name={copy.submitIcon} size={18} />
				{copy.submitLabel}
			{/if}
		</Button>
	</div>
</form>
