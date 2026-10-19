<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { untrack, type Snippet } from 'svelte';
	import { proposedKey, type LatestKey } from '$lib/invoice';
	import type { Category } from '$lib/types';
	import Alert from '$lib/ui/Alert.svelte';
	import Checkbox from '$lib/ui/Checkbox.svelte';
	import Field from '$lib/ui/Field.svelte';
	import { controlClass } from '$lib/ui/field';
	import Select from '$lib/ui/Select.svelte';

	// Category, distribution key and whether the costs may be charged to the tenants; shared by "Neue Rechnung" and "Rechnung bearbeiten"
	let {
		categoryId = $bindable(),
		distributionKeyId = $bindable(),
		isValidUtilityCost = $bindable(),
		categories,
		distributionKeys,
		after,
		idPrefix = '',
		categoryRequired = false,
		categoryError,
		buildingId,
		latestKeys = [],
		defaultKeyId = '',
		keyChosen = $bindable(),
		keyError,
		keyNote
	}: {
		categoryId: string;
		distributionKeyId: string;
		isValidUtilityCost: boolean;
		categories: Category[];
		distributionKeys: { id: string; name: string }[];
		after?: Snippet; // shown below the distribution key
		idPrefix?: string; // several invoices on one page (the upload dialog) need their own ids
		categoryRequired?: boolean; // the upload dialog creates no invoice without a Kategorie (#217)
		categoryError?: string;
		buildingId: string;
		latestKeys?: LatestKey[];
		defaultKeyId?: string; // the settings' Standard-Verteilschlüssel
		keyChosen?: boolean; // the key the form starts with is the Liegenschaftsverwalter's, e.g. a stored one
		keyError?: string;
		keyNote?: { text: string; testid: string };
	} = $props();

	// #379: Dwello proposes the key of the latest invoice of the category in the building, else the settings', until
	// the Liegenschaftsverwalter chooses one himself
	$effect(() => {
		const proposal = proposedKey(latestKeys, buildingId, categoryId, defaultKeyId);
		untrack(() => {
			if (!keyChosen && proposal) distributionKeyId = proposal;
		});
	});

	const selectedCategory = $derived(categories.find((c) => c.id === categoryId));
	const nonAllocable = $derived(selectedCategory?.isAllowedUtilityCost === false);
	// Grouped by whether their costs may be charged to the tenants
	const groups = $derived([
		{
			label: m.invoices_group_allocable(),
			categories: categories.filter((c) => c.isAllowedUtilityCost)
		},
		{
			label: m.invoices_group_not_allocable(),
			categories: categories.filter((c) => !c.isAllowedUtilityCost)
		}
	]);

	// A category decides whether its costs may be charged to the tenants
	function chooseCategory() {
		if (selectedCategory) isValidUtilityCost = selectedCategory.isAllowedUtilityCost;
	}
</script>

<Field
	id="{idPrefix}category"
	label={m.buildings_category()}
	help={m.invoices_category_help()}
	optional={!categoryRequired}
	error={categoryError}
>
	{#snippet children(control)}
		<!-- The options are written here, not in a child component, so they are in the page before it is hydrated -->
		<select
			id={control.id}
			bind:value={categoryId}
			onchange={chooseCategory}
			aria-describedby={control.describedBy}
			aria-invalid={control.invalid || undefined}
			class={controlClass(control.invalid)}
			data-testid="invoice-category-select"
		>
			<option value="">{m.invoices_choose_category()}</option>
			{#each groups as group (group.label)}
				<optgroup label={group.label}>
					{#each group.categories as category (category.id)}
						<option value={category.id}>{category.name}</option>
					{/each}
				</optgroup>
			{/each}
		</select>
	{/snippet}
</Field>

<Select
	id="{idPrefix}distributionKey"
	label={m.glossary_key_term()}
	help={m.invoices_key_help()}
	placeholder={m.invoices_choose_key()}
	options={distributionKeys.map((key) => ({ value: key.id, label: key.name }))}
	bind:value={distributionKeyId}
	onchange={() => (keyChosen = true)}
	error={keyError}
	note={keyNote}
	testid="invoice-distribution-key-select"
/>

{@render after?.()}

<Checkbox
	id="{idPrefix}isValidUtilityCost"
	label={m.glossary_allocable_term()}
	help={isValidUtilityCost ? m.invoices_allocable_help() : m.invoices_not_allocable_help()}
	bind:checked={isValidUtilityCost}
	disabled={nonAllocable}
	describedby={nonAllocable ? `${idPrefix}invoice-category-warning-text` : undefined}
	testid="invoice-utility-cost-checkbox"
/>

{#if nonAllocable}
	<div data-testid="invoice-category-warning">
		<Alert tone="caution" title={m.invoices_category_not_allocable()}>
			<p id="{idPrefix}invoice-category-warning-text">{m.invoices_category_not_allocable_text()}</p>
		</Alert>
	</div>
{/if}
