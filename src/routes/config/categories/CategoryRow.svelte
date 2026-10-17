<script lang="ts">
	import { localName } from '$lib/names';
	import { m } from '$lib/paraglide/messages';
	import type { CategoryWithUsage } from '$lib/server/category';
	import Badge from '$lib/ui/Badge.svelte';
	import Button from '$lib/ui/Button.svelte';
	import CategoryReason from './CategoryReason.svelte';

	let { category, ondelete }: { category: CategoryWithUsage; ondelete: () => void } = $props();

	const count = $derived(category.usageCount);
	const usage = $derived(
		count === 1 ? m.common_invoices_one({ count }) : m.invoices_count({ count })
	);
	const name = $derived(localName(category));
</script>

<!-- The whole row opens the category; its name is the link -->
<li
	class="relative flex flex-col gap-4 rounded-panel border border-line bg-surface p-4 hover:border-line-strong md:flex-row md:items-center"
	data-testid="category-row"
>
	<div class="flex min-w-0 flex-1 flex-col gap-1">
		<a
			href="/config/categories/{category.id}/edit"
			class="font-semibold text-accent underline underline-offset-4 after:absolute after:inset-0"
			data-testid="category-edit-button"><span data-testid="category-name">{name}</span></a
		>
		<!-- The predefined categories' descriptions are English; only own ones are shown -->
		{#if category.description && !category.predefined}
			<p class="text-ink-muted" data-testid="category-description">{category.description}</p>
		{/if}
		<CategoryReason {category} />
	</div>
	<div class="flex flex-wrap items-center gap-4">
		<!-- Dwello's own categories stay: the list says which ones (#166) -->
		<Badge
			label={category.predefined ? m.categories_kind_predefined() : m.categories_kind_custom()}
			testid="category-kind"
		/>
		<Badge
			tone={category.isAllowedUtilityCost ? 'positive' : 'neutral'}
			label={category.isAllowedUtilityCost
				? m.glossary_allocable_term()
				: m.invoices_not_allocable()}
			testid="category-allowed"
		/>
		<p class="text-ink-muted tabular-nums" data-testid="category-usage">{usage}</p>
		<!-- Above the row's link -->
		<div class="relative">
			<Button
				variant="danger-ghost"
				icon="delete"
				onclick={ondelete}
				disabled={count > 0 || category.predefined}
				describedby={category.predefined ? 'category-predefined-note' : undefined}
				ariaLabel={m.categories_delete_aria({ name })}
				testid="category-delete-button">{m.buildings_delete()}</Button
			>
		</div>
	</div>
</li>
