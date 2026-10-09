<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import type { CategoryWithUsage } from '$lib/server/category';

	let { category, ondelete }: { category: CategoryWithUsage; ondelete: () => void } = $props();

	const used = $derived(category.usageCount > 0);
	const allowed = $derived(
		category.isAllowedUtilityCost
			? { label: 'Ja', icon: 'check_circle', class: 'bg-green-100 text-positive' }
			: { label: 'Nein', icon: 'warning', class: 'bg-amber-100 text-caution' }
	);
	const deleteTitle = $derived(
		used ? 'Kategorien mit Rechnungen können nicht gelöscht werden' : 'Löschen'
	);
</script>

<tr class="hover:bg-gray-50 transition-colors" data-testid="category-row">
	<td class="px-6 py-4 font-medium text-gray-900" data-testid="category-name">{category.name}</td>
	<td class="px-6 py-4 text-sm text-gray-600 max-w-xs">{category.description || '-'}</td>
	<td class="px-6 py-4 text-center">
		<span
			class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium {allowed.class}"
		>
			<Icon name={allowed.icon} size={14} />
			<span data-testid="category-allowed">{allowed.label}</span>
		</span>
	</td>
	<td class="px-6 py-4 text-center text-sm text-ink-muted" data-testid="category-usage">
		<span class="font-medium text-gray-900">{category.usageCount}</span> Rechnungen
	</td>
	<td class="px-6 py-4">
		<div class="flex items-center justify-end gap-2">
			<a
				href="/config/categories/{category.id}/edit"
				title="Bearbeiten"
				data-testid="category-edit-button"
				class="p-1.5 text-ink-muted hover:text-accent hover:bg-blue-50 rounded-lg transition-colors"
			>
				<Icon name="edit" size={18} />
			</a>
			<button
				onclick={ondelete}
				title={deleteTitle}
				disabled={used}
				data-testid="category-delete-button"
				class="p-1.5 text-ink-muted hover:text-critical hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40 disabled:pointer-events-none"
			>
				<Icon name="delete" size={18} />
			</button>
		</div>
	</td>
</tr>
