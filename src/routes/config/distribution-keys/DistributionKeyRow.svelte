<script lang="ts">
	import Badge from '$lib/components/Badge.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import type { DistributionKeyRow } from '$lib/distribution-key';

	let { key, ondelete }: { key: DistributionKeyRow; ondelete: () => void } = $props();

	const custom = $derived(key.type === 'custom');
	const used = $derived(key.usageCount > 0);
	const deleteTitle = $derived(
		used ? 'Verteilschlüssel mit Rechnungen können nicht gelöscht werden' : 'Löschen'
	);
</script>

<tr class="hover:bg-gray-50 transition-colors" data-testid="distribution-key-row">
	<td class="px-6 py-4">
		<div class="font-medium text-gray-900" data-testid="distribution-key-name">{key.name}</div>
		<div class="text-sm text-ink-muted">{key.description}</div>
	</td>
	<td class="px-6 py-4">
		<code
			class="px-2 py-1 bg-gray-100 rounded text-sm font-mono text-purple-700"
			data-testid="distribution-key-formula">{key.formula}</code
		>
	</td>
	<td class="px-6 py-4">
		<Badge variant={custom ? 'primary' : 'info'} size="sm"
			>{custom ? 'Eigener' : 'Vordefiniert'}</Badge
		>
	</td>
	<td class="px-6 py-4 text-center text-sm text-ink-muted" data-testid="distribution-key-usage">
		<span class="font-medium text-gray-900">{key.usageCount}</span> Rechnungen
	</td>
	<td class="px-6 py-4">
		{#if custom}
			<div class="flex items-center justify-end gap-2">
				<a
					href="/config/distribution-keys/{key.id}/edit"
					title="Bearbeiten"
					data-testid="distribution-key-edit-button"
					class="p-1.5 text-ink-muted hover:text-accent hover:bg-blue-50 rounded-lg transition-colors"
				>
					<Icon name="edit" size={18} />
				</a>
				<button
					onclick={ondelete}
					title={deleteTitle}
					disabled={used}
					data-testid="distribution-key-delete-button"
					class="p-1.5 text-ink-muted hover:text-critical hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40 disabled:pointer-events-none"
				>
					<Icon name="delete" size={18} />
				</button>
			</div>
		{/if}
	</td>
</tr>
