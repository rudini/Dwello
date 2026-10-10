<script lang="ts">
	import { untrack } from 'svelte';
	import {
		FORMULA_VARIABLES,
		type DistributionKeyRow,
		type FormulaTest
	} from '$lib/distribution-key';
	import Button from '$lib/ui/Button.svelte';
	import Field from '$lib/ui/Field.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';
	import { controlClass } from '$lib/ui/field';
	import SaveForm from '../SaveForm.svelte';
	import FormulaHelp from './FormulaHelp.svelte';
	import FormulaTestResult from './FormulaTestResult.svelte';

	let {
		key,
		errors = {},
		test,
		submitLabel
	}: {
		key?: DistributionKeyRow;
		errors?: Record<string, string>;
		test?: FormulaTest;
		submitLabel: string;
	} = $props();

	let name = $state(untrack(() => key?.name ?? ''));
	let description = $state(untrack(() => key?.description ?? ''));
	let formula = $state(untrack(() => key?.formula ?? '{area}'));
</script>

<SaveForm
	action="?/save"
	record="Verteilschlüssel"
	error={errors.form}
	cancelHref="/config/distribution-keys"
	{submitLabel}
	submitTestid="distribution-key-submit"
>
	<TextInput
		id="name"
		name="name"
		label="Name"
		example="Fläche und Zimmer"
		bind:value={name}
		error={errors.name}
		testid="distribution-key-name-input"
	/>
	<TextInput
		id="description"
		name="description"
		label="Beschreibung"
		optional
		bind:value={description}
	/>

	<Field
		id="formula"
		label="Formel"
		help="Bestimmt den Anteil jeder Wohnung an den Kosten. Fügen Sie Bausteine mit den Knöpfen ein und rechnen Sie mit + - * / und Klammern."
		error={errors.formula}
	>
		{#snippet children(control)}
			<input
				id={control.id}
				name="formula"
				bind:value={formula}
				autocomplete="off"
				spellcheck="false"
				aria-required="true"
				aria-describedby={control.describedBy}
				aria-invalid={control.invalid || undefined}
				class="{controlClass(control.invalid)} font-mono"
				data-testid="distribution-key-formula-input"
			/>
		{/snippet}
	</Field>
	<div class="flex flex-col gap-2">
		<p class="font-semibold text-ink">Baustein einfügen</p>
		<div class="flex flex-wrap gap-2">
			{#each FORMULA_VARIABLES as variable (variable.name)}
				<Button onclick={() => (formula += `{${variable.name}}`)}>
					<span class="font-mono">{`{${variable.name}}`}</span>
					<span class="font-normal">{variable.description}</span>
				</Button>
			{/each}
		</div>
	</div>

	<div class="flex flex-col gap-4">
		<div>
			<Button type="submit" formaction="?/test" icon="test" testid="distribution-key-test-button"
				>Formel testen</Button
			>
		</div>
		{#if test}
			<FormulaTestResult {test} />
		{/if}
	</div>

	<FormulaHelp />
</SaveForm>
