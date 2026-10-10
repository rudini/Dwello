<script lang="ts">
	import { untrack } from 'svelte';
	import { contractStatusOn, localToday } from '$lib/contract-status';
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
	const status = $derived(contractStatusOn(contract.startDate, contract.endDate, localToday()));
	let ending = $state(false);
	// a refused delete (also without JavaScript) shows the dialog with its reason
	let deleting = $state(untrack(() => !!form?.deleteError));
</script>

<svelte:head>
	<title>Mietvertrag - {name} - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8">
	<PageHeader
		title="Mietvertrag von {name}"
		purpose="Wohnung {contract.apartment.number} · {contract.building.name ||
			contract.building.address}"
		trail={[{ href: '/contracts', label: 'Mietverträge' }]}
	>
		{#snippet action()}
			<Button href="/contracts/{contract.id}/edit" icon="edit" testid="contract-edit-button"
				>Bearbeiten</Button
			>
			{#if !contract.endDate}
				<Button onclick={() => (ending = true)} icon="calendar-busy" testid="contract-end-button"
					>Beenden</Button
				>
			{/if}
			<Button
				variant="danger-ghost"
				onclick={() => (deleting = true)}
				icon="delete"
				testid="contract-delete-button">Löschen</Button
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

	<Panel title="Dazu gehört">
		<div class="flex flex-wrap gap-4">
			<Button
				href="/statements?contract={contract.id}"
				icon="statement"
				testid="contract-statements-link">Nebenkostenabrechnungen</Button
			>
			<Button
				href="/invoices?building={contract.building.id}"
				icon="invoice"
				testid="contract-invoices-link">Rechnungen des Gebäudes</Button
			>
		</div>
	</Panel>
</div>

<ActionDialog
	bind:open={ending}
	action="?/end"
	title="Mietvertrag beenden?"
	confirmLabel="Mietvertrag beenden"
	confirmTestid="contract-end-confirm"
	error={form?.endError}
	onsuccess={() => addToast('success', `Der Mietvertrag von ${name} endet heute`)}
>
	<p>
		Das Vertragsende wird auf heute gesetzt. Heute ist der letzte Tag des Mietverhältnisses von {name};
		ab morgen gilt der Mietvertrag als beendet.
	</p>
</ActionDialog>

<ActionDialog
	bind:open={deleting}
	action="?/delete"
	title="Mietvertrag löschen?"
	confirmLabel="Mietvertrag löschen"
	danger
	disabled={!contract.endDate}
	confirmTestid="contract-delete-confirm"
	error={form?.deleteError}
>
	{#if contract.endDate}
		<p>
			Der Mietvertrag von {name} wird endgültig gelöscht. Mietverträge mit Nebenkostenabrechnungen bleiben
			erhalten.
		</p>
	{:else}
		<p>Ein Mietvertrag ohne Vertragsende kann nicht gelöscht werden. Beenden Sie ihn zuerst.</p>
	{/if}
</ActionDialog>
