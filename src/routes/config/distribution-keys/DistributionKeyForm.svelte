<script lang="ts">
	import { untrack } from 'svelte';
	import FieldError from '$lib/components/FieldError.svelte';
	import Button from '$lib/components/Button.svelte';
	import RecordForm from '$lib/components/RecordForm.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import TextField from '$lib/components/TextField.svelte';
	import { FORMULA_VARIABLES, type DistributionKeyRow, type FormulaTest } from '$lib/distribution-key';
	import FormulaTestResult from './FormulaTestResult.svelte';

	let {
		key,
		errors = {},
		test,
		submitLabel
	}: { key?: DistributionKeyRow; errors?: Record<string, string>; test?: FormulaTest; submitLabel: string } = $props();

	const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary';
	let formula = $state(untrack(() => key?.formula ?? '{area}'));
	const name = $derived(key?.name ?? '');
	const description = $derived(key?.description ?? '');
</script>

<RecordForm action="?/save" error={errors.form} cancelHref="/config/distribution-keys" {submitLabel} submitTestid="distribution-key-submit">

	<div class="grid gap-4 sm:grid-cols-2">
		<TextField
			label="Name"
			name="name"
			value={name}
			required
			placeholder="z.B. Fläche und Zimmer"
			error={errors.name}
			testid="distribution-key-name-input"
		/>
		<TextField label="Beschreibung" name="description" value={description} />
	</div>

	<div>
		<label for="formula" class="block text-sm font-medium text-gray-700 mb-1">Formel <span class="text-red-500">*</span></label>
		<div class="flex flex-wrap gap-2 mb-2">
			{#each FORMULA_VARIABLES as variable (variable.name)}
				<button
					type="button"
					title={variable.description}
					onclick={() => (formula += `{${variable.name}}`)}
					class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg text-sm font-mono text-purple-700 hover:bg-purple-100 transition-colors"
				>
					<Icon name={variable.icon} size={16} />
					{`{${variable.name}}`}
				</button>
			{/each}
		</div>
		<input id="formula" name="formula" bind:value={formula} data-testid="distribution-key-formula-input" class="{inputClass} font-mono" />
		<FieldError message={errors.formula} />
		<p class="mt-1 text-xs text-gray-500">Rechnen Sie mit +, -, *, / und Klammern, z.B. {'{area} * 0.7 + {rooms} * 0.3'}</p>
	</div>

	<div>
		<Button type="submit" variant="secondary" formaction="?/test" testid="distribution-key-test-button">
			<Icon name="science" size={18} />
			Formel testen
		</Button>
		{#if test}
			<FormulaTestResult {test} />
		{/if}
	</div>
</RecordForm>
