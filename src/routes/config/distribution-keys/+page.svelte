<script lang="ts">
	import type { DistributionKeyRow as Key } from '$lib/distribution-key';
	import { localName } from '$lib/names';
	import { m } from '$lib/paraglide/messages';
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
	<title>{m.nav_distribution_keys()} - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8">
	<PageHeader
		title={m.nav_distribution_keys()}
		purpose={help.distributionKey}
		trail={[{ href: '/config', label: m.nav_settings() }]}
	>
		{#snippet action()}
			<Button
				href="/config/distribution-keys/new"
				variant="primary"
				icon="add"
				testid="new-distribution-key-button">{m.keys_add()}</Button
			>
		{/snippet}
	</PageHeader>

	<div class="flex flex-col gap-4">
		<p class="text-ink-muted">
			{m.keys_note()}
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
	record="distributionKey"
	name={toDelete ? localName(toDelete) : ''}
	id={toDelete?.id}
	error={form?.error}
	confirmTestid="distribution-key-delete-confirm"
>
	<p>{m.keys_delete_text()}</p>
</DeleteDialog>
