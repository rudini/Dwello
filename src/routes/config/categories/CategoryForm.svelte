<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import FieldError from '$lib/components/FieldError.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import type { Category } from '$lib/types';

	let {
		category,
		errors = {},
		submitLabel
	}: { category?: Category; errors?: Record<string, string>; submitLabel: string } = $props();

	const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary';
	const translations = [
		{ key: 'nameFR', label: 'Französisch' },
		{ key: 'nameIT', label: 'Italienisch' },
		{ key: 'nameEN', label: 'Englisch' }
	] as const;
	const values = $derived({
		name: category?.name ?? '',
		description: category?.description ?? '',
		sortOrder: category?.sortOrder || '',
		allowed: category?.isAllowedUtilityCost ?? true
	});
</script>

<form method="POST" use:enhance={() => ({ update }) => update({ reset: false })} class="space-y-6">
	<FieldError message={errors.form} />

	<div class="grid gap-4 sm:grid-cols-2">
		<div>
			<label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name <span class="text-red-500">*</span></label>
			<input id="name" name="name" value={values.name} placeholder="z.B. Treppenhausreinigung" data-testid="category-name-input" class={inputClass} />
			<FieldError message={errors.name} />
		</div>
		<div>
			<label for="sortOrder" class="block text-sm font-medium text-gray-700 mb-1">Reihenfolge</label>
			<input id="sortOrder" name="sortOrder" type="number" min="0" value={values.sortOrder} class={inputClass} />
		</div>
	</div>
	<div>
		<label for="description" class="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
		<input id="description" name="description" value={values.description} data-testid="category-description-input" class={inputClass} />
	</div>

	<label class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer">
		<input
			type="checkbox"
			name="isAllowedUtilityCost"
			checked={values.allowed}
			data-testid="category-allowed-checkbox"
			class="mt-1 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
		/>
		<span>
			<span class="font-medium text-gray-900">Umlagefähige Nebenkosten</span>
			<span class="block text-sm text-gray-500">
				Nur umlagefähige Kosten (Art. 257a–257b OR) fliessen in die Nebenkostenabrechnung, z.B. Heizung, Wasser,
				Hauswart. Reparaturen, Versicherungen und Steuern sind nicht umlagefähig.
			</span>
		</span>
	</label>

	<fieldset>
		<legend class="text-sm font-medium text-gray-700 mb-2">Übersetzungen</legend>
		<div class="grid gap-4 sm:grid-cols-3">
			{#each translations as { key, label } (key)}
				<div>
					<label for={key} class="block text-xs font-medium text-gray-600 mb-1">{label}</label>
					<input id={key} name={key} value={category?.[key] ?? ''} class={inputClass} />
				</div>
			{/each}
		</div>
	</fieldset>

	<div class="flex gap-3 pt-4 border-t border-gray-200">
		<Button href="/config/categories" variant="secondary" testid="form-cancel">Abbrechen</Button>
		<Button type="submit" variant="primary" testid="category-submit">
			<Icon name="save" size={18} />
			{submitLabel}
		</Button>
	</div>
</form>
