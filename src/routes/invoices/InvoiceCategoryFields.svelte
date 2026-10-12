<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { Snippet } from 'svelte';
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
		after
	}: {
		categoryId: string;
		distributionKeyId: string;
		isValidUtilityCost: boolean;
		categories: Category[];
		distributionKeys: { id: string; name: string }[];
		after?: Snippet; // shown below the distribution key
	} = $props();

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

<Field id="category" label={m.buildings_category()} help={m.invoices_category_help()} optional>
	{#snippet children(control)}
		<!-- The options are written here, not in a child component, so they are in the page before it is hydrated -->
		<select
			id={control.id}
			bind:value={categoryId}
			onchange={chooseCategory}
			aria-describedby={control.describedBy}
			class={controlClass(false)}
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
	id="distributionKey"
	label={m.glossary_key_term()}
	help={m.invoices_key_help()}
	placeholder={m.invoices_choose_key()}
	optional
	options={distributionKeys.map((key) => ({ value: key.id, label: key.name }))}
	bind:value={distributionKeyId}
	testid="invoice-distribution-key-select"
/>

{@render after?.()}

<Checkbox
	id="isValidUtilityCost"
	label={m.glossary_allocable_term()}
	help={m.invoices_allocable_help()}
	bind:checked={isValidUtilityCost}
	disabled={nonAllocable}
	describedby={nonAllocable ? 'invoice-category-warning-text' : undefined}
	testid="invoice-utility-cost-checkbox"
/>

{#if nonAllocable}
	<div data-testid="invoice-category-warning">
		<Alert tone="caution" title={m.invoices_category_not_allocable()}>
			<p id="invoice-category-warning-text">{m.invoices_category_not_allocable_text()}</p>
		</Alert>
	</div>
{/if}
