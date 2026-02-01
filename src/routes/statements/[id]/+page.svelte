<script lang="ts">
	import type { StatementWithDetails, StatementStatus } from '$lib/types';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import Modal from '$lib/components/Modal.svelte';

	interface PageData {
		statement: StatementWithDetails;
	}

	let { data }: { data: PageData } = $props();

	let showMarkPaidModal = $state(false);
	let showSendReminderModal = $state(false);
	let showDeleteModal = $state(false);
	let isProcessing = $state(false);
	let isGeneratingPdf = $state(false);
	let pdfGeneratedAt = $state(data.statement.pdfGeneratedAt);

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('de-CH', {
			style: 'currency',
			currency: 'CHF'
		}).format(amount);
	}

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('de-CH');
	}

	function formatDateTime(dateString: string): string {
		return new Date(dateString).toLocaleString('de-CH');
	}

	function getStatusVariant(
		status: StatementStatus
	): 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' {
		switch (status) {
			case 'draft':
				return 'default';
			case 'sent':
				return 'info';
			case 'paid':
				return 'success';
			case 'overdue':
				return 'danger';
			default:
				return 'default';
		}
	}

	function getStatusLabel(status: StatementStatus): string {
		switch (status) {
			case 'draft':
				return 'Entwurf';
			case 'sent':
				return 'Versendet';
			case 'paid':
				return 'Bezahlt';
			case 'overdue':
				return 'Überfällig';
			default:
				return status;
		}
	}

	function getBalanceClass(balance: number): string {
		if (balance > 0) return 'text-red-600';
		if (balance < 0) return 'text-green-600';
		return 'text-gray-600';
	}

	function getBalanceLabel(balance: number): string {
		if (balance > 0) return 'Nachzahlung durch Mieter';
		if (balance < 0) return 'Rückerstattung an Mieter';
		return 'Ausgeglichen';
	}

	async function handleMarkPaid() {
		isProcessing = true;
		await new Promise((resolve) => setTimeout(resolve, 1000));
		console.log('Marking as paid:', data.statement.id);
		showMarkPaidModal = false;
		isProcessing = false;
	}

	async function handleSendReminder() {
		isProcessing = true;
		await new Promise((resolve) => setTimeout(resolve, 1000));
		console.log('Sending reminder:', data.statement.id);
		showSendReminderModal = false;
		isProcessing = false;
	}

	async function handleDelete() {
		isProcessing = true;
		await new Promise((resolve) => setTimeout(resolve, 1000));
		console.log('Deleting:', data.statement.id);
		showDeleteModal = false;
		isProcessing = false;
	}

	async function handleGeneratePdf() {
		isGeneratingPdf = true;
		try {
			const response = await fetch(`/api/statements/${data.statement.id}/generate-pdf`, {
				method: 'POST'
			});
			if (response.ok) {
				pdfGeneratedAt = new Date().toISOString();
			} else {
				const error = await response.json();
				console.error('PDF generation failed:', error);
				alert('PDF-Generierung fehlgeschlagen: ' + (error.error || 'Unbekannter Fehler'));
			}
		} catch (error) {
			console.error('PDF generation error:', error);
			alert('PDF-Generierung fehlgeschlagen');
		} finally {
			isGeneratingPdf = false;
		}
	}

	const subtotal = $derived(data.statement.lineItems.reduce((sum, item) => sum + item.tenantShare, 0));
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
				class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
			>
				<Icon name="arrow_back" size={20} />
			</a>
			<div>
				<div class="flex items-center gap-3 mb-1">
					<h1 class="text-2xl font-bold text-gray-900">{data.statement.statementNumber}</h1>
					<Badge variant={getStatusVariant(data.statement.status)}>
						{getStatusLabel(data.statement.status)}
					</Badge>
				</div>
				<p class="text-gray-500">
					Periode: {formatDate(data.statement.periodStart)} - {formatDate(data.statement.periodEnd)}
				</p>
			</div>
		</div>
		<div class="flex flex-wrap items-center gap-2">
			{#if pdfGeneratedAt}
				<Button href="/statements/{data.statement.id}/pdf" variant="secondary">
					<Icon name="picture_as_pdf" size={20} />
					PDF herunterladen
				</Button>
			{:else}
				<Button variant="secondary" onclick={handleGeneratePdf} disabled={isGeneratingPdf}>
					<Icon name="picture_as_pdf" size={20} />
					{isGeneratingPdf ? 'Wird generiert...' : 'PDF generieren'}
				</Button>
			{/if}
			{#if data.statement.status === 'sent' || data.statement.status === 'overdue'}
				<Button variant="secondary" onclick={() => (showSendReminderModal = true)}>
					<Icon name="mail" size={20} />
					Mahnung senden
				</Button>
				<Button variant="primary" onclick={() => (showMarkPaidModal = true)}>
					<Icon name="paid" size={20} />
					Als bezahlt markieren
				</Button>
			{/if}
			{#if data.statement.status === 'draft'}
				<Button variant="primary">
					<Icon name="send" size={20} />
					Versenden
				</Button>
			{/if}
		</div>
	</div>

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
								<tr>
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
								<td class="pt-3 text-right font-medium text-gray-900">{formatCurrency(subtotal)}</td>
							</tr>
							<tr>
								<td colspan="4" class="py-1 text-right text-sm text-gray-500">
									Verwaltungsgebühr (3%)
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
								<td colspan="4" class="pt-3 text-right {getBalanceClass(data.statement.balance)}">
									{getBalanceLabel(data.statement.balance)}
								</td>
								<td class="pt-3 text-right {getBalanceClass(data.statement.balance)}">
									{formatCurrency(Math.abs(data.statement.balance))}
								</td>
							</tr>
						</tfoot>
					</table>
				</div>
			</Card>

			<!-- Payment Info -->
			<Card>
				<h2 class="text-lg font-semibold text-gray-900 mb-4">Zahlungsinformationen</h2>
				<div class="grid gap-4 sm:grid-cols-2">
					<div>
						<p class="text-sm text-gray-500">Zahlungsfrist</p>
						<p class="font-medium text-gray-900">{formatDate(data.statement.paymentDeadline)}</p>
					</div>
					{#if data.statement.paidDate}
						<div>
							<p class="text-sm text-gray-500">Bezahlt am</p>
							<p class="font-medium text-green-600">{formatDate(data.statement.paidDate)}</p>
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
				<Button href="/tenants/{data.statement.tenantId}" variant="secondary" class="w-full">
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
					<Button href="/statements/{data.statement.id}/edit" variant="secondary" class="w-full">
						<Icon name="edit" size={18} />
						Bearbeiten
					</Button>
					<Button
						variant="secondary"
						class="w-full text-red-600 hover:bg-red-50"
						onclick={() => (showDeleteModal = true)}
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
<Modal open={showMarkPaidModal} title="Als bezahlt markieren" onclose={() => (showMarkPaidModal = false)}>
	<p class="text-gray-600 mb-4">
		Möchten Sie diese Abrechnung als bezahlt markieren? Das heutige Datum wird als Zahlungsdatum
		eingetragen.
	</p>
	<div class="p-3 bg-gray-50 rounded-lg mb-4">
		<p class="font-medium text-gray-900">{data.statement.statementNumber}</p>
		<p class="text-sm text-gray-500">{data.statement.tenantName}</p>
		<p class="text-lg font-bold {getBalanceClass(data.statement.balance)} mt-2">
			{formatCurrency(Math.abs(data.statement.balance))}
		</p>
	</div>
	<div class="flex justify-end gap-3">
		<Button variant="secondary" onclick={() => (showMarkPaidModal = false)}>Abbrechen</Button>
		<Button variant="primary" onclick={handleMarkPaid} disabled={isProcessing}>
			{#if isProcessing}
				<Icon name="progress_activity" size={20} class="animate-spin" />
				Wird verarbeitet...
			{:else}
				<Icon name="check" size={20} />
				Als bezahlt markieren
			{/if}
		</Button>
	</div>
</Modal>

<!-- Send Reminder Modal -->
<Modal open={showSendReminderModal} title="Mahnung senden" onclose={() => (showSendReminderModal = false)}>
	<p class="text-gray-600 mb-4">
		Möchten Sie eine Zahlungserinnerung an den Mieter senden?
	</p>
	<div class="p-3 bg-gray-50 rounded-lg mb-4">
		<p class="font-medium text-gray-900">{data.statement.tenantName}</p>
		{#if data.statement.tenantEmail}
			<p class="text-sm text-gray-500">{data.statement.tenantEmail}</p>
		{/if}
		<p class="text-lg font-bold text-red-600 mt-2">
			Offen: {formatCurrency(Math.abs(data.statement.balance))}
		</p>
	</div>
	{#if data.statement.lastReminderDate}
		<div class="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4 flex items-start gap-2">
			<Icon name="warning" size={18} class="text-amber-500 flex-shrink-0 mt-0.5" />
			<p class="text-sm text-amber-700">
				Letzte Mahnung wurde am {formatDate(data.statement.lastReminderDate)} gesendet.
			</p>
		</div>
	{/if}
	<div class="flex justify-end gap-3">
		<Button variant="secondary" onclick={() => (showSendReminderModal = false)}>Abbrechen</Button>
		<Button variant="primary" onclick={handleSendReminder} disabled={isProcessing}>
			{#if isProcessing}
				<Icon name="progress_activity" size={20} class="animate-spin" />
				Wird gesendet...
			{:else}
				<Icon name="send" size={20} />
				Mahnung senden
			{/if}
		</Button>
	</div>
</Modal>

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
	<div class="flex justify-end gap-3">
		<Button variant="secondary" onclick={() => (showDeleteModal = false)}>Abbrechen</Button>
		<Button
			variant="primary"
			onclick={handleDelete}
			disabled={isProcessing}
			class="bg-red-600 hover:bg-red-700"
		>
			{#if isProcessing}
				<Icon name="progress_activity" size={20} class="animate-spin" />
				Wird gelöscht...
			{:else}
				<Icon name="delete" size={20} />
				Löschen
			{/if}
		</Button>
	</div>
</Modal>
