<script lang="ts">
	import type { Category } from '$lib/types';

	// Categories of a select, grouped by whether their costs may be charged to the tenants
	let { categories }: { categories: Category[] } = $props();

	const groups = $derived([
		{ label: 'Umlagefähige Kosten', categories: categories.filter((c) => c.isAllowedUtilityCost) },
		{ label: 'Nicht umlagefähige Kosten', categories: categories.filter((c) => !c.isAllowedUtilityCost) }
	]);
</script>

{#each groups as group (group.label)}
	<optgroup label={group.label}>
		{#each group.categories as category (category.id)}
			<option value={category.id}>{category.name}</option>
		{/each}
	</optgroup>
{/each}
