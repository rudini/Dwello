<script lang="ts">
	import { untrack } from 'svelte';
	import ActionDialog from '$lib/ui/ActionDialog.svelte';
	import Button from '$lib/ui/Button.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import TenantContactCard from './TenantContactCard.svelte';
	import TenantContracts from './TenantContracts.svelte';
	import TenantDocumentsCard from './TenantDocumentsCard.svelte';
	import TenantRentalCard from './TenantRentalCard.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const tenant = $derived(data.tenant);
	const name = $derived(`${tenant.firstName} ${tenant.lastName}`);
	const hasContracts = $derived(data.contractHistory.length > 0);
	// a refused delete (also without JavaScript) shows the dialog with its reason
	let deleting = $state(untrack(() => !!form?.error));
</script>

<svelte:head>
	<title>{name} - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8">
	<PageHeader
		title={name}
		purpose="Kontaktdaten, Miete, Mietverträge und Dokumente dieses Mieters."
		trail={[{ href: '/tenants', label: 'Mieter' }]}
	>
		{#snippet action()}
			<Button href="/tenants/{tenant.id}/edit" icon="edit" testid="tenant-edit-button"
				>Bearbeiten</Button
			>
			<Button
				href="/contracts/new?tenant={tenant.id}"
				variant="primary"
				icon="contract"
				testid="tenant-new-contract-button">Mietvertrag erfassen</Button
			>
			<Button
				variant="danger-ghost"
				onclick={() => (deleting = true)}
				icon="delete"
				testid="tenant-delete-button">Löschen</Button
			>
		{/snippet}
	</PageHeader>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
		<div class="flex flex-col gap-6">
			<TenantContactCard {tenant} />
			<TenantRentalCard rental={data.rental} />
		</div>
		<div class="flex flex-col gap-6 lg:col-span-2">
			<TenantContracts contracts={data.contractHistory} />
			<TenantDocumentsCard documents={data.documents} />
		</div>
	</div>
</div>

<ActionDialog
	bind:open={deleting}
	action="?/delete"
	title="{name} löschen?"
	confirmLabel="Mieter löschen"
	danger
	disabled={hasContracts}
	confirmTestid="tenant-delete-confirm"
	error={form?.error}
>
	<p data-testid="delete-dialog-message">
		{hasContracts
			? 'Mieter mit Mietverträgen bleiben erhalten, weil Abrechnungen und Dokumente auf sie verweisen.'
			: `${name} wird endgültig gelöscht. Das lässt sich nicht rückgängig machen.`}
	</p>
</ActionDialog>
