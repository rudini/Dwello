<script lang="ts">
	import { untrack } from 'svelte';
	import { m } from '$lib/paraglide/messages';
	import type { Proposal } from '$lib/server/category';
	import type { Category } from '$lib/types';
	import Button from '$lib/ui/Button.svelte';
	import Checkbox from '$lib/ui/Checkbox.svelte';
	import RadioGroup from '$lib/ui/RadioGroup.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';
	import SaveForm from '../SaveForm.svelte';
	import CategoryProposal from './CategoryProposal.svelte';
	import CategoryReason from './CategoryReason.svelte';

	// `proposal` only on a new category: the KI's answer to «Von der KI prüfen lassen»
	let {
		action,
		category,
		errors = {},
		proposal,
		submitLabel
	}: {
		action?: string;
		category?: Category & { key?: string; predefined?: boolean };
		errors?: Record<string, string>;
		proposal?: Proposal | null;
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
			// A new category starts without a choice (#176)
			allowed: category ? String(category.isAllowedUtilityCost) : '',
			heating: category?.isHeatingCost ?? false
		}))
	);
	// The reason of a predefined category follows the choice in the form, not the saved one
	const chosen = $derived(category && { ...category, isAllowedUtilityCost: values.allowed === 'true' });
	const allowance = [
		{
			value: 'true',
			label: m.glossary_allocable_term(),
			description: m.categories_allocable_yes()
		},
		{ value: 'false', label: m.invoices_not_allocable(), description: m.categories_allocable_no() }
	];
	// The KI's answer holds for the name and description it checked, also through a refused save (which
	// brings no proposal). It presets the choice unless the Liegenschaftsverwalter chose already; without a
	// sure answer, or once name or description change, a choice the KI made goes again
	let kiChoice = $state('');
	let applied = $state(false);
	let checking = $state(false);
	let answered = $state<Proposal>();
	$effect.pre(() => {
		if (proposal) answered = proposal;
	});
	const current = $derived(
		answered?.name === values.name.trim() && answered.description === values.description.trim()
			? answered
			: undefined
	);
	$effect(() => {
		const answer = current;
		untrack(() => {
			if (answer && 'reasoning' in answer) {
				applied = values.allowed === '' || values.allowed === kiChoice;
				if (applied) values.allowed = kiChoice = String(answer.isAllowedUtilityCost);
			} else if (values.allowed === kiChoice) values.allowed = kiChoice = '';
		});
	});
	// A choice made by hand is the Liegenschaftsverwalter's, also when it equals the KI's
	$effect(() => {
		if (values.allowed !== kiChoice) kiChoice = '';
	});
</script>

<SaveForm
	{action}
	bind:checking
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
	<div class="flex flex-col gap-4">
		<RadioGroup
			name="isAllowedUtilityCost"
			legend={m.categories_allocable()}
			help={m.categories_allocable_help()}
			options={allowance}
			bind:value={values.allowed}
			error={values.allowed ? undefined : errors.isAllowedUtilityCost}
			testid="category-allowance"
		/>
		<CategoryReason category={chosen} />
		{#if action}
			<div>
				<div>
					<Button
						type="submit"
						formaction="?/propose"
						busy={checking}
						icon="ai-suggestion"
						testid="category-propose-button">{m.categories_propose()}</Button
					>
				</div>
				<!-- There before the first answer, so a screen reader announces it; empty, it adds no gap -->
				<div role="status" data-testid="category-proposal-region">
					{#if checking}
						<p class="mt-4 text-ink-muted" data-testid="category-proposal-checking">
							{m.categories_proposal_checking()}
						</p>
					{:else if current}
						<div class="mt-4">
							<CategoryProposal
								proposal={current}
								applied={applied && values.allowed === kiChoice}
							/>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
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
