<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import ContractHistoryTable from '$lib/components/ContractHistoryTable.svelte';
	import TenantDocumentsCard from './TenantDocumentsCard.svelte';
	import TenantContactCard from './TenantContactCard.svelte';
	import TenantRentalCard from './TenantRentalCard.svelte';
	import ConfirmDeleteDialog from '$lib/components/ConfirmDeleteDialog.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const tenant = $derived(data.tenant);
	const name = $derived(`${tenant.firstName} ${tenant.lastName}`);
	const contact = $derived(tenant.email ?? '');
	const deleteError = $derived(form?.error);
	let deleting = $state(false);
	const hasContracts = $derived(data.contractHistory.length > 0);
	// Statements and documents refer to tenants with contracts
	const deleteMessage = $derived(
		hasContracts
			? 'Mieter mit Mietverträgen bleiben erhalten, weil Abrechnungen und Dokumente auf sie verweisen.'
			: 'Der Mieter wird endgültig gelöscht.'
	);
	// A refused delete keeps the dialog open with the reason
	const dialogOpen = $derived(deleting || Boolean(deleteError));
</script>

<svelte:head>
	<title>{name} - Dwello</title>
</svelte:head>

<div class="space-y-6">
	<nav class="flex items-center text-sm text-gray-500">
		<a href="/tenants" data-testid="breadcrumb-link" class="hover:text-primary transition-colors"
			>Mieter</a
		>
		<Icon name="chevron_right" size={16} class="mx-2" />
		<span class="text-gray-900 font-medium">{name}</span>
	</nav>

	<div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">{name}</h1>
			<p class="text-gray-500 mt-1">{contact}</p>
		</div>
		<div class="flex gap-2">
			<Button href="/tenants/{tenant.id}/edit" variant="secondary" testid="tenant-edit-button">
				<Icon name="edit" size={18} />
				Bearbeiten
			</Button>
			<Button
				href="/contracts/new?tenant={tenant.id}"
				variant="secondary"
				testid="tenant-new-contract-button"
			>
				<Icon name="add" size={18} />
				Neuer Mietvertrag
			</Button>
			<Button variant="danger" onclick={() => (deleting = true)} testid="tenant-delete-button">
				<Icon name="delete" size={18} />
				Löschen
			</Button>
		</div>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<div class="lg:col-span-1 space-y-6">
			<TenantContactCard {tenant} />
			<TenantRentalCard rental={data.rental} />
		</div>

		<div class="lg:col-span-2 space-y-6">
			<ContractHistoryTable contracts={data.contractHistory} by="apartment" />

			<TenantDocumentsCard documents={data.documents} />
		</div>
	</div>
</div>

{#if dialogOpen}
	<ConfirmDeleteDialog
		title="{name} löschen?"
		message={deleteMessage}
		error={deleteError}
		disabled={hasContracts}
		testid="tenant-delete-confirm"
		onclose={() => (deleting = false)}
	/>
{/if}
