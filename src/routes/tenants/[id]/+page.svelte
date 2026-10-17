<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { untrack } from 'svelte';
	import { addToast } from '$lib/stores';
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
	// without contracts there are no Mahnungen: every document is an upload, deleted with the tenant
	const hasDocuments = $derived(data.documents.length > 0);
	// with contracts the tenant stays, and so do the files uploaded to them
	const hasUploads = $derived(data.documents.some((document) => document.type === 'upload'));
	// a refused delete (also without JavaScript) shows the dialog with its reason
	let deleting = $state(untrack(() => !!form?.error));
</script>

<svelte:head>
	<title>{name} - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8">
	<PageHeader
		title={name}
		purpose={m.tenants_detail_purpose()}
		trail={[{ href: '/tenants', label: m.nav_tenants() }]}
	>
		{#snippet action()}
			<Button href="/tenants/{tenant.id}/edit" icon="edit" testid="tenant-edit-button"
				>{m.buildings_edit()}</Button
			>
			<Button
				href="/contracts/new?tenant={tenant.id}"
				variant="primary"
				icon="contract"
				testid="tenant-new-contract-button">{m.dashboard_add_contract()}</Button
			>
			<Button
				variant="danger-ghost"
				onclick={() => (deleting = true)}
				icon="delete"
				testid="tenant-delete-button">{m.buildings_delete()}</Button
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
			<TenantDocumentsCard
				documents={data.documents}
				former={data.formerDocuments}
				name={`${tenant.firstName} ${tenant.lastName}`}
				{form}
				demo={data.demo}
			/>
		</div>
	</div>
</div>

<ActionDialog
	bind:open={deleting}
	action="?/delete"
	title={m.tenants_delete_title({ name })}
	confirmLabel={m.tenants_delete_confirm()}
	danger
	disabled={hasContracts}
	confirmTestid="tenant-delete-confirm"
	error={form?.error}
	onsuccess={() => addToast('success', m.tenants_deleted_toast({ name }))}
>
	<p data-testid="delete-dialog-message">
		{hasContracts
			? hasUploads
				? m.tenants_delete_has_contracts_documents()
				: m.tenants_delete_has_contracts()
			: hasDocuments
				? m.tenants_delete_text_with_documents({ name })
				: m.tenants_delete_text({ name })}
	</p>
</ActionDialog>
