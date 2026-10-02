<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import ConfirmDeleteDialog from '$lib/components/ConfirmDeleteDialog.svelte';
	import PageTrail from '$lib/components/PageTrail.svelte';
	import RecordTable from '$lib/components/RecordTable.svelte';
	import type { DistributionKeyRow as Key } from '$lib/distribution-key';
	import DistributionKeyRow from './DistributionKeyRow.svelte';
	import FormulaHelp from './FormulaHelp.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let toDelete = $state<Key | null>(null);
	const deleteError = $derived(form?.error);
</script>

<svelte:head>
	<title>Verteilschlüssel - Dwello</title>
</svelte:head>

<div class="space-y-6">
	<PageTrail links={[{ href: '/config', label: 'Einstellungen' }]} current="Verteilschlüssel" />

	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Verteilschlüssel</h1>
			<p class="text-gray-500 mt-1">Wie Kosten auf die Wohnungen eines Gebäudes verteilt werden</p>
		</div>
		<Button href="/config/distribution-keys/new" variant="primary" testid="new-distribution-key-button">
			<Icon name="add" size={20} />
			Neuer Verteilschlüssel
		</Button>
	</div>

	<RecordTable columns={[{ label: 'Name' }, { label: 'Formel' }, { label: 'Art' }, { label: 'Verwendung', align: 'center' }]}>
		{#each data.keys as key (key.id)}
			<DistributionKeyRow {key} ondelete={() => (toDelete = key)} />
		{/each}
	</RecordTable>

	<FormulaHelp />
</div>

{#if toDelete}
	<ConfirmDeleteDialog
		title="Verteilschlüssel löschen"
		message="Möchten Sie den Verteilschlüssel «{toDelete.name}» wirklich löschen?"
		error={deleteError}
		id={toDelete.id}
		testid="distribution-key-delete-confirm"
		onclose={() => (toDelete = null)}
	/>
{/if}
