<script lang="ts">
	import { untrack } from 'svelte';
	import { m } from '$lib/paraglide/messages';
	import type { Category } from '$lib/types';
	import Checkbox from '$lib/ui/Checkbox.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';
	import SaveForm from '../SaveForm.svelte';

	let {
		category,
		errors = {},
		submitLabel
	}: {
		category?: Category & { predefined?: boolean };
		errors?: Record<string, string>;
		submitLabel: string;
	} = $props();

	const translations = [
		{ key: 'nameFR', label: m.tenants_language_fr() },
		{ key: 'nameIT', label: m.tenants_language_it() },
		{ key: 'nameEN', label: m.tenants_language_en() }
	] as const;
	// The record's texts (empty for a new one), its number and the checkbox as the fields hold them
	let values = $state(
		untrack(() => ({
			...{ name: '', description: '', nameFR: '', nameIT: '', nameEN: '' },
			...category,
			sortOrder: String(category?.sortOrder || ''),
			allowed: category?.isAllowedUtilityCost ?? true,
			heating: category?.isHeatingCost ?? false
		}))
	);
</script>

<SaveForm
	record="category"
	error={errors.form}
	cancelHref="/config/categories"
	{submitLabel}
	submitTestid="category-submit"
>
	<!-- The German name, also the key of a new category: its example stays German in every language -->
	<TextInput
		id="name"
		name="name"
		label={m.categories_name_german()}
		example="Treppenhausreinigung"
		bind:value={values.name}
		error={errors.name}
		testid="category-name-input"
	/>
	<TextInput
		id="description"
		name="description"
		label={m.invoices_description()}
		help={category?.predefined ? m.categories_description_predefined() : undefined}
		optional
		bind:value={values.description}
	/>
	<Checkbox
		id="isAllowedUtilityCost"
		name="isAllowedUtilityCost"
		label={m.categories_allocable()}
		help={m.categories_allocable_help()}
		bind:checked={values.allowed}
		testid="category-allowed-checkbox"
	/>
	<!-- TODO(fachlich prüfen): which costs follow the heating profile is not in the glossary -->
	<Checkbox
		id="isHeatingCost"
		name="isHeatingCost"
		label={m.categories_heating()}
		help={m.categories_heating_help()}
		bind:checked={values.heating}
		testid="category-heating-checkbox"
	/>
	<TextInput
		id="sortOrder"
		name="sortOrder"
		type="number"
		label={m.categories_sort_order()}
		help={m.categories_sort_order_help()}
		example="4"
		optional
		min="0"
		bind:value={values.sortOrder}
	/>

	<fieldset class="flex flex-col gap-4">
		<legend class="text-lg font-semibold text-ink">{m.categories_translations()}</legend>
		<div class="grid gap-6 md:grid-cols-3">
			{#each translations as { key, label } (key)}
				<TextInput id={key} name={key} {label} optional bind:value={values[key]} />
			{/each}
		</div>
	</fieldset>
</SaveForm>
