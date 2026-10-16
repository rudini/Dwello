<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { flushSync, tick, untrack } from 'svelte';
	import {
		contractEndError,
		contractStatusOn,
		pastEndConfirmation,
		shortNoticePeriod,
		type RefusedStatement
	} from '$lib/contract-status';
	import { enhance } from '$app/forms';
	import { dialogSubmit } from '$lib/ui/dialog-submit';
	import PastEndConfirm from '../PastEndConfirm.svelte';
	import RefusedStatements from '../RefusedStatements.svelte';
	import { formatDate } from '$lib/utils/format';
	import { managementFeeText } from '$lib/contract-form';
	import DateInput from '$lib/ui/DateInput.svelte';
	import { focusFirstError } from '$lib/ui/focus-error';
	import { addToast } from '$lib/stores';
	import Button from '$lib/ui/Button.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import ActionDialog from '$lib/ui/ActionDialog.svelte';
	import ContractParties from './ContractParties.svelte';
	import DeleteContract from './DeleteContract.svelte';
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
	// the day the notice arrived (A-3): optional, no day proposed; a Kündigungsfrist under 3 months is pointed out,
	// never refused (a Ersatzmieter or an agreed end are allowed)
	let noticeReceivedOn = $state('');
	const noticeNote = $derived(
		shortNoticePeriod(noticeReceivedOn, endDate)
			? { text: m.contracts_notice_period_short(), testid: 'contract-notice-period-hint' }
			: undefined
	);
	let confirmedDay = $state('');
	const pastConfirmed = $derived(confirmedDay !== '' && confirmedDay === endDate);
	let pastError = $state('');
	const pastEnd = $derived(pastEndConfirmation(endDate, data.today) !== null);
	function startEnding() {
		endDate = '';
		noticeReceivedOn = '';
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
	// a refusal of another day points to an offer no longer shown (Haiku review of the K2 fixes)
	const refusal = $derived(
		form && 'refusedDay' in form && form.refusedDay !== endDate ? undefined : form?.endError
	);
	let deletingDraft = $state(false);
	// the wizard opens next: the message says what happened before (personas K1)
	const draftDeletedMessage = (number: string) =>
		m.contracts_draft_deleted_toast({ name, number, date: formatDate(endDate) });

	function endedMessage() {
		if (pastEnd) return m.contracts_ended_toast({ name, date: formatDate(endDate) });
		// the notice runs: the page now shows what to do next, above (personas K1)
		const ends =
			endDate === data.today
				? m.contracts_ends_today_toast({ name })
				: m.contracts_ends_on_toast({ name, date: formatDate(endDate) });
		// only when the reloaded page shows them (Haiku review N1)
		return data.nextSteps ? `${ends}. ${m.contracts_next_steps_hint()}` : ends;
	}
	// a refusal of the draft delete is read like one of the end itself
	async function focusRefusal(result: { type: string }) {
		if (result.type !== 'failure') return;
		await tick();
		document.querySelector<HTMLElement>('[role="dialog"] [data-testid="form-error"]')?.focus();
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

	<!-- first what a notice asks for next, then a missing statement: personas K1 read the yellow hint as the notice's -->
	<NextSteps
		shown={data.nextSteps}
		apartmentId={contract.apartmentId}
		tenantId={contract.tenantId}
		{name}
	/>
	<MissingStatement missing={data.missingStatements} />

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
			noticeReceivedOn={contract.noticeReceivedOn}
			{status}
			rent={data.rentBreakdown}
			fee={managementFeeText(contract.managementFeeAgreed, contract.managementFeePercent)}
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
	title={m.contracts_end_title({ name, apartment: contract.apartment.number })}
	confirmLabel={m.contracts_end_confirm()}
	confirmTestid="contract-end-confirm"
	error={refusal}
	fields={{ endDate, noticeReceivedOn, pastConfirmed: pastConfirmed ? 'on' : '' }}
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
						focusRefusal,
						() => addToast('success', draftDeletedMessage(draft.statementNumber))
					)}
				>
					<input type="hidden" name="endDate" value={endDate} />
					<input type="hidden" name="noticeReceivedOn" value={noticeReceivedOn} />
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
	<DateInput
		id="noticeReceivedOn"
		label={m.contracts_notice_received()}
		help={m.contracts_notice_received_help()}
		optional
		note={noticeNote}
		bind:value={noticeReceivedOn}
		testid="contract-notice-received-input"
	/>
	<p class="text-ink-muted">{m.contracts_end_notice_hint()}</p>
	<!-- the contract passes to the heirs (#155): ending it would count the time after as Leerstand -->
	<p class="text-ink-muted" data-testid="contract-end-death">{m.contracts_end_death()}</p>
</ActionDialog>

<DeleteContract
	bind:open={deleting}
	{name}
	startDate={contract.startDate}
	endDate={contract.endDate}
	future={status === 'future'}
	billedBy={data.billedBy}
	missingStatements={data.missingStatements.length > 0}
	error={form?.deleteError}
/>
