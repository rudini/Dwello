<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { flushSync } from 'svelte';
	import { backendMessage } from '$lib/backend-error';
	import type { StatementDocument, StatementWithDetails } from '$lib/types';
	import { addToast } from '$lib/stores';
	import { laterText } from '$lib/overview';
	import {
		balanceLabel,
		earlyPaidDate,
		isPartPayment,
		openAmount,
		paidDateError,
		signedPaid,
		statementIcons,
		statusLabels,
		statusTones
	} from '$lib/statement';
	import { focusFirstError } from '$lib/ui/focus-error';
	import Alert from '$lib/ui/Alert.svelte';
	import Badge from '$lib/ui/Badge.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import { formatCurrency, formatDate } from '$lib/utils/format';
	import CostTable from './CostTable.svelte';
	import PaidDateFields from '../PaidDateFields.svelte';
	import Correction from './Correction.svelte';
	import FormDialog from './FormDialog.svelte';
	import { localToday } from '$lib/contract-status';
	import MetadataCard, { type Delivery } from './MetadataCard.svelte';
	import LaterChanges from './LaterChanges.svelte';
	import SplitKeysHint from '../SplitKeysHint.svelte';
	import NewPdfToSend from './NewPdfToSend.svelte';
	import type { SplitKeyHint } from '$lib/types';
	import type { ComponentProps } from 'svelte';
	import MoreActions from './MoreActions.svelte';
	import OldAddressWarning from './OldAddressWarning.svelte';
	import PartiesPanel from './PartiesPanel.svelte';
	import PaymentPanel from './PaymentPanel.svelte';
	import CarrySettleDialog from './CarrySettleDialog.svelte';
	import PdfAction from './PdfAction.svelte';
	import ReminderFeedback from './ReminderFeedback.svelte';
	import ReminderHistory from './ReminderHistory.svelte';
	import ReminderModal from './ReminderModal.svelte';
	import ResetPaymentDialog from './ResetPaymentDialog.svelte';
	import SendDialog from './SendDialog.svelte';
	import SendFeedback from './SendFeedback.svelte';
	import StatusActions from './StatusActions.svelte';
	import type { ActionData } from './$types';

	let {
		data,
		form
	}: {
		data: {
			statement: StatementWithDetails;
			reminders: StatementDocument[];
			delivery?: Delivery | null;
			pdfChange?: string | null;
			later?: ComponentProps<typeof LaterChanges>['later'] & { splitKeys: SplitKeyHint[] };
		};
		form: ActionData;
	} = $props();

	const statement = $derived(data.statement);
	let showMarkPaid = $state(false);
	let showReminder = $state(false);
	let showDelete = $state(false);
	let showSend = $state(false);
	let showRecalculate = $state(false);
	// a draft whose invoices or Tankbestand changed since it was created is not current (#454, #547), nor one that
	// would count another Übertrag now (#506 C)
	const later = $derived(data.later);
	const invoicesOutdated = $derived(
		statement.status === 'draft' && later && (later.invoices || later.fuelStock)
			? m.statements_send_outdated({ later: laterText(later.invoices, later.fuelStock) })
			: ''
	);
	// the backend says it of a draft only
	const outdated = $derived(
		[invoicesOutdated, later?.carryOver && m.statements_send_outdated_carry()]
			.filter(Boolean)
			.join(' ') || undefined
	);
	let sendByLetter = $state(false); // after a failed e-mail (#86)
	// without an e-mail address the letter is the only way, from the button on (#449, persona Helga P-2)
	const byEmail = $derived(statement.tenantCorrespondenceChannel === 'email' && !!statement.tenantEmail);
	const sendError = $derived(form?.sendError);
	let showResetPayment = $state(false);
	let showCarrySettle = $state(false);
	let showCorrect = $state(false);
	let generatingPdf = $state(false);
	let paidDate = $state(localToday());
	let paidError = $state('');
	// #448: a day before the Abrechnungsdatum is saved after the landlord confirmed that very day
	let earlyFor = $state('');
	const early = $derived(earlyPaidDate(paidDate, statement.statementDate));
	const asking = $derived(!!early && earlyFor === paidDate);
	let paidAmount = $state(''); // #959: prefilled with the open amount, less is a part payment
	const confirm = $derived(
		asking
			? { label: m.statements_save_anyway(), testid: 'statement-mark-paid-early-confirm' }
			: {
					label: isPartPayment(statement, paidAmount)
						? m.statements_record_part_payment()
						: m.statements_mark_paid(),
					testid: 'statement-mark-paid-confirm'
				}
	);

	// checked in the dialog before sending: a wrong date is said at the field, which gets the focus
	function checkPaidDate() {
		paidError = '';
		flushSync(); // cleared first: the same error set again shows again
		paidError = paidDateError(paidDate, statement.periodEnd) ?? '';
		if (paidError) focusFirstError(document.querySelector('[role="dialog"]'));
		if (paidError || !early || asking) return !paidError;
		earlyFor = paidDate;
		return false;
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
	// the backend's PdfChange, as the edit page passes it on; anything else shows nothing
	const pdfChanged: Record<string, (() => string) | undefined> = {
		notes: m.statements_sent_pdf_changed_notes,
		deadline: m.statements_sent_pdf_changed_deadline,
		refund_by: m.statements_sent_pdf_changed_refund_by
	};
	const pdfAdvice = $derived(
		data.pdfChange && Object.hasOwn(pdfChanged, data.pdfChange) ? pdfChanged[data.pdfChange] : undefined
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
				{byEmail}
				owes={statement.claimed}
				waiting={!!statement.reminderWaitsUntil}
				onremind={() => (showReminder = true)}
				onmarkpaid={() => (
					(paidDate = localToday()),
					(paidAmount = openAmount(statement).toFixed(2)),
					(paidError = ''),
					(earlyFor = ''),
					(showMarkPaid = true)
				)}
				onsend={() => ((sendByLetter = false), (showSend = true))}
				onresetpayment={() => (showResetPayment = true)}
			/>
		{/snippet}
	</PageHeader>

	<p class="flex flex-wrap items-center gap-2 text-ink">
		{m.statements_status_label()}
		<Badge
			tone={statusTones[statement.status]}
			icon={statementIcons[statement.status]}
			label={statusLabels[statement.status]}
			testid="statement-status"
		/>
	</p>

	<Correction {statement} bind:open={showCorrect} />
	<OldAddressWarning {statement} testid="statement-old-address" />

	<!-- a replaced statement is corrected by its berichtigte Abrechnung: no hint on it (#120) -->
	{#if data.later}
		<LaterChanges {statement} later={data.later} oncorrect={() => (showCorrect = true)} />
	{/if}

	<!-- after saving a change of a sent statement: what only the new PDF prints (#524, Fachreview 524-1 V-1, M-1) -->
	{#if pdfAdvice}
		<Alert tone="info" title={pdfAdvice()} testid="statement-pdf-changed">
			{#if data.delivery}<p>{m.statements_sent_pdf_in_history()}</p>
			{:else if statement.pdfBeforeChange?.length}<p>
					{m.statements_pdf_before_change_in_history()}
				</p>{/if}
		</Alert>
	{/if}
	{#if statement.newPdfToSend}
		<NewPdfToSend documentId={statement.newPdfToSend} refund={statement.refund} />
	{/if}
	{#if form?.actionError}
		<Alert tone="critical" title={m.ui_action_failed()}>
			<p data-testid="form-error">{form.actionError}</p>
		</Alert>
	{/if}
	<ReminderFeedback reminder={form?.reminder} />
	<SendFeedback
		error={sendError}
		onletter={() => ((sendByLetter = true), (showSend = true))}
	/>

	<!-- #528: on a draft, a Kategorie its lines bill by several Verteilschlüssel, as the table shows (not on one sent) -->
	{#if statement.editable && !statement.correctable}
		<SplitKeysHint
			splitKeys={statement.splitKeys ?? []}
			end={m.statements_split_keys_draft_end()}
			testid="statement-split-keys"
		/>
	{/if}

	<!-- Full width so every amount is visible; min-w-0: if still too wide it scrolls inside, not the page -->
	<div class="min-w-0">
		<Panel title={m.statements_cost_breakdown()} testid="statement-cost-breakdown">
			<CostTable {statement} />
		</Panel>
	</div>
	<div class="grid gap-8 lg:grid-cols-3">
		<div class="flex min-w-0 flex-col gap-8 lg:col-span-2">
			<PaymentPanel {statement} onsettle={() => (showCarrySettle = true)} />
			<ReminderHistory reminders={data.reminders} />
		</div>
		<div class="flex min-w-0 flex-col gap-8">
			<PartiesPanel {statement} />
			<MoreActions
				{statement}
				splitKeys={data.later?.splitKeys ?? []}
				bind:recalculating={showRecalculate}
				oncorrect={() => (showCorrect = true)}
				ondelete={() => (showDelete = true)}
			/>
			<!-- a draft's PDF is made anew on every request: its Verlauf claims none (#609) -->
			<MetadataCard
				createdAt={statement.createdAt}
				pdfGeneratedAt={statement.status === 'draft' ? null : pdfGeneratedAt}
				sentOn={statement.status === 'draft' ? null : statement.statementDate}
				delivery={data.delivery}
				resent={statement.resent}
				newPdfMadeAt={statement.newPdfMadeAt}
				pdfBeforeChange={statement.pdfBeforeChange}
				paidOn={statement.paidDate}
				paymentResets={statement.paymentResets}
				correctionDeclinedOn={statement.correctionDeclined?.on}
			/>
		</div>
	</div>
</div>

<FormDialog
	bind:open={showMarkPaid}
	action="?/markPaid"
	title={m.statements_mark_paid_title()}
	confirmLabel={confirm.label}
	confirmTestid={confirm.testid}
	fields={{
		paidDate,
		paidAmount: signedPaid(statement.balance, paidAmount),
		periodEnd: statement.periodEnd
	}}
	check={checkPaidDate}
	success={m.statements_marked_paid()}
>
	<PaidDateFields
		{statement}
		summary="{statement.tenantName}: {balanceLabel(statement.balance)} {formatCurrency(
			openAmount(statement)
		)}"
		bind:paidDate
		bind:paidAmount
		error={paidError}
		early={asking ? early : null}
	/>
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
<CarrySettleDialog bind:open={showCarrySettle} {statement} />

<SendDialog
	bind:open={showSend}
	{statement}
	byLetter={sendByLetter}
	{outdated}
	onrecalculate={() => ((showSend = false), (showRecalculate = true))}
/>

<ReminderModal bind:open={showReminder} {statement} sentReminders={statement.remindersCounted ?? 0} />
