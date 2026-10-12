<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { flushSync, untrack } from 'svelte';
	import {
		contractEndError,
		contractStatusOn,
		pastEndConfirmation,
		type RefusedStatement
	} from '$lib/contract-status';
	import { enhance } from '$app/forms';
	import { dialogSubmit } from '$lib/ui/dialog-submit';
	import PastEndConfirm from '../PastEndConfirm.svelte';
	import RefusedStatements from '../RefusedStatements.svelte';
	import { formatDate } from '$lib/utils/format';
	import DateInput from '$lib/ui/DateInput.svelte';
	import { focusFirstError } from '$lib/ui/focus-error';
	import { addToast } from '$lib/stores';
	import Button from '$lib/ui/Button.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import ActionDialog from '$lib/ui/ActionDialog.svelte';
	import ContractParties from './ContractParties.svelte';
	import ContractTerms from './ContractTerms.svelte';
	import MissingStatement from './MissingStatement.svelte';
	import NextSteps from './NextSteps.svelte';
	import type { ActionData, PageData } from './$types';

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
	// the statements that refused the end, to open or to delete one (A-10)
	// only for the day refused: another day typed afterwards may not need the draft deleted (review K-2)
	const refused = $derived(
		form && 'refusedDay' in form && 'refused' in form && form.refusedDay === endDate
			? (form.refused as RefusedStatement[])
			: null
	);
	let deletingDraft = $state(false);
	// the wizard opens next: the message says what happened before (personas K1)
	const draftDeletedMessage = (number: string) =>
		m.contracts_draft_deleted_toast({ name, number, date: formatDate(endDate) });

	function endedMessage() {
		if (pastEnd) return m.contracts_ended_toast({ name, date: formatDate(endDate) });
		if (endDate === data.today) return m.contracts_ends_today_toast({ name });
		return m.contracts_ends_on_toast({ name, date: formatDate(endDate) });
	}
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
				<Button onclick={startEnding} icon="calendar-busy" testid="contract-end-button"
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

	<MissingStatement missing={data.missingStatement} />

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

	<NextSteps
		terminated={contract.terminated}
		apartmentId={contract.apartmentId}
		tenantId={contract.tenantId}
	/>

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
	title={m.contracts_end_title({ name, apartment: contract.apartment.number })}
	confirmLabel={m.contracts_end_confirm()}
	confirmTestid="contract-end-confirm"
	error={form?.endError}
	fields={{ endDate, pastConfirmed: pastConfirmed ? 'on' : '' }}
	check={checkEndDate}
	onsuccess={() => addToast('success', endedMessage())}
>
	{#snippet afterError()}
		<RefusedStatements statements={refused ?? []}>
			{#snippet action(draft, consequence)}
				<form
					method="POST"
					action="?/endDeletingDraft"
					use:enhance={dialogSubmit(
						() => ({}),
						(busy) => (deletingDraft = busy),
						() => {},
						() => addToast('success', draftDeletedMessage(draft.statementNumber))
					)}
				>
					<input type="hidden" name="endDate" value={endDate} />
					<input type="hidden" name="pastConfirmed" value={pastConfirmed ? 'on' : ''} />
					<input type="hidden" name="statementId" value={draft.id} />
					<Button
						type="submit"
						variant="danger"
						icon="delete"
						busy={deletingDraft}
						describedby={consequence}
						testid="delete-draft-and-end">{m.contracts_delete_draft_and_end()}</Button
					>
				</form>
			{/snippet}
		</RefusedStatements>
	{/snippet}
	<!-- TODO(fachlich prüfen): «Kündigungstermin», «Kündigungsfrist» are not in the glossary (offene-punkte.md) -->
	<DateInput
		id="endDate"
		label={m.dashboard_kind_contract_end()}
		help={m.contracts_end_date_help()}
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
	<p class="text-ink-muted">{m.contracts_end_notice_hint()}</p>
</ActionDialog>

<ActionDialog
	bind:open={deleting}
	action="?/delete"
	title={m.contracts_delete_title()}
	confirmLabel={m.contracts_delete_confirm()}
	danger
	disabled={status !== 'future'}
	confirmTestid="contract-delete-confirm"
	error={form?.deleteError}
	onsuccess={() => addToast('success', m.contracts_deleted_toast({ name }))}
>
	{#if status === 'future'}
		<p>{m.contracts_delete_future_text({ name })}</p>
	{:else}
		<p>{m.contracts_started_not_deletable()} {m.contracts_started_fix_hint()}</p>
	{/if}
</ActionDialog>
