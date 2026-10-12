<script lang="ts">
	import { flushSync, untrack } from 'svelte';
	import { contractEndError, contractStatusOn, pastEndConfirmation } from '$lib/contract-status';
	import PastEndConfirm from '../PastEndConfirm.svelte';
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
	// the last day of the tenancy, the Kündigungstermin; typed on purpose, no day proposed (a quick confirm must not
	// end the contract today); a past day, e.g. a notice recorded late, is confirmed with its consequence
	let endDate = $state('');
	let endError = $state('');
	let confirmedDay = $state('');
	const pastConfirmed = $derived(confirmedDay !== '' && confirmedDay === endDate);
	let pastError = $state('');
	const pastEnd = $derived(pastEndConfirmation(endDate, data.today) !== null);
	function startEnding() {
		endDate = '';
		endError = '';
		confirmedDay = '';
		pastError = '';
		ending = true;
	}
	// an error at the field names a day: another day typed takes it back
	let endErrorFor = '';
	$effect(() => {
		if (endDate === endErrorFor) return;
		endErrorFor = endDate;
		endError = '';
	});
	// checked in the dialog before sending: a wrong date is said at the field, which gets the focus
	function checkEndDate() {
		endError = pastError = '';
		flushSync(); // cleared first: the same error set again shows again
		endError = contractEndError(endDate, contract.startDate, data.today) ?? '';
		if (!endError && !pastConfirmed) pastError = pastEndConfirmation(endDate, data.today) ?? '';
		if (endError || pastError) focusFirstError(document.querySelector('[role="dialog"]'));
		return !endError && !pastError;
	}
	// the toast names the day the tenancy ends, or since when it has ended
	function endedMessage() {
		if (pastEnd) return `Der Mietvertrag von ${name} endete am ${formatDate(endDate)}`;
		if (endDate === data.today) return `Der Mietvertrag von ${name} endet heute`;
		return `Der Mietvertrag von ${name} endet am ${formatDate(endDate)}`;
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
			terminated={contract.terminated}
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
	fields={{ endDate, pastConfirmed: pastConfirmed ? 'on' : '' }}
	check={checkEndDate}
	onsuccess={() => addToast('success', endedMessage())}
>
	<!-- TODO(fachlich prüfen): «Kündigungstermin», «Kündigungsfrist» are not in the glossary (offene-punkte.md) -->
	<DateInput
		id="endDate"
		label="Vertragsende"
		help="Der letzte Tag des Mietverhältnisses, also der Kündigungstermin. Bis und mit diesem Tag läuft der Mietvertrag, auch wenn der Mieter früher auszieht."
		min={contract.startDate.slice(0, 10)}
		error={endError}
		bind:value={endDate}
		testid="contract-end-date-input"
	/>
	<PastEndConfirm
		{endDate}
		startDate={contract.startDate}
		today={data.today}
		bind:confirmedDay
		bind:error={pastError}
	/>
	<p class="text-ink-muted">
		Prüfen Sie Frist und Termin im Mietvertrag: Für Wohnungen gilt eine Kündigungsfrist von
		mindestens 3 Monaten. Ist die Kündigung zu spät, gilt sie erst auf den nächsten
		Kündigungstermin. Ein neuer Mietvertrag kann am Tag danach beginnen.
	</p>
</ActionDialog>

<ActionDialog
	bind:open={deleting}
	action="?/delete"
	title="Mietvertrag löschen?"
	confirmLabel="Mietvertrag löschen"
	danger
	disabled={status !== 'future'}
	confirmTestid="contract-delete-confirm"
	error={form?.deleteError}
	onsuccess={() => addToast('success', `Mietvertrag von ${name} gelöscht`)}
>
	{#if status === 'future'}
		<p>Der Mietvertrag von {name} hat noch nicht begonnen und wird endgültig gelöscht.</p>
	{:else}
		<p>
			Ein Mietvertrag, der begonnen hat, kann nicht gelöscht werden: Die Nebenkostenabrechnung
			braucht seine Mietstage, also die Tage, an denen er gilt. Ist er falsch erfasst, korrigieren
			Sie ihn unter «Bearbeiten».
		</p>
	{/if}
</ActionDialog>
