<script lang="ts">
	import { localName } from '$lib/names';
	import { m } from '$lib/paraglide/messages';
	import type { CategoryWithUsage } from '$lib/server/category';
	import Button from '$lib/ui/Button.svelte';
	import EmptyState from '$lib/ui/EmptyState.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import DeleteDialog from '../DeleteDialog.svelte';
	import CategoryRow from './CategoryRow.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	type Filter = 'all' | 'allowed' | 'disallowed';
	let filter = $state<Filter>('all');
	let toDelete = $state<CategoryWithUsage | null>(null);

	const matches: Record<Filter, (c: CategoryWithUsage) => boolean> = {
		all: () => true,
		allowed: (c) => c.isAllowedUtilityCost,
		disallowed: (c) => !c.isAllowedUtilityCost
	};
	const shown = $derived(data.categories.filter(matches[filter]));
	const filters: { key: Filter; label: string }[] = [
		{ key: 'all', label: m.invoices_all() },
		{ key: 'allowed', label: m.glossary_allocable_term() },
		{ key: 'disallowed', label: m.invoices_not_allocable() }
	];
</script>

<svelte:head>
	<title>{m.nav_categories()} - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8">
	<PageHeader
		title={m.nav_categories()}
		purpose={m.categories_purpose()}
		trail={[{ href: '/config', label: m.nav_settings() }]}
	>
		{#snippet action()}
			<Button
				href="/config/categories/new"
				variant="primary"
				icon="add"
				testid="new-category-button">{m.categories_add()}</Button
			>
		{/snippet}
	</PageHeader>

	<div class="flex flex-wrap gap-2" role="group" aria-label={m.categories_show()}>
		{#each filters as { key, label } (key)}
			<button
				type="button"
				onclick={() => (filter = key)}
				aria-pressed={filter === key}
				class="min-h-12 rounded-control border-2 px-4 font-semibold {filter === key
					? 'border-accent bg-accent-soft text-accent-strong'
					: 'border-line-strong bg-surface text-accent hover:bg-accent-soft'}"
				data-testid="category-filter-{key}"
			>
				{label} ({data.categories.filter(matches[key]).length})
			</button>
		{/each}
	</div>

	<div class="flex flex-col gap-4">
		<p class="text-ink-muted">
			{m.categories_in_use_note()}
		</p>
		{#if shown.length === 0}
			<EmptyState
				title={m.categories_empty_filter()}
				text={m.categories_empty_filter_text()}
				illustration="no-results"
				testid="categories-empty"
			/>
		{:else}
			<ul class="flex flex-col gap-4">
				{#each shown as category (category.id)}
					<CategoryRow {category} ondelete={() => (toDelete = category)} />
				{/each}
			</ul>
		{/if}
	</div>
</div>

<DeleteDialog
	bind:open={
		() => toDelete !== null,
		(open) => {
			if (!open) toDelete = null;
		}
	}
	record="category"
	name={toDelete ? localName(toDelete) : ''}
	id={toDelete?.id}
	error={form?.error}
	confirmTestid="category-delete-confirm"
>
	<p>{m.categories_delete_text()}</p>
</DeleteDialog>
