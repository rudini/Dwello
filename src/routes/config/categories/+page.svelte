<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';
	import ConfirmDeleteDialog from '$lib/components/ConfirmDeleteDialog.svelte';
	import PageTrail from '$lib/components/PageTrail.svelte';
	import type { CategoryWithUsage } from '$lib/server/category';
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
	const tabs = $derived([
		{ key: 'all' as const, label: 'Alle', count: data.categories.length },
		{ key: 'allowed' as const, label: 'Umlagefähig', count: data.categories.filter(matches.allowed).length },
		{ key: 'disallowed' as const, label: 'Nicht umlagefähig', count: data.categories.filter(matches.disallowed).length }
	]);
	const deleteError = $derived(form?.error);
	const tabClass = (key: Filter) =>
		key === filter ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200';
</script>

<svelte:head>
	<title>Kategorien - Dwello</title>
</svelte:head>

<div class="space-y-6">
	<PageTrail links={[{ href: '/config', label: 'Einstellungen' }]} current="Kategorien" />

	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Kategorien</h1>
			<p class="text-gray-500 mt-1">Kostenkategorien, nach denen Rechnungen eingeordnet werden</p>
		</div>
		<Button href="/config/categories/new" variant="primary" testid="new-category-button">
			<Icon name="add" size={20} />
			Neue Kategorie
		</Button>
	</div>

	<div class="flex flex-wrap gap-2">
		{#each tabs as tab (tab.key)}
			<button
				onclick={() => (filter = tab.key)}
				data-testid="category-filter-{tab.key}"
				class="px-4 py-2 rounded-lg text-sm font-medium transition-colors {tabClass(tab.key)}"
			>
				{tab.label} ({tab.count})
			</button>
		{/each}
	</div>

	<Card padding={false}>
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
					<tr>
						<th class="px-6 py-3 text-left">Kategorie</th>
						<th class="px-6 py-3 text-left">Beschreibung</th>
						<th class="px-6 py-3 text-center">Umlagefähig</th>
						<th class="px-6 py-3 text-center">Verwendung</th>
						<th class="px-6 py-3"><span class="sr-only">Aktionen</span></th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200">
					{#each shown as category (category.id)}
						<CategoryRow {category} ondelete={() => (toDelete = category)} />
					{/each}
				</tbody>
			</table>
		</div>
	</Card>
</div>

{#if toDelete}
	<ConfirmDeleteDialog
		title="Kategorie löschen"
		message="Möchten Sie die Kategorie «{toDelete.name}» wirklich löschen?"
		error={deleteError}
		id={toDelete.id}
		testid="category-delete-confirm"
		onclose={() => (toDelete = null)}
	/>
{/if}
