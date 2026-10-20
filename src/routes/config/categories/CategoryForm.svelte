<script lang="ts">
	import { untrack } from 'svelte';
	import { m } from '$lib/paraglide/messages';
	import type { Proposal } from '$lib/server/category';
	import type { Category } from '$lib/types';
	import Button from '$lib/ui/Button.svelte';
	import RadioGroup from '$lib/ui/RadioGroup.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';
	import Textarea from '$lib/ui/Textarea.svelte';
	import NameTranslations from '../NameTranslations.svelte';
	import SaveForm from '../SaveForm.svelte';
	import AllocabilityQuestion from './AllocabilityQuestion.svelte';
	import CategoryProposal from './CategoryProposal.svelte';
	import CategoryReason from './CategoryReason.svelte';
	import HeatingChoice from './HeatingChoice.svelte';

	// `ki` and `proposal` only on a new category: whether the KI is on (#219), its answer to «Von der KI prüfen lassen»
	let {
		action,
		category,
		errors = {},
		ki = false,
		proposal,
		submitLabel
	}: {
		action?: string;
		category?: Category & { key?: string; predefined?: boolean; allocableInvoiceCount?: number };
		errors?: Record<string, string>;
		ki?: boolean;
		proposal?: Proposal | null;
		submitLabel: string;
	} = $props();

	// The record's texts (empty for a new one), its number and the checkbox as the fields hold them
	let values = $state(
		untrack(() => ({
			...{ name: '', description: '' },
			...category,
			sortOrder: String(category?.sortOrder || ''),
			// A new category starts without a choice (#176)
			allowed: category ? String(category.isAllowedUtilityCost) : '',
			heating: category?.isHeatingCost ?? false,
			fuel: category?.isFuel ?? false
		}))
	);
	// The reason of a predefined category follows the choice in the form, not the saved one
	const chosen = $derived(
		category && { ...category, isAllowedUtilityCost: values.allowed === 'true' }
	);
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

	let form = $state<HTMLFormElement>();
	let ask = $state<() => boolean>();
	const submitAgain = () => form?.requestSubmit(); // once the question is answered
	const predefined = $derived(!!category?.predefined); // «Heizkosten» fixed (#302)
</script>

<SaveForm
	{action}
	bind:form
	{ask}
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
	<Textarea
		id="description"
		name="description"
		rows={6}
		testid="category-description-input"
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
		{#if ki}
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
	<HeatingChoice bind:heating={values.heating} bind:fuel={values.fuel} fixed={predefined} />
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

	<NameTranslations names={category} help={m.categories_translations_help()} />
</SaveForm>

<AllocabilityQuestion {category} bind:allowed={values.allowed} bind:ask onconfirm={submitAgain} />
