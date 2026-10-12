<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { untrack } from 'svelte';
	import { contractStatusOn } from '$lib/contract-status';
	import { addToast } from '$lib/stores';
	import type { Apartment, Building, RentalContract, Tenant } from '$lib/types';
	import Button from '$lib/ui/Button.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import ActionDialog from '$lib/ui/ActionDialog.svelte';
	import ContractParties from './ContractParties.svelte';
	import ContractTerms from './ContractTerms.svelte';
	import type { ActionData } from './$types';

	interface PageData {
		today: string;
		contract: RentalContract & { tenant: Tenant; apartment: Apartment; building: Building };
		rentBreakdown: {
			baseRent: number;
			additionalRent: number;
			advancePayment: number;
			total: number;
		};
	}

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const contract = $derived(data.contract);
	const name = $derived(`${contract.tenant.firstName} ${contract.tenant.lastName}`);
	const status = $derived(contractStatusOn(contract.startDate, contract.endDate, data.today));
	let ending = $state(false);
	// a refused delete (also without JavaScript) shows the dialog with its reason
	let deleting = $state(untrack(() => !!form?.deleteError));
</script>

<svelte:head>
	<title>{m.contracts_title()} - {name} - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8">
	<PageHeader
		title={m.apartments_contract_of({ name })}
		purpose="{m.buildings_apartment_number({ number: contract.apartment.number })} · {contract
			.building.name || contract.building.address}"
		trail={[{ href: '/contracts', label: m.nav_contracts() }]}
	>
		{#snippet action()}
			<Button href="/contracts/{contract.id}/edit" icon="edit" testid="contract-edit-button"
				>{m.buildings_edit()}</Button
			>
			{#if !contract.endDate}
				<Button onclick={() => (ending = true)} icon="calendar-busy" testid="contract-end-button"
					>{m.contracts_end_action()}</Button
				>
			{/if}
			<Button
				variant="danger-ghost"
				onclick={() => (deleting = true)}
				icon="delete"
				testid="contract-delete-button">{m.buildings_delete()}</Button
			>
		{/snippet}
	</PageHeader>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<ContractParties
			tenant={contract.tenant}
			apartment={contract.apartment}
			building={contract.building}
		/>
		<ContractTerms
			startDate={contract.startDate}
			endDate={contract.endDate}
			{status}
			rent={data.rentBreakdown}
		/>
	</div>

	<Panel title={m.contracts_related()}>
		<div class="flex flex-wrap gap-4">
			<Button
				href="/statements?contract={contract.id}"
				icon="statement"
				testid="contract-statements-link">{m.nav_statements()}</Button
			>
			<Button
				href="/invoices?building={contract.building.id}"
				icon="invoice"
				testid="contract-invoices-link">{m.contracts_building_invoices()}</Button
			>
		</div>
	</Panel>
</div>

<ActionDialog
	bind:open={ending}
	action="?/end"
	title={m.contracts_end_title()}
	confirmLabel={m.contracts_end_confirm()}
	confirmTestid="contract-end-confirm"
	error={form?.endError}
	onsuccess={() => addToast('success', m.contracts_ends_today_toast({ name }))}
>
	<p>{m.contracts_end_text({ name })}</p>
</ActionDialog>

<ActionDialog
	bind:open={deleting}
	action="?/delete"
	title={m.contracts_delete_title()}
	confirmLabel={m.contracts_delete_confirm()}
	danger
	disabled={!contract.endDate}
	confirmTestid="contract-delete-confirm"
	error={form?.deleteError}
	onsuccess={() => addToast('success', m.contracts_deleted_toast({ name }))}
>
	{#if contract.endDate}
		<p>{m.contracts_delete_text({ name })}</p>
	{:else}
		<p>{m.contracts_delete_open_ended()}</p>
	{/if}
</ActionDialog>
