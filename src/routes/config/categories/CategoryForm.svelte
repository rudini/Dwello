<script lang="ts">
	import { untrack } from 'svelte';
	import { m } from '$lib/paraglide/messages';
	import type { Proposal } from '$lib/server/category';
	import type { Category } from '$lib/types';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Checkbox from '$lib/ui/Checkbox.svelte';
	import RadioGroup from '$lib/ui/RadioGroup.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';
	import SaveForm from '../SaveForm.svelte';

	// `proposal` only on a new category: the KI's answer to «Von der KI prüfen lassen»
	let {
		action,
		category,
		errors = {},
		proposal,
		submitLabel
	}: {
		action?: string;
		category?: Category & { predefined?: boolean };
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
	const allowance = [
		{ value: 'true', label: m.glossary_allocable_term(), description: m.categories_allocable_yes() },
		{ value: 'false', label: m.invoices_not_allocable(), description: m.categories_allocable_no() }
	];
	// The KI's answer becomes the choice; the Liegenschaftsverwalter can still change it
	$effect(() => {
		if (proposal && 'reasoning' in proposal) values.allowed = String(proposal.isAllowedUtilityCost);
	});
</script>

<SaveForm
	{action}
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
			error={errors.isAllowedUtilityCost}
			testid="category-allowance"
		/>
		{#if action}
			<div>
				<Button type="submit" formaction="?/propose" icon="ai-suggestion" testid="category-propose-button"
					>{m.categories_propose()}</Button
				>
			</div>
		{/if}
		{#if proposal}
			<Alert
				tone={'error' in proposal ? 'caution' : 'info'}
				title={'error' in proposal
					? m.categories_proposal_none()
					: m.categories_proposal({
							choice: proposal.isAllowedUtilityCost
								? m.glossary_allocable_term()
								: m.invoices_not_allocable()
						})}
				testid="category-proposal"
			>
				<p>{'error' in proposal ? proposal.error : proposal.reasoning}</p>
			</Alert>
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
