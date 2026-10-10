<script lang="ts">
	import { untrack } from 'svelte';
	import type { Category } from '$lib/types';
	import Checkbox from '$lib/ui/Checkbox.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';
	import SaveForm from '../SaveForm.svelte';

	let {
		category,
		errors = {},
		submitLabel
	}: { category?: Category; errors?: Record<string, string>; submitLabel: string } = $props();

	const translations = [
		{ key: 'nameFR', label: 'Französisch' },
		{ key: 'nameIT', label: 'Italienisch' },
		{ key: 'nameEN', label: 'Englisch' }
	] as const;
	// The record's texts (empty for a new one), its number and the checkbox as the fields hold them
	let values = $state(
		untrack(() => ({
			...{ name: '', description: '', nameFR: '', nameIT: '', nameEN: '' },
			...category,
			sortOrder: String(category?.sortOrder || ''),
			allowed: category?.isAllowedUtilityCost ?? true
		}))
	);
</script>

<SaveForm
	record="Kategorie"
	error={errors.form}
	cancelHref="/config/categories"
	{submitLabel}
	submitTestid="category-submit"
>
	<TextInput
		id="name"
		name="name"
		label="Name"
		example="Treppenhausreinigung"
		bind:value={values.name}
		error={errors.name}
		testid="category-name-input"
	/>
	<TextInput
		id="description"
		name="description"
		label="Beschreibung"
		optional
		bind:value={values.description}
	/>
	<Checkbox
		id="isAllowedUtilityCost"
		name="isAllowedUtilityCost"
		label="Umlagefähige Nebenkosten"
		help="Nur umlagefähige Kosten (Art. 257a–257b OR) fliessen in die Nebenkostenabrechnung, z. B. Heizung, Wasser, Hauswart. Reparaturen, Versicherungen und Steuern sind nicht umlagefähig."
		bind:checked={values.allowed}
		testid="category-allowed-checkbox"
	/>
	<TextInput
		id="sortOrder"
		name="sortOrder"
		type="number"
		label="Reihenfolge"
		help="Position in den Auswahllisten: kleinere Zahlen stehen weiter oben."
		example="4"
		optional
		min="0"
		bind:value={values.sortOrder}
	/>

	<fieldset class="flex flex-col gap-4">
		<legend class="text-lg font-semibold text-ink">Übersetzungen</legend>
		<div class="grid gap-6 md:grid-cols-3">
			{#each translations as { key, label } (key)}
				<TextInput id={key} name={key} {label} optional bind:value={values[key]} />
			{/each}
		</div>
	</fieldset>
</SaveForm>
