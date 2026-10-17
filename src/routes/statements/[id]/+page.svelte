<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { flushSync } from 'svelte';
	import { backendMessage } from '$lib/backend-error';
	import type { StatementDocument, StatementWithDetails } from '$lib/types';
	import { addToast } from '$lib/stores';
	import {
		balanceLabel,
		claimed,
		nextReminderLater,
		paidDateError,
		paidHelp,
		statusLabels,
		statusTones
	} from '$lib/statement';
	import { focusFirstError } from '$lib/ui/focus-error';
	import Alert from '$lib/ui/Alert.svelte';
	import Badge from '$lib/ui/Badge.svelte';
	import Button from '$lib/ui/Button.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import { formatCurrency, formatDate } from '$lib/utils/format';
	import CostTable from './CostTable.svelte';
	import FormDialog from './FormDialog.svelte';
	import DateInput from '$lib/ui/DateInput.svelte';
	import { localToday } from '$lib/contract-status';
	import MetadataCard from './MetadataCard.svelte';
	import OldAddressWarning from './OldAddressWarning.svelte';
	import PartiesPanel from './PartiesPanel.svelte';
	import PaymentPanel from './PaymentPanel.svelte';
	import PdfAction from './PdfAction.svelte';
	import ReminderFeedback from './ReminderFeedback.svelte';
	import ReminderHistory from './ReminderHistory.svelte';
	import ReminderModal from './ReminderModal.svelte';
	import ResetPaymentDialog from './ResetPaymentDialog.svelte';
	import SendDialog from './SendDialog.svelte';
	import StatusActions from './StatusActions.svelte';
	import type { ActionData } from './$types';

	let {
		data,
		form
	}: {
		data: {
			statement: StatementWithDetails;
			reminders: StatementDocument[];
			laterInvoices?: number;
		};
		form: ActionData;
	} = $props();

	const statement = $derived(data.statement);
	// invoices of the period recorded after the draft was created: it lacks them
	const laterInvoices = $derived(
		data.laterInvoices === 1
			? m.statements_later_one()
			: m.statements_later_many({ count: data.laterInvoices ?? 0 })
	);
	let showMarkPaid = $state(false);
	let showReminder = $state(false);
	let showDelete = $state(false);
	let showSend = $state(false);
	let showResetPayment = $state(false);
	let generatingPdf = $state(false);
	let paidDate = $state(localToday());
	let paidError = $state('');

	// checked in the dialog before sending: a wrong date is said at the field, which gets the focus
	function checkPaidDate() {
		paidError = '';
		flushSync(); // cleared first: the same error set again shows again
		paidError = paidDateError(paidDate, statement.statementDate) ?? '';
		if (paidError) focusFirstError(document.querySelector('[role="dialog"]'));
		return !paidError;
	}
	let pdfGeneratedAt = $derived(data.statement.pdfGeneratedAt); // set here after «PDF erstellen», else as the server has it

	async function generatePdf() {
		generatingPdf = true;
		try {
			const response = await fetch(`/api/statements/${statement.id}/generate-pdf`, {
				method: 'POST'
			});
			if (response.ok) {
				pdfGeneratedAt = new Date().toISOString();
				addToast('success', m.statements_pdf_created());
			} else {
				const error = await response.json();
				// PDF_FAILED already says the PDF could not be made
				addToast(
					'error',
					error.code === 'PDF_FAILED'
						? backendMessage(error, m.statements_pdf_failed())
						: m.statements_pdf_failed_reason({
								reason: backendMessage(error, m.statements_unknown_error())
							})
				);
			}
		} catch {
			addToast('error', m.statements_pdf_failed());
		} finally {
			generatingPdf = false;
		}
	}

	const period = $derived(
		`${formatDate(statement.periodStart)} – ${formatDate(statement.periodEnd)}`
	);
	const balance = $derived(
		`${balanceLabel(statement.balance)} ${formatCurrency(Math.abs(statement.balance))}`
	);
</script>

<svelte:head>
	<title>{m.statements_title({ number: statement.statementNumber })} - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8">
	<PageHeader
		title={m.statements_title({ number: statement.statementNumber })}
		purpose="{statement.tenantName}, {statement.buildingName}, {m.buildings_apartment_number({
			number: statement.apartmentUnit
		})} · {m.glossary_period_term()} {period}"
		trail={[{ href: '/statements', label: m.nav_statements() }]}
	>
		{#snippet action()}
			<PdfAction
				id={statement.id}
				generated={!!pdfGeneratedAt}
				generating={generatingPdf}
				language={statement.tenantLanguage}
				ongenerate={generatePdf}
			/>
			<StatusActions
				status={statement.status}
				owes={claimed(statement.balance)}
				waiting={!!nextReminderLater(statement)}
				onremind={() => (showReminder = true)}
				onmarkpaid={() => ((paidDate = localToday()), (paidError = ''), (showMarkPaid = true))}
				onsend={() => (showSend = true)}
				onresetpayment={() => (showResetPayment = true)}
			/>
		{/snippet}
	</PageHeader>

	<p class="flex flex-wrap items-center gap-2 text-ink">
		{m.statements_status_label()}
		<Badge
			tone={statusTones[statement.status]}
			label={statusLabels[statement.status]}
			testid="statement-status"
		/>
	</p>

	<OldAddressWarning {statement} testid="statement-old-address" />

	{#if data.laterInvoices}
		<!-- a draft is created again; a sent statement is corrected outside Dwello (it cannot be deleted) -->
		<Alert tone="caution" title={m.statements_later_title()} testid="statement-later-invoices">
			{#if statement.status === 'draft'}
				<p>{m.statements_later_draft({ later: laterInvoices })}</p>
			{:else}
				<p>{m.statements_later_sent({ later: laterInvoices })}</p>
			{/if}
		</Alert>
	{/if}

	{#if form?.actionError}
		<Alert tone="critical" title={m.ui_action_failed()}>
			<p data-testid="form-error">{form.actionError}</p>
		</Alert>
	{/if}
	<ReminderFeedback reminder={form?.reminder} />

	<!-- Full width so every amount is visible; min-w-0: if still too wide it scrolls inside, not the page -->
	<div class="min-w-0">
		<Panel title={m.statements_cost_breakdown()}>
			<CostTable {statement} />
		</Panel>
	</div>
	<div class="grid gap-8 lg:grid-cols-3">
		<div class="flex min-w-0 flex-col gap-8 lg:col-span-2">
			<PaymentPanel {statement} />
			<ReminderHistory reminders={data.reminders} />
		</div>
		<div class="flex min-w-0 flex-col gap-8">
			<PartiesPanel {statement} />
			<Panel title={m.statements_more_actions()}>
				<div class="flex flex-col gap-4">
					<Button href="/statements/{statement.id}/edit" icon="edit" testid="statement-edit-button"
						>{m.statements_edit_button()}</Button
					>
					<!-- Only a draft can be deleted; once sent, the statement stays as the tenant received it -->
					{#if statement.status === 'draft'}
						<Button
							variant="danger-ghost"
							icon="delete"
							onclick={() => (showDelete = true)}
							testid="statement-delete-button">{m.statements_delete()}</Button
						>
					{/if}
				</div>
			</Panel>
			<MetadataCard
				createdAt={statement.createdAt}
				{pdfGeneratedAt}
				sentOn={statement.status === 'draft' ? null : statement.statementDate}
				paidOn={statement.paidDate}
				paymentResets={statement.paymentResets}
			/>
		</div>
	</div>
</div>

<FormDialog
	bind:open={showMarkPaid}
	action="?/markPaid"
	title={m.statements_mark_paid_title()}
	confirmLabel={m.statements_mark_paid()}
	confirmTestid="statement-mark-paid-confirm"
	fields={{ paidDate, statementDate: statement.statementDate }}
	check={checkPaidDate}
	success={m.statements_marked_paid()}
>
	{#if claimed(statement.balance)}<p>{m.statements_no_reminder_after()}</p>{/if}
	<DateInput
		id="paidDate"
		label={m.statements_paid_on()}
		help={paidHelp(statement.balance)}
		error={paidError}
		bind:value={paidDate}
		testid="paid-date-input"
	/>
	<p class="rounded-panel bg-sunken p-4 font-semibold text-ink">
		{statement.tenantName}: {balance}
	</p>
</FormDialog>

<FormDialog
	bind:open={showDelete}
	action="?/delete"
	title={m.statements_delete()}
	confirmLabel={m.statements_delete()}
	confirmTestid="statement-delete-confirm"
	danger
	ondone={() => addToast('success', m.statements_deleted({ number: statement.statementNumber }))}
>
	<p>
		{m.statements_delete_text({ number: statement.statementNumber, tenant: statement.tenantName })}
	</p>
</FormDialog>

<ResetPaymentDialog bind:open={showResetPayment} {statement} />

<SendDialog bind:open={showSend} {statement} />

<ReminderModal bind:open={showReminder} {statement} sentReminders={data.reminders.length} />
