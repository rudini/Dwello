<script lang="ts">
	import RecordForm from '$lib/components/RecordForm.svelte';
	import TextField from '$lib/components/TextField.svelte';
	import type { Category } from '$lib/types';

	let {
		category,
		errors = {},
		submitLabel
	}: { category?: Category; errors?: Record<string, string>; submitLabel: string } = $props();

	const inputClass =
		'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary';
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

<RecordForm
	error={errors.form}
	cancelHref="/config/categories"
	{submitLabel}
	submitTestid="category-submit"
>
	<div class="grid gap-4 sm:grid-cols-2">
		<TextField
			label="Name"
			name="name"
			value={values.name}
			required
			placeholder="z.B. Treppenhausreinigung"
			error={errors.name}
			testid="category-name-input"
		/>
		<div>
			<label for="sortOrder" class="block text-sm font-medium text-gray-700 mb-1">Reihenfolge</label
			>
			<input
				id="sortOrder"
				name="sortOrder"
				type="number"
				min="0"
				value={values.sortOrder}
				class={inputClass}
			/>
		</div>
	</div>
	<TextField label="Beschreibung" name="description" value={values.description} />

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
			<span class="block text-sm text-ink-muted">
				Nur umlagefähige Kosten (Art. 257a–257b OR) fliessen in die Nebenkostenabrechnung, z.B.
				Heizung, Wasser, Hauswart. Reparaturen, Versicherungen und Steuern sind nicht umlagefähig.
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
</RecordForm>
