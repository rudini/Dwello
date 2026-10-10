<script lang="ts">
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
		{ label: 'Umlagefähige Kosten', categories: categories.filter((c) => c.isAllowedUtilityCost) },
		{
			label: 'Nicht umlagefähige Kosten',
			categories: categories.filter((c) => !c.isAllowedUtilityCost)
		}
	]);

	// A category decides whether its costs may be charged to the tenants
	function chooseCategory() {
		if (selectedCategory) isValidUtilityCost = selectedCategory.isAllowedUtilityCost;
	}
</script>

<Field id="category" label="Kategorie" help="Die Art der Kosten." optional>
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
			<option value="">Kategorie auswählen</option>
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

<!-- TODO(fachlich prüfen): the equal split without a key is what the statement calculation does;
     the glossary states it only for the Verwaltungspauschale -->
<Select
	id="distributionKey"
	label="Verteilschlüssel"
	help="Wie die Kosten auf die Wohnungen des Gebäudes verteilt werden. Ohne Verteilschlüssel werden die Kosten gleichmässig pro Wohnung verteilt."
	placeholder="Verteilschlüssel auswählen"
	optional
	options={distributionKeys.map((key) => ({ value: key.id, label: key.name }))}
	bind:value={distributionKeyId}
	testid="invoice-distribution-key-select"
/>

{@render after?.()}

<Checkbox
	id="isValidUtilityCost"
	label="Umlagefähig"
	help="Die Rechnung fliesst in die Nebenkostenabrechnung ein."
	bind:checked={isValidUtilityCost}
	disabled={nonAllocable}
	describedby={nonAllocable ? 'invoice-category-warning-text' : undefined}
	testid="invoice-utility-cost-checkbox"
/>

{#if nonAllocable}
	<div data-testid="invoice-category-warning">
		<Alert tone="caution" title="Nicht umlagefähige Kategorie">
			<p id="invoice-category-warning-text">
				Kosten dieser Kategorie (z. B. Reparaturen, Versicherungen) können nicht auf Mieter
				übertragen werden.
			</p>
		</Alert>
	</div>
{/if}
