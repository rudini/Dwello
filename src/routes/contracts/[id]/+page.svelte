<script lang="ts">
	import { flushSync, untrack } from 'svelte';
	import { contractEndError, contractStatusOn } from '$lib/contract-status';
	import { formatDate } from '$lib/utils/format';
	import DateInput from '$lib/ui/DateInput.svelte';
	import { focusFirstError } from '$lib/ui/focus-error';
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
	// the last day of the tenancy, e.g. the day the tenant gave notice for; today is proposed
	let endDate = $state(untrack(() => data.today));
	let endError = $state('');
	function startEnding() {
		endDate = data.today;
		endError = '';
		ending = true;
	}
	// checked in the dialog before sending: a wrong date is said at the field, which gets the focus
	function checkEndDate() {
		endError = '';
		flushSync(); // cleared first: the same error set again shows again
		endError = contractEndError(endDate, contract.startDate, data.today) ?? '';
		if (endError) focusFirstError(document.querySelector('[role="dialog"]'));
		return !endError;
	}
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
				<Button onclick={startEnding} icon="calendar-busy" testid="contract-end-button"
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
	fields={{ endDate, startDate: contract.startDate }}
	check={checkEndDate}
	onsuccess={() =>
		addToast(
			'success',
			endDate === data.today
				? `Der Mietvertrag von ${name} endet heute`
				: `Der Mietvertrag von ${name} endet am ${formatDate(endDate)}`
		)}
>
	<DateInput
		id="endDate"
		label="Vertragsende"
		help="Der letzte Tag des Mietverhältnisses von {name}, zum Beispiel der Tag, auf den der Mieter gekündigt hat. Bis und mit diesem Tag läuft der Mietvertrag; danach gilt er als beendet."
		error={endError}
		bind:value={endDate}
		testid="contract-end-date-input"
	/>
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
	onsuccess={() => addToast('success', `Mietvertrag von ${name} gelöscht`)}
>
	{#if contract.endDate}
		<p>
			Der Mietvertrag von {name} wird endgültig gelöscht. Ein Mietvertrag mit Nebenkostenabrechnungen
			kann nicht gelöscht werden.
		</p>
	{:else}
		<p>Ein Mietvertrag ohne Vertragsende kann nicht gelöscht werden. Beenden Sie ihn zuerst.</p>
	{/if}
</ActionDialog>
