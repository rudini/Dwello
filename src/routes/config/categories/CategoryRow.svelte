<script lang="ts">
	import type { CategoryWithUsage } from '$lib/server/category';
	import Badge from '$lib/ui/Badge.svelte';
	import Button from '$lib/ui/Button.svelte';

	let { category, ondelete }: { category: CategoryWithUsage; ondelete: () => void } = $props();

	const count = $derived(category.usageCount);
	const usage = $derived(`${count} ${count === 1 ? 'Rechnung' : 'Rechnungen'}`);
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
			data-testid="category-edit-button"><span data-testid="category-name">{category.name}</span></a
		>
		<!-- The predefined categories' descriptions are English; only own ones are shown -->
		{#if category.description && !category.predefined}
			<p class="text-ink-muted">{category.description}</p>
		{/if}
	</div>
	<div class="flex flex-wrap items-center gap-4">
		<Badge
			tone={category.isAllowedUtilityCost ? 'positive' : 'neutral'}
			label={category.isAllowedUtilityCost ? 'Umlagefähig' : 'Nicht umlagefähig'}
			testid="category-allowed"
		/>
		<p class="text-ink-muted tabular-nums" data-testid="category-usage">{usage}</p>
		<!-- Above the row's link -->
		<div class="relative">
			<Button
				variant="danger-ghost"
				icon="delete"
				onclick={ondelete}
				disabled={count > 0}
				ariaLabel="Kategorie «{category.name}» löschen"
				testid="category-delete-button">Löschen</Button
			>
		</div>
	</div>
</li>
