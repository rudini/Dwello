<script lang="ts">
	import type { StatementDocument, StatementWithDetails } from '$lib/types';
	import ReminderModal from './ReminderModal.svelte';
	import ReminderHistory from './ReminderHistory.svelte';
	import ReminderFeedback from './ReminderFeedback.svelte';
	import { addToast } from '$lib/stores';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import FieldError from '$lib/components/FieldError.svelte';
	import { enhance } from '$app/forms';
	import { untrack } from 'svelte';
	import { formatCurrency, formatDate } from '$lib/utils/format';
	import { balanceClass, statusLabels, statusVariants } from '$lib/statement';
	import type { ActionData } from './$types';

	interface PageData {
		statement: StatementWithDetails;
		reminders: StatementDocument[];
	}

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let showMarkPaidModal = $state(false);
	let showSendReminderModal = $state(false);
	let showDeleteModal = $state(false);
	let isGeneratingPdf = $state(false);
	let pdfGeneratedAt = $state(untrack(() => data.statement.pdfGeneratedAt));

	function formatDateTime(dateString: string): string {
		return new Date(dateString).toLocaleString('de-CH');
	}

	function getBalanceLabel(balance: number): string {
		if (balance > 0) return 'Nachzahlung durch Mieter';
		if (balance < 0) return 'Rückerstattung an Mieter';
		return 'Ausgeglichen';
	}

	async function handleGeneratePdf() {
		isGeneratingPdf = true;
		try {
			const response = await fetch(`/api/statements/${data.statement.id}/generate-pdf`, {
				method: 'POST'
			});
			if (response.ok) {
				pdfGeneratedAt = new Date().toISOString();
				addToast('success', 'PDF wurde erfolgreich generiert');
			} else {
				const error = await response.json();
				console.error('PDF generation failed:', error);
				addToast(
					'error',
					'PDF-Generierung fehlgeschlagen: ' + (error.error || 'Unbekannter Fehler')
				);
			}
		} catch (error) {
			console.error('PDF generation error:', error);
			addToast('error', 'PDF-Generierung fehlgeschlagen');
		} finally {
			isGeneratingPdf = false;
		}
	}

	const subtotal = $derived(
		data.statement.lineItems.reduce((sum, item) => sum + item.tenantShare, 0)
	);
</script>

<svelte:head>
	<title>Abrechnung {data.statement.statementNumber} - Dwello</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
		<div class="flex items-start gap-4">
			<a
				href="/statements"
				data-testid="back-link"
				class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
			>
				<Icon name="arrow_back" size={20} />
			</a>
			<div>
				<div class="flex items-center gap-3 mb-1">
					<h1 class="text-2xl font-bold text-gray-900">{data.statement.statementNumber}</h1>
					<span data-testid="statement-status">
						<Badge variant={statusVariants[data.statement.status]}>
							{statusLabels[data.statement.status]}
						</Badge>
					</span>
				</div>
				<p class="text-gray-500">
					Periode: {formatDate(data.statement.periodStart)} - {formatDate(data.statement.periodEnd)}
				</p>
			</div>
		</div>
		<div class="flex flex-wrap items-center gap-2">
			{#if pdfGeneratedAt}
				<Button
					href="/statements/{data.statement.id}/pdf"
					variant="secondary"
					testid="statement-pdf-download"
				>
					<Icon name="picture_as_pdf" size={20} />
					PDF herunterladen
				</Button>
			{:else}
				<Button
					variant="secondary"
					onclick={handleGeneratePdf}
					disabled={isGeneratingPdf}
					testid="statement-generate-pdf-button"
				>
					<Icon name="picture_as_pdf" size={20} />
					{isGeneratingPdf ? 'Wird generiert...' : 'PDF generieren'}
				</Button>
			{/if}
			{#if data.statement.status === 'sent' || data.statement.status === 'overdue'}
				<Button
					variant="secondary"
					onclick={() => (showSendReminderModal = true)}
					testid="statement-reminder-button"
				>
					<Icon name="mail" size={20} />
					Mahnung senden
				</Button>
				<Button
					variant="primary"
					onclick={() => (showMarkPaidModal = true)}
					testid="statement-mark-paid-button"
				>
					<Icon name="paid" size={20} />
					Als bezahlt markieren
				</Button>
			{/if}
			{#if data.statement.status === 'draft'}
				<form method="POST" action="?/send" use:enhance>
					<Button type="submit" variant="primary" testid="statement-send-button">
						<Icon name="send" size={20} />
						Versenden
					</Button>
				</form>
			{/if}
		</div>
	</div>
	<FieldError message={form?.actionError} />
	<ReminderFeedback reminder={form?.reminder} />

	<div class="grid gap-6 lg:grid-cols-3">
		<!-- Main Content -->
		<div class="lg:col-span-2 space-y-6">
			<!-- Line Items -->
			<Card>
				<h2 class="text-lg font-semibold text-gray-900 mb-4">Kostenaufstellung</h2>
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead class="border-b border-gray-200">
							<tr>
								<th class="pb-3 text-left text-sm font-medium text-gray-500">Kategorie</th>
								<th class="pb-3 text-left text-sm font-medium text-gray-500">Verteilschlüssel</th>
								<th class="pb-3 text-right text-sm font-medium text-gray-500">Gesamtkosten</th>
								<th class="pb-3 text-right text-sm font-medium text-gray-500">Anteil</th>
								<th class="pb-3 text-right text-sm font-medium text-gray-500">Betrag</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-100">
							{#each data.statement.lineItems as item}
								<tr data-testid="statement-line-item">
									<td class="py-3 text-gray-900">{item.categoryName}</td>
									<td class="py-3 text-gray-500 text-sm">{item.distributionKeyName}</td>
									<td class="py-3 text-right text-gray-500">{formatCurrency(item.totalAmount)}</td>
									<td class="py-3 text-right text-gray-500">{item.percentage}%</td>
									<td class="py-3 text-right font-medium text-gray-900">
										{formatCurrency(item.tenantShare)}
									</td>
								</tr>
							{/each}
						</tbody>
						<tfoot class="border-t border-gray-200">
							<tr>
								<td colspan="4" class="pt-3 text-right font-medium text-gray-700">Zwischensumme</td>
								<td class="pt-3 text-right font-medium text-gray-900">{formatCurrency(subtotal)}</td
								>
							</tr>
							<tr>
								<td colspan="4" class="py-1 text-right text-sm text-gray-500">
									Verwaltungsgebühr ({data.statement.managementFeePercent}%)
								</td>
								<td class="py-1 text-right text-gray-700">
									{formatCurrency(data.statement.managementFee)}
								</td>
							</tr>
							<tr class="font-semibold">
								<td colspan="4" class="pt-2 text-right text-gray-900">Gesamtkosten</td>
								<td class="pt-2 text-right text-gray-900">
									{formatCurrency(data.statement.totalCosts)}
								</td>
							</tr>
							<tr>
								<td colspan="4" class="py-1 text-right text-gray-500">Akontozahlungen</td>
								<td class="py-1 text-right text-green-600">
									- {formatCurrency(data.statement.totalAdvancePayments)}
								</td>
							</tr>
							<tr class="font-bold text-lg">
								<td colspan="4" class="pt-3 text-right {balanceClass(data.statement.balance)}">
									{getBalanceLabel(data.statement.balance)}
								</td>
								<td class="pt-3 text-right {balanceClass(data.statement.balance)}">
									{formatCurrency(Math.abs(data.statement.balance))}
								</td>
							</tr>
						</tfoot>
					</table>
				</div>
			</Card>

			<ReminderHistory reminders={data.reminders} />

			<!-- Payment Info -->
			<Card>
				<h2 class="text-lg font-semibold text-gray-900 mb-4">Zahlungsinformationen</h2>
				<div class="grid gap-4 sm:grid-cols-2">
					<div>
						<p class="text-sm text-gray-500">Zahlungsfrist</p>
						<p class="font-medium text-gray-900" data-testid="statement-payment-deadline">
							{formatDate(data.statement.paymentDeadline)}
						</p>
					</div>
					{#if data.statement.paidDate}
						<div>
							<p class="text-sm text-gray-500">Bezahlt am</p>
							<p class="font-medium text-green-600" data-testid="statement-paid-date">
								{formatDate(data.statement.paidDate)}
							</p>
						</div>
					{/if}
					{#if data.statement.lastReminderDate}
						<div>
							<p class="text-sm text-gray-500">Letzte Mahnung</p>
							<p class="font-medium text-amber-600">
								{formatDate(data.statement.lastReminderDate)}
							</p>
						</div>
					{/if}
					<div>
						<p class="text-sm text-gray-500">Abrechnungsdatum</p>
						<p class="font-medium text-gray-900">{formatDate(data.statement.statementDate)}</p>
					</div>
				</div>
				{#if data.statement.notes}
					<div class="mt-4">
						<p class="text-sm text-gray-500">Bemerkungen</p>
						<p class="text-gray-900 whitespace-pre-line" data-testid="statement-notes">
							{data.statement.notes}
						</p>
					</div>
				{/if}
			</Card>
		</div>

		<!-- Sidebar -->
		<div class="space-y-6">
			<!-- Tenant Info -->
			<Card>
				<h2 class="text-lg font-semibold text-gray-900 mb-4">Mieter</h2>
				<div class="flex items-center gap-3 mb-4">
					<div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
						<span class="text-blue-600 font-semibold">
							{data.statement.tenantName
								.split(' ')
								.map((n) => n[0])
								.join('')}
						</span>
					</div>
					<div>
						<p class="font-medium text-gray-900">{data.statement.tenantName}</p>
						{#if data.statement.tenantEmail}
							<p class="text-sm text-gray-500">{data.statement.tenantEmail}</p>
						{/if}
					</div>
				</div>
				<Button
					href="/tenants/{data.statement.tenantId}"
					variant="secondary"
					class="w-full"
					testid="statement-tenant-link"
				>
					<Icon name="person" size={18} />
					Mieter anzeigen
				</Button>
			</Card>

			<!-- Apartment Info -->
			<Card>
				<h2 class="text-lg font-semibold text-gray-900 mb-4">Wohnung</h2>
				<div class="space-y-3">
					<div>
						<p class="text-sm text-gray-500">Gebäude</p>
						<p class="font-medium text-gray-900">{data.statement.buildingName}</p>
						<p class="text-sm text-gray-500">{data.statement.buildingAddress}</p>
					</div>
					<div>
						<p class="text-sm text-gray-500">Wohnung</p>
						<p class="font-medium text-gray-900">
							{data.statement.apartmentUnit} · {data.statement.apartmentFloor}
						</p>
					</div>
					<div>
						<p class="text-sm text-gray-500">Miettage im Zeitraum</p>
						<p class="font-medium text-gray-900">{data.statement.rentalDays} Tage</p>
					</div>
				</div>
				<div class="mt-4">
					<Button
						href="/apartments/{data.statement.apartmentId}"
						variant="secondary"
						class="w-full"
						testid="statement-apartment-link"
					>
						<Icon name="apartment" size={18} />
						Wohnung anzeigen
					</Button>
				</div>
			</Card>

			<!-- Actions -->
			<Card>
				<h2 class="text-lg font-semibold text-gray-900 mb-4">Aktionen</h2>
				<div class="space-y-2">
					<Button
						href="/statements/{data.statement.id}/edit"
						variant="secondary"
						class="w-full"
						testid="statement-edit-button"
					>
						<Icon name="edit" size={18} />
						Bearbeiten
					</Button>
					<Button
						variant="secondary"
						class="w-full text-red-600 hover:bg-red-50"
						onclick={() => (showDeleteModal = true)}
						testid="statement-delete-button"
					>
						<Icon name="delete" size={18} />
						Löschen
					</Button>
				</div>
			</Card>

			<!-- Metadata -->
			{#if data.statement.createdAt || pdfGeneratedAt}
				<Card>
					<h2 class="text-sm font-semibold text-gray-500 mb-3">Metadaten</h2>
					<div class="space-y-2 text-sm">
						{#if data.statement.createdAt}
							<div class="flex justify-between">
								<span class="text-gray-500">Erstellt</span>
								<span class="text-gray-700">{formatDateTime(data.statement.createdAt)}</span>
							</div>
						{/if}
						{#if pdfGeneratedAt}
							<div class="flex justify-between">
								<span class="text-gray-500">PDF generiert</span>
								<span class="text-gray-700">{formatDateTime(pdfGeneratedAt)}</span>
							</div>
						{/if}
					</div>
				</Card>
			{/if}
		</div>
	</div>
</div>

<!-- Mark as Paid Modal -->
<Modal
	open={showMarkPaidModal}
	title="Als bezahlt markieren"
	onclose={() => (showMarkPaidModal = false)}
>
	<p class="text-gray-600 mb-4">
		Möchten Sie diese Abrechnung als bezahlt markieren? Das heutige Datum wird als Zahlungsdatum
		eingetragen.
	</p>
	<div class="p-3 bg-gray-50 rounded-lg mb-4">
		<p class="font-medium text-gray-900">{data.statement.statementNumber}</p>
		<p class="text-sm text-gray-500">{data.statement.tenantName}</p>
		<p class="text-lg font-bold {balanceClass(data.statement.balance)} mt-2">
			{formatCurrency(Math.abs(data.statement.balance))}
		</p>
	</div>
	<form
		method="POST"
		action="?/markPaid"
		use:enhance={() =>
			async ({ update }) => {
				await update();
				showMarkPaidModal = false;
			}}
		class="flex justify-end gap-3"
	>
		<Button variant="secondary" onclick={() => (showMarkPaidModal = false)}>Abbrechen</Button>
		<Button type="submit" variant="primary" testid="statement-mark-paid-confirm">
			<Icon name="check" size={20} />
			Als bezahlt markieren
		</Button>
	</form>
</Modal>

<ReminderModal
	bind:open={showSendReminderModal}
	statement={data.statement}
	sentReminders={data.reminders.length}
/>

<!-- Delete Modal -->
<Modal open={showDeleteModal} title="Abrechnung löschen" onclose={() => (showDeleteModal = false)}>
	<p class="text-gray-600 mb-4">
		Möchten Sie diese Abrechnung wirklich löschen? Diese Aktion kann nicht rückgängig gemacht
		werden.
	</p>
	<div class="p-3 bg-gray-50 rounded-lg mb-4">
		<p class="font-medium text-gray-900">{data.statement.statementNumber}</p>
		<p class="text-sm text-gray-500">
			{data.statement.tenantName} · {data.statement.buildingName}
		</p>
	</div>
	<form
		method="POST"
		action="?/delete"
		use:enhance={() =>
			async ({ update }) => {
				await update();
				showDeleteModal = false;
			}}
		class="flex justify-end gap-3"
	>
		<Button variant="secondary" onclick={() => (showDeleteModal = false)}>Abbrechen</Button>
		<Button type="submit" variant="danger" testid="statement-delete-confirm">
			<Icon name="delete" size={20} />
			Löschen
		</Button>
	</form>
</Modal>
