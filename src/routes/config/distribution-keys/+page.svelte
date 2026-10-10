<script lang="ts">
	import type { DistributionKeyRow as Key } from '$lib/distribution-key';
	import Button from '$lib/ui/Button.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import DeleteDialog from '../DeleteDialog.svelte';
	import { help } from '../help';
	import DistributionKeyRow from './DistributionKeyRow.svelte';
	import FormulaHelp from './FormulaHelp.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let toDelete = $state<Key | null>(null);
</script>

<svelte:head>
	<title>Verteilschlüssel - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8">
	<PageHeader
		title="Verteilschlüssel"
		purpose={help.distributionKey}
		trail={[{ href: '/config', label: 'Einstellungen' }]}
	>
		{#snippet action()}
			<Button
				href="/config/distribution-keys/new"
				variant="primary"
				icon="add"
				testid="new-distribution-key-button">Verteilschlüssel erfassen</Button
			>
		{/snippet}
	</PageHeader>

	<div class="flex flex-col gap-4">
		<p class="text-ink-muted">
			Vordefinierte Verteilschlüssel lassen sich nicht ändern. Eigene Verteilschlüssel, nach denen
			schon Rechnungen verteilt werden, lassen sich nicht löschen.
		</p>
		<ul class="flex flex-col gap-4">
			{#each data.keys as key (key.id)}
				<DistributionKeyRow {key} ondelete={() => (toDelete = key)} />
			{/each}
		</ul>
	</div>

	<FormulaHelp />
</div>

<DeleteDialog
	bind:open={
		() => toDelete !== null,
		(open) => {
			if (!open) toDelete = null;
		}
	}
	record="Verteilschlüssel"
	name={toDelete?.name ?? ''}
	id={toDelete?.id}
	error={form?.error}
	confirmTestid="distribution-key-delete-confirm"
>
	<p>Der Verteilschlüssel verschwindet aus der Auswahl beim Erfassen von Rechnungen.</p>
</DeleteDialog>
