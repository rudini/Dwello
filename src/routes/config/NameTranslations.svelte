<script lang="ts">
	import { untrack } from 'svelte';
	import { m } from '$lib/paraglide/messages';
	import TextInput from '$lib/ui/TextInput.svelte';

	// The optional fr/it/en names of a category, distribution key or heating profile (#345); without one the German
	// name stands
	let {
		names,
		help,
		testid
	}: {
		names?: { nameFR?: string | null; nameIT?: string | null; nameEN?: string | null };
		help: string;
		testid?: string;
	} = $props();

	const translations = [
		{ key: 'nameFR', code: 'fr', label: m.tenants_language_fr() },
		{ key: 'nameIT', code: 'it', label: m.tenants_language_it() },
		{ key: 'nameEN', code: 'en', label: m.tenants_language_en() }
	] as const;
	let values = $state(
		untrack(() => ({
			nameFR: names?.nameFR ?? '',
			nameIT: names?.nameIT ?? '',
			nameEN: names?.nameEN ?? ''
		}))
	);
</script>

<fieldset class="flex flex-col gap-4" aria-describedby="translations-help">
	<legend class="text-lg font-semibold text-ink">{m.categories_translations()}</legend>
	<p id="translations-help" class="text-ink-muted">{help}</p>
	<div class="grid gap-6 md:grid-cols-3">
		{#each translations as { key, code, label } (key)}
			<TextInput
				id={key}
				name={key}
				{label}
				optional
				bind:value={values[key]}
				testid={testid && `${testid}-name-${code}-input`}
			/>
		{/each}
	</div>
</fieldset>
