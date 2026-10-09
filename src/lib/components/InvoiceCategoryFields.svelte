<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Category } from '$lib/types';
	import CategoryOptions from './CategoryOptions.svelte';
	import Icon from './Icon.svelte';

	// Category, distribution key and whether the costs may be charged to the tenants; shared by "Neue Rechnung" and "Rechnung bearbeiten"
	let {
		categoryId = $bindable(),
		distributionKeyId = $bindable(),
		isValidUtilityCost = $bindable(),
		categories,
		distributionKeys,
		children
	}: {
		categoryId: string;
		distributionKeyId: string;
		isValidUtilityCost: boolean;
		categories: Category[];
		distributionKeys: { id: string; name: string }[];
		children?: Snippet; // shown below the distribution key
	} = $props();

	const selectedCategory = $derived(categories.find((c) => c.id === categoryId));
	const nonAllocable = $derived(selectedCategory?.isAllowedUtilityCost === false);

	// A category decides whether its costs may be charged to the tenants
	function chooseCategory() {
		if (selectedCategory) isValidUtilityCost = selectedCategory.isAllowedUtilityCost;
	}

	const selectClass =
		'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
</script>

<div class="grid gap-4 sm:grid-cols-2">
	<div>
		<label for="category" class="block text-sm font-medium text-gray-700 mb-1">Kategorie</label>
		<select
			id="category"
			data-testid="invoice-category-select"
			bind:value={categoryId}
			onchange={chooseCategory}
			class={selectClass}
		>
			<option value="">Kategorie auswählen...</option>
			<CategoryOptions {categories} />
		</select>
	</div>

	<div>
		<label for="distributionKey" class="block text-sm font-medium text-gray-700 mb-1"
			>Verteilschlüssel</label
		>
		<select
			id="distributionKey"
			data-testid="invoice-distribution-key-select"
			bind:value={distributionKeyId}
			class={selectClass}
		>
			<option value="">Verteilschlüssel auswählen...</option>
			{#each distributionKeys as key (key.id)}
				<option value={key.id}>{key.name}</option>
			{/each}
		</select>
	</div>

	{@render children?.()}

	<div class="sm:col-span-2">
		<div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
			<input
				id="isValidUtilityCost"
				data-testid="invoice-utility-cost-checkbox"
				type="checkbox"
				bind:checked={isValidUtilityCost}
				disabled={nonAllocable}
				aria-describedby={nonAllocable ? 'invoice-category-warning-text' : undefined}
				class="w-5 h-5 text-accent border-gray-300 rounded focus:ring-blue-500"
			/>
			<div>
				<label for="isValidUtilityCost" class="font-medium text-gray-900"
					>Umlagefähige Nebenkosten</label
				>
				<p class="text-sm text-ink-muted">
					Gemäss schweizerischem Mietrecht auf Mieter umlegbare Kosten
				</p>
			</div>
		</div>

		{#if nonAllocable}
			<div
				class="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2"
				data-testid="invoice-category-warning"
			>
				<Icon name="warning" size={18} class="text-caution flex-shrink-0 mt-0.5" />
				<div id="invoice-category-warning-text" class="text-sm text-caution">
					<strong>Hinweis:</strong> Diese Kategorie enthält nicht umlagefähige Kosten (z.B. Reparaturen,
					Versicherungen). Diese können nicht auf Mieter übertragen werden.
				</div>
			</div>
		{/if}
	</div>
</div>
