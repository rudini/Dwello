<script lang="ts">
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
		{ key: 'all', label: 'Alle' },
		{ key: 'allowed', label: 'Umlagefähig' },
		{ key: 'disallowed', label: 'Nicht umlagefähig' }
	];
</script>

<svelte:head>
	<title>Kategorien - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8">
	<PageHeader
		title="Kategorien"
		purpose="Kategorien ordnen Rechnungen nach Kostenart. Nur Kosten aus umlagefähigen Kategorien fliessen in die Nebenkostenabrechnung, die übrigen trägt der Vermieter."
		trail={[{ href: '/config', label: 'Einstellungen' }]}
	>
		{#snippet action()}
			<Button
				href="/config/categories/new"
				variant="primary"
				icon="add"
				testid="new-category-button">Kategorie erfassen</Button
			>
		{/snippet}
	</PageHeader>

	<div class="flex flex-wrap gap-2" role="group" aria-label="Kategorien anzeigen">
		{#each filters as { key, label } (key)}
			<button
				type="button"
				onclick={() => (filter = key)}
				aria-pressed={filter === key}
				class="min-h-12 rounded-control border-2 px-4 font-semibold {filter === key
					? 'border-accent bg-accent text-on-accent'
					: 'border-line-strong bg-surface text-ink hover:bg-sunken'}"
				data-testid="category-filter-{key}"
			>
				{label} ({data.categories.filter(matches[key]).length})
			</button>
		{/each}
	</div>

	<div class="flex flex-col gap-4">
		<p class="text-ink-muted">
			Kategorien, nach denen schon Rechnungen eingeordnet sind, lassen sich nicht löschen.
		</p>
		{#if shown.length === 0}
			<EmptyState
				title="Keine Kategorien in dieser Auswahl"
				text="Wählen Sie «Alle», um alle Kategorien zu sehen."
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
	record="Kategorie"
	name={toDelete?.name ?? ''}
	id={toDelete?.id}
	error={form?.error}
	confirmTestid="category-delete-confirm"
>
	<p>Die Kategorie verschwindet aus der Auswahl beim Erfassen von Rechnungen.</p>
</DeleteDialog>
