<script lang="ts">
	import type { DistributionKeyRow } from '$lib/distribution-key';
	import Badge from '$lib/ui/Badge.svelte';
	import Button from '$lib/ui/Button.svelte';

	let { key, ondelete }: { key: DistributionKeyRow; ondelete: () => void } = $props();

	// Predefined keys follow Swiss practice: not editable, and their descriptions are English
	const custom = $derived(key.type === 'custom');
	const count = $derived(key.usageCount);
</script>

<li
	class="relative flex flex-col gap-4 rounded-panel border border-line bg-surface p-4 md:flex-row md:items-center"
	data-testid="distribution-key-row"
>
	<div class="flex min-w-0 flex-1 flex-col gap-1">
		{#if custom}
			<!-- The whole row opens the key; its name is the link -->
			<a
				href="/config/distribution-keys/{key.id}/edit"
				class="font-semibold text-accent underline underline-offset-4 after:absolute after:inset-0"
				data-testid="distribution-key-edit-button"
				><span data-testid="distribution-key-name">{key.name}</span></a
			>
			{#if key.description}<p class="text-ink-muted">{key.description}</p>{/if}
		{:else}
			<span class="font-semibold text-ink" data-testid="distribution-key-name">{key.name}</span>
		{/if}
		<p class="text-ink-muted">
			Formel: <code class="break-words font-mono text-ink" data-testid="distribution-key-formula"
				>{key.formula}</code
			>
		</p>
	</div>
	<div class="flex flex-wrap items-center gap-4">
		<Badge
			tone={custom ? 'info' : 'neutral'}
			label={custom ? 'Eigener Verteilschlüssel' : 'Vordefiniert'}
		/>
		<p class="text-ink-muted tabular-nums" data-testid="distribution-key-usage">
			{`${count} ${count === 1 ? 'Rechnung' : 'Rechnungen'}`}
		</p>
		{#if custom}
			<!-- Above the row's link -->
			<div class="relative">
				<Button
					variant="danger-ghost"
					icon="delete"
					onclick={ondelete}
					disabled={count > 0}
					ariaLabel="Verteilschlüssel «{key.name}» löschen"
					testid="distribution-key-delete-button">Löschen</Button
				>
			</div>
		{/if}
	</div>
</li>
