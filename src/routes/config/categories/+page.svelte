<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Category } from '$lib/types';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';
	import CategoryBadge from '$lib/components/CategoryBadge.svelte';
	import Modal from '$lib/components/Modal.svelte';

	interface CategoryWithUsage extends Category {
		usageCount: number;
	}

	interface PageData {
		categories: CategoryWithUsage[];
		total: number;
	}

	let { data }: { data: PageData } = $props();

	let validityFilter = $state<'all' | 'allowed' | 'disallowed'>('all');
	let showDeleteModal = $state(false);
	let categoryToDelete = $state<CategoryWithUsage | null>(null);
	let isDeleting = $state(false);

	const filteredCategories = $derived.by(() => {
		if (validityFilter === 'allowed') {
			return data.categories.filter((c) => c.isAllowedUtilityCost);
		}
		if (validityFilter === 'disallowed') {
			return data.categories.filter((c) => !c.isAllowedUtilityCost);
		}
		return data.categories;
	});

	const allowedCount = $derived(data.categories.filter((c) => c.isAllowedUtilityCost).length);
	const disallowedCount = $derived(data.categories.filter((c) => !c.isAllowedUtilityCost).length);

	function handleDelete(category: CategoryWithUsage) {
		categoryToDelete = category;
		showDeleteModal = true;
	}

	async function confirmDelete() {
		if (!categoryToDelete) return;
		isDeleting = true;
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));
		// In production, this would DELETE to the API and refresh data
		console.log('Deleting category:', categoryToDelete.id);
		showDeleteModal = false;
		categoryToDelete = null;
		isDeleting = false;
	}
</script>

<svelte:head>
	<title>Kategorien - Dwello</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Kategorien</h1>
			<p class="text-gray-500 mt-1">{data.total} Kategorien insgesamt</p>
		</div>
		<Button href="/config/categories/new" variant="primary">
			<Icon name="add" size={20} />
			Neue Kategorie
		</Button>
	</div>

	<!-- Filter Tabs -->
	<Card>
		<div class="flex flex-wrap gap-2">
			<button
				class="px-4 py-2 rounded-lg text-sm font-medium transition-colors {validityFilter ===
				'all'
					? 'bg-primary text-white'
					: 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
				onclick={() => (validityFilter = 'all')}
			>
				Alle ({data.total})
			</button>
			<button
				class="px-4 py-2 rounded-lg text-sm font-medium transition-colors {validityFilter ===
				'allowed'
					? 'bg-green-600 text-white'
					: 'bg-green-50 text-green-700 hover:bg-green-100'}"
				onclick={() => (validityFilter = 'allowed')}
			>
				<span class="flex items-center gap-1.5">
					<Icon name="check_circle" size={16} />
					Umlagefähig ({allowedCount})
				</span>
			</button>
			<button
				class="px-4 py-2 rounded-lg text-sm font-medium transition-colors {validityFilter ===
				'disallowed'
					? 'bg-amber-600 text-white'
					: 'bg-amber-50 text-amber-700 hover:bg-amber-100'}"
				onclick={() => (validityFilter = 'disallowed')}
			>
				<span class="flex items-center gap-1.5">
					<Icon name="warning" size={16} />
					Nicht umlagefähig ({disallowedCount})
				</span>
			</button>
		</div>
	</Card>

	<!-- Swiss Law Info -->
	<Card>
		<div class="flex items-start gap-3">
			<Icon name="gavel" size={24} class="text-blue-500 flex-shrink-0" />
			<div>
				<h3 class="font-medium text-gray-900 mb-1">Schweizer Mietrecht (Art. 257a-257b OR)</h3>
				<p class="text-sm text-gray-600">
					<strong>Umlagefähige Nebenkosten:</strong> Heizung, Warmwasser, Wasser/Abwasser,
					Allgemeinstrom, Hauswart, Aufzug, Gartenpflege, Kehricht, Verwaltungsgebühr (üblich bis 3%).
				</p>
				<p class="text-sm text-gray-600 mt-1">
					<strong>Nicht umlagefähig:</strong> Reparaturen, Versicherungen, Steuern, Hypothekenzinsen,
					Anschlussgebühren.
				</p>
			</div>
		</div>
	</Card>

	<!-- Categories List -->
	{#if filteredCategories.length === 0}
		<Card>
			<div class="text-center py-12">
				<Icon name="category" size={48} class="mx-auto text-gray-300 mb-4" />
				<h3 class="text-lg font-medium text-gray-900 mb-2">Keine Kategorien gefunden</h3>
				<p class="text-gray-500 mb-6">
					Es gibt keine Kategorien mit dem ausgewählten Filter.
				</p>
			</div>
		</Card>
	{:else}
		<Card padding={false}>
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead class="bg-gray-50 border-b border-gray-200">
						<tr>
							<th
								class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
							>
								Kategorie
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
							>
								Beschreibung
							</th>
							<th
								class="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"
							>
								Umlagefähig
							</th>
							<th
								class="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"
							>
								Verwendung
							</th>
							<th
								class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
							>
								Aktionen
							</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200">
						{#each filteredCategories as category}
							<tr class="hover:bg-gray-50 transition-colors">
								<td class="px-6 py-4">
									<CategoryBadge {category} showValidity={false} />
								</td>
								<td class="px-6 py-4">
									<p class="text-sm text-gray-600 max-w-xs">
										{category.description || '-'}
									</p>
								</td>
								<td class="px-6 py-4 text-center">
									{#if category.isAllowedUtilityCost}
										<span
											class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"
										>
											<Icon name="check_circle" size={14} />
											Ja
										</span>
									{:else}
										<span
											class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700"
										>
											<Icon name="warning" size={14} />
											Nein
										</span>
									{/if}
								</td>
								<td class="px-6 py-4 text-center">
									<span class="text-sm font-medium text-gray-900">
										{category.usageCount}
									</span>
									<span class="text-sm text-gray-500"> Rechnungen</span>
								</td>
								<td class="px-6 py-4 text-right">
									<div class="flex items-center justify-end gap-2">
										<button
											onclick={() => goto(`/config/categories/${category.id}/edit`)}
											class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
											title="Bearbeiten"
										>
											<Icon name="edit" size={18} />
										</button>
										<button
											onclick={() => handleDelete(category)}
											class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
											title="Löschen"
											disabled={category.usageCount > 0}
										>
											<Icon name="delete" size={18} />
										</button>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</Card>
	{/if}
</div>

<!-- Delete Modal -->
<Modal open={showDeleteModal} title="Kategorie löschen" onclose={() => (showDeleteModal = false)}>
	<p class="text-gray-600 mb-4">
		Möchten Sie diese Kategorie wirklich löschen? Diese Aktion kann nicht rückgängig gemacht
		werden.
	</p>
	{#if categoryToDelete}
		<div class="p-3 bg-gray-50 rounded-lg mb-4">
			<p class="font-medium text-gray-900">{categoryToDelete.name}</p>
			<p class="text-sm text-gray-500">{categoryToDelete.description}</p>
			{#if categoryToDelete.usageCount > 0}
				<p class="text-sm text-red-600 mt-2 flex items-center gap-1">
					<Icon name="warning" size={14} />
					Diese Kategorie wird von {categoryToDelete.usageCount} Rechnungen verwendet und kann nicht
					gelöscht werden.
				</p>
			{/if}
		</div>
	{/if}
	<div class="flex justify-end gap-3">
		<Button variant="secondary" onclick={() => (showDeleteModal = false)}>Abbrechen</Button>
		<Button
			variant="primary"
			onclick={confirmDelete}
			disabled={isDeleting || (categoryToDelete?.usageCount ?? 0) > 0}
			class="bg-red-600 hover:bg-red-700"
		>
			{#if isDeleting}
				<Icon name="progress_activity" size={20} class="animate-spin" />
				Wird gelöscht...
			{:else}
				<Icon name="delete" size={20} />
				Löschen
			{/if}
		</Button>
	</div>
</Modal>
