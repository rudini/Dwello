<script lang="ts">
	import { untrack } from 'svelte';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { addToast } from '$lib/stores';
	import AddressSearch from './AddressSearch.svelte';
	import type { Address } from '$lib/services/openplz';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { focusFirstError } from '$lib/ui/focus-error';
	import Select from '$lib/ui/Select.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';

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

	// The server opens the saved building; the toast says which one was saved
	const submit: SubmitFunction = () => {
		isSubmitting = true;
		return async ({ result, update, formElement }) => {
			if (result.type === 'redirect') addToast('success', `Gebäude ${name} gespeichert`);
			await update({ reset: false });
			isSubmitting = false;
			focusFirstError(formElement);
		};
	};

	const cantons = [
		['AG', 'Aargau'],
		['AI', 'Appenzell Innerrhoden'],
		['AR', 'Appenzell Ausserrhoden'],
		['BE', 'Bern'],
		['BL', 'Basel-Landschaft'],
		['BS', 'Basel-Stadt'],
		['FR', 'Fribourg'],
		['GE', 'Genf'],
		['GL', 'Glarus'],
		['GR', 'Graubünden'],
		['JU', 'Jura'],
		['LU', 'Luzern'],
		['NE', 'Neuenburg'],
		['NW', 'Nidwalden'],
		['OW', 'Obwalden'],
		['SG', 'St. Gallen'],
		['SH', 'Schaffhausen'],
		['SO', 'Solothurn'],
		['SZ', 'Schwyz'],
		['TG', 'Thurgau'],
		['TI', 'Tessin'],
		['UR', 'Uri'],
		['VD', 'Waadt'],
		['VS', 'Wallis'],
		['ZG', 'Zug'],
		['ZH', 'Zürich']
	].map(([value, label]) => ({ value, label: `${label} (${value})` }));

	// Gebäudetyp (UBIQUITOUS_LANGUAGE.md)
	const buildingTypes = [
		'Mehrfamilienhaus',
		'Einfamilienhaus',
		'Geschäftshaus',
		'Gewerbegebäude',
		'Mischnutzung'
	].map((type) => ({ value: type, label: type }));

	function handleAddressSelect(selected: Address) {
		if (selected.street) address = selected.street;
		postalCode = selected.postalCode;
		city = selected.city;
		canton = selected.cantonShort;
	}
</script>

<form method="POST" use:enhance={submit} class="flex flex-col gap-8">
	{#if errors.form}
		<Alert tone="critical" title="Nicht gespeichert" testid="form-error">
			<p>{errors.form}</p>
		</Alert>
	{/if}

	<TextInput
		id="name"
		name="name"
		label="Gebäudename"
		help="Ein Name, an dem Sie das Gebäude erkennen."
		example="Musterhaus Zentrum"
		bind:value={name}
		error={errors.name}
		testid="building-name-input"
	/>

	<fieldset class="flex flex-col gap-6">
		<legend class="mb-4 text-xl font-bold text-ink">Adresse</legend>
		{#if isCreate}
			<AddressSearch
				help="Geben Sie Strasse, PLZ oder Ort ein und wählen Sie einen Treffer: Dwello füllt die Felder darunter aus."
				example="Bahnhofstrasse Zürich"
				onselect={handleAddressSelect}
			/>
		{/if}
		<TextInput
			id="address"
			name="address"
			label="Strasse und Hausnummer"
			example="Musterstrasse 12"
			bind:value={address}
			error={errors.address}
			testid="building-address-input"
		/>
		<div class="grid gap-6 sm:grid-cols-3">
			<TextInput
				id="postalCode"
				name="postalCode"
				label="PLZ"
				example="8400"
				bind:value={postalCode}
				error={errors.postalCode}
				testid="building-postal-code-input"
			/>
			<div class="sm:col-span-2">
				<TextInput
					id="city"
					name="city"
					label="Ort"
					example="Winterthur"
					bind:value={city}
					error={errors.city}
					testid="building-city-input"
				/>
			</div>
		</div>
		<Select
			id="canton"
			name="canton"
			label="Kanton"
			help={isCreate ? 'Wird mit der Adresssuche ausgefüllt.' : undefined}
			options={cantons}
			placeholder="Kanton wählen"
			bind:value={canton}
			error={errors.canton}
			testid="building-canton-select"
		/>
	</fieldset>

	<fieldset class="flex flex-col gap-6">
		<legend class="mb-4 text-xl font-bold text-ink">Weitere Angaben</legend>
		<div class="grid gap-6 sm:grid-cols-2">
			<Select
				id="buildingType"
				name="buildingType"
				label="Gebäudetyp"
				help="Mehrfamilienhaus, Einfamilienhaus, Geschäftshaus, Gewerbegebäude oder Mischnutzung."
				options={buildingTypes}
				placeholder="Nicht angegeben"
				bind:value={buildingType}
				optional
			/>
			<TextInput
				id="yearBuilt"
				name="yearBuilt"
				type="number"
				label="Baujahr"
				help="Jahr, in dem das Gebäude erstellt wurde."
				example="1985"
				min="1800"
				max={String(new Date().getFullYear())}
				bind:value={yearBuilt}
				error={errors.yearBuilt}
				optional
				testid="building-year-built-input"
			/>
		</div>
	</fieldset>

	<div class="flex flex-col-reverse gap-4 border-t border-line pt-6 sm:flex-row">
		<Button href={cancelHref} testid="form-cancel">Abbrechen</Button>
		<Button
			type="submit"
			variant="primary"
			icon={isCreate ? 'add' : 'save'}
			busy={isSubmitting}
			busyLabel="Wird gespeichert …"
			testid="building-form-submit"
		>
			{isCreate ? 'Gebäude erfassen' : 'Änderungen speichern'}
		</Button>
	</div>
</form>
