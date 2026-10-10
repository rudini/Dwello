<script lang="ts">
	import { untrack } from 'svelte';
	import type { StatementDocument, StatementWithDetails } from '$lib/types';
	import { addToast } from '$lib/stores';
	import { balanceLabel, statusLabels, statusTones } from '$lib/statement';
	import Alert from '$lib/ui/Alert.svelte';
	import Badge from '$lib/ui/Badge.svelte';
	import Button from '$lib/ui/Button.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import { formatCurrency, formatDate } from '$lib/utils/format';
	import CostTable from './CostTable.svelte';
	import FormDialog from './FormDialog.svelte';
	import MetadataCard from './MetadataCard.svelte';
	import PartiesPanel from './PartiesPanel.svelte';
	import PaymentPanel from './PaymentPanel.svelte';
	import PdfAction from './PdfAction.svelte';
	import ReminderFeedback from './ReminderFeedback.svelte';
	import ReminderHistory from './ReminderHistory.svelte';
	import ReminderModal from './ReminderModal.svelte';
	import SendDialog from './SendDialog.svelte';
	import StatusActions from './StatusActions.svelte';
	import type { ActionData } from './$types';

	let {
		data,
		form
	}: {
		data: { statement: StatementWithDetails; reminders: StatementDocument[] };
		form: ActionData;
	} = $props();

	const statement = $derived(data.statement);
	let showMarkPaid = $state(false);
	let showReminder = $state(false);
	let showDelete = $state(false);
	let showSend = $state(false);
	let generatingPdf = $state(false);
	let pdfGeneratedAt = $state(untrack(() => data.statement.pdfGeneratedAt));

	async function generatePdf() {
		generatingPdf = true;
		try {
			const response = await fetch(`/api/statements/${statement.id}/generate-pdf`, {
				method: 'POST'
			});
			if (response.ok) {
				pdfGeneratedAt = new Date().toISOString();
				addToast('success', 'PDF erstellt');
			} else {
				const error = await response.json();
				addToast(
					'error',
					`PDF konnte nicht erstellt werden: ${error.error || 'unbekannter Fehler'}`
				);
			}
		} catch {
			addToast('error', 'PDF konnte nicht erstellt werden. Versuchen Sie es erneut.');
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
	<title>Abrechnung {statement.statementNumber} - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8">
	<PageHeader
		title="Abrechnung {statement.statementNumber}"
		purpose="{statement.tenantName}, {statement.buildingName}, Wohnung {statement.apartmentUnit} · Abrechnungsperiode {period}"
		trail={[{ href: '/statements', label: 'Nebenkostenabrechnungen' }]}
	>
		{#snippet action()}
			<PdfAction
				id={statement.id}
				generated={!!pdfGeneratedAt}
				generating={generatingPdf}
				ongenerate={generatePdf}
			/>
			<StatusActions
				status={statement.status}
				onremind={() => (showReminder = true)}
				onmarkpaid={() => (showMarkPaid = true)}
				onsend={() => (showSend = true)}
			/>
		{/snippet}
	</PageHeader>

	<p class="flex flex-wrap items-center gap-2 text-ink">
		Status:
		<Badge
			tone={statusTones[statement.status]}
			label={statusLabels[statement.status]}
			testid="statement-status"
		/>
	</p>

	{#if form?.actionError}
		<Alert tone="critical" title="Das hat nicht geklappt">
			<p data-testid="form-error">{form.actionError}</p>
		</Alert>
	{/if}
	<ReminderFeedback reminder={form?.reminder} />

	<!-- min-w-0: a wide cost table scrolls inside its box instead of widening the page -->
	<div class="grid gap-8 lg:grid-cols-3">
		<div class="flex min-w-0 flex-col gap-8 lg:col-span-2">
			<Panel title="Kostenaufstellung">
				<CostTable {statement} />
			</Panel>
			<PaymentPanel {statement} />
			<ReminderHistory reminders={data.reminders} />
		</div>
		<div class="flex min-w-0 flex-col gap-8">
			<PartiesPanel {statement} />
			<Panel title="Weitere Aktionen">
				<div class="flex flex-col gap-4">
					<Button href="/statements/{statement.id}/edit" icon="edit" testid="statement-edit-button"
						>Frist und Bemerkungen bearbeiten</Button
					>
					<!-- Only a draft can be deleted; once sent, the statement stays as the tenant received it -->
					{#if statement.status === 'draft'}
						<Button
							variant="danger-ghost"
							icon="delete"
							onclick={() => (showDelete = true)}
							testid="statement-delete-button">Abrechnung löschen</Button
						>
					{/if}
				</div>
			</Panel>
			<MetadataCard createdAt={statement.createdAt} {pdfGeneratedAt} />
		</div>
	</div>
</div>

<FormDialog
	bind:open={showMarkPaid}
	action="?/markPaid"
	title="Abrechnung als bezahlt markieren"
	confirmLabel="Als bezahlt markieren"
	confirmTestid="statement-mark-paid-confirm"
>
	<p>
		Das heutige Datum wird als Zahlungsdatum eingetragen. Danach können Sie keine Mahnung mehr
		senden.
	</p>
	<p class="rounded-panel bg-sunken p-4 font-semibold text-ink">
		{statement.tenantName}: {balance}
	</p>
</FormDialog>

<FormDialog
	bind:open={showDelete}
	action="?/delete"
	title="Abrechnung löschen"
	confirmLabel="Abrechnung löschen"
	confirmTestid="statement-delete-confirm"
	danger
>
	<p>
		Die Abrechnung {statement.statementNumber} von {statement.tenantName} wird gelöscht. Das lässt sich
		nicht rückgängig machen.
	</p>
</FormDialog>

<SendDialog bind:open={showSend} {statement} />

<ReminderModal bind:open={showReminder} {statement} sentReminders={data.reminders.length} />
