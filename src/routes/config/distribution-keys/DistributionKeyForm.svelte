<script lang="ts">
	import { tick, untrack } from 'svelte';
	import { BUILDING_TOTALS, FORMULA_VARIABLES, type FormulaTest } from '$lib/distribution-key';
	import type { DistributionKey } from '$lib/types';
	import { m } from '$lib/paraglide/messages';
	import Button from '$lib/ui/Button.svelte';
	import Field from '$lib/ui/Field.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';
	import { controlClass } from '$lib/ui/field';
	import NameTranslations from '../NameTranslations.svelte';
	import SaveForm from '../SaveForm.svelte';
	import FormulaHelp from './FormulaHelp.svelte';
	import FormulaTestResult from './FormulaTestResult.svelte';

	let {
		key,
		errors = {},
		test,
		submitLabel
	}: {
		key?: DistributionKey;
		errors?: Record<string, string>;
		test?: FormulaTest;
		submitLabel: string;
	} = $props();

	let name = $state(untrack(() => key?.name ?? ''));
	let description = $state(untrack(() => key?.description ?? ''));
	let formula = $state(untrack(() => key?.formula ?? '{area}'));
	let formulaInput: HTMLInputElement;

	// persona Helga P-1 (#1200): back in the formula after the inserted block, so typing goes on there
	async function insertBlock(name: string) {
		formula += `{${name}}`;
		await tick();
		formulaInput.focus();
		formulaInput.setSelectionRange(formula.length, formula.length);
	}
</script>

{#snippet insert(title: string, variables: typeof FORMULA_VARIABLES)}
	<div class="flex flex-col gap-2">
		<p class="font-semibold text-ink">{title}</p>
		<div class="flex flex-wrap gap-2">
			{#each variables as variable (variable.name)}
				<Button onclick={() => insertBlock(variable.name)} testid="distribution-key-insert-button">
					<span class="font-mono">{`{${variable.name}}`}</span>
					<span class="font-normal">{variable.description()}</span>
				</Button>
			{/each}
		</div>
	</div>
{/snippet}

<SaveForm
	action="?/save"
	record="distributionKey"
	error={errors.form}
	cancelHref="/config/distribution-keys"
	{submitLabel}
	submitTestid="distribution-key-submit"
>
	<TextInput
		id="name"
		name="name"
		label={m.contracts_name()}
		example={m.keys_name_example()}
		bind:value={name}
		error={errors.name}
		testid="distribution-key-name-input"
	/>
	<TextInput
		id="description"
		name="description"
		label={m.invoices_description()}
		optional
		bind:value={description}
	/>

	<Field
		id="formula"
		label={m.keys_formula()}
		help={m.keys_formula_help()}
		error={errors.formula}
		testid="distribution-key-formula-field"
	>
		{#snippet children(control)}
			<input
				id={control.id}
				name="formula"
				bind:this={formulaInput}
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
	{@render insert(m.keys_insert_block(), FORMULA_VARIABLES)}
	<!-- #1200: the Summen des Gebäudes too, like the Bausteine -->
	{@render insert(m.keys_insert_total(), BUILDING_TOTALS)}

	<div class="flex flex-col gap-4">
		<div>
			<Button type="submit" formaction="?/test" icon="test" testid="distribution-key-test-button"
				>{m.keys_test()}</Button
			>
		</div>
		{#if test}
			<FormulaTestResult {test} />
		{/if}
	</div>

	<NameTranslations names={key} help={m.keys_translations_help()} testid="distribution-key" />

	<FormulaHelp />
</SaveForm>
