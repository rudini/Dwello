<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { api } from '$lib/api';
	import type { InvoiceWithDetails } from '$lib/types';
	import { formatCurrency, formatDate } from '$lib/utils/format';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import PageTrail from '$lib/components/PageTrail.svelte';

	let { data }: { data: { invoice: InvoiceWithDetails } } = $props();

	let showDeleteModal = $state(false);
	let isDeleting = $state(false);
	let deleteError = $state('');
	let isRecategorizing = $state(false);
	let recategorizeError = $state('');

	function formatDateTime(dateString: string): string {
		return new Date(dateString).toLocaleString('de-CH');
	}

	async function handleDelete() {
		isDeleting = true;
		deleteError = '';
		const result = await api.delete(`/invoices/${data.invoice.id}`);
		if (result.error) {
			deleteError = result.error.message;
			isDeleting = false;
			return;
		}
		goto('/invoices');
	}

	async function handleRecategorize() {
		isRecategorizing = true;
		recategorizeError = '';
		const result = await api.post(`/invoices/${data.invoice.id}/recategorize`);
		if (result.error) {
			recategorizeError = result.error.message;
			isRecategorizing = false;
			return;
		}
		await invalidateAll();
		isRecategorizing = false;
	}
</script>

<svelte:head>
	<title>{data.invoice.billingEntity} - Rechnung - Dwello</title>
</svelte:head>

<div class="space-y-6">
	<PageTrail links={[{ href: '/invoices', label: 'Rechnungen' }]} current={data.invoice.billingEntity} />

	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
		<div class="flex items-start gap-4">
			<div>
				<div class="flex items-center gap-3 mb-2">
					<h1 class="text-2xl font-bold text-gray-900">{data.invoice.billingEntity}</h1>
					{#if data.invoice.categorizationStatus === 'auto-categorized'}
						<Badge variant="success">Automatisch kategorisiert</Badge>
					{:else if data.invoice.categorizationStatus === 'manual'}
						<Badge variant="info">Manuell kategorisiert</Badge>
					{:else}
						<Badge variant="warning">Kategorisierung ausstehend</Badge>
					{/if}
				</div>
				<p class="text-gray-500">{data.invoice.description}</p>
			</div>
		</div>
		<div class="flex items-center gap-2">
			<Button
				variant="secondary"
				onclick={handleRecategorize}
				disabled={isRecategorizing}
				testid="invoice-recategorize-button"
			>
				{#if isRecategorizing}
					<Icon name="progress_activity" size={20} class="animate-spin" />
				{:else}
					<Icon name="auto_awesome" size={20} />
				{/if}
				Neu kategorisieren
			</Button>
			<Button href="/invoices/{data.invoice.id}/edit" variant="secondary" testid="invoice-edit-button">
				<Icon name="edit" size={20} />
				Bearbeiten
			</Button>
			<Button variant="secondary" onclick={() => showDeleteModal = true} testid="invoice-delete-button">
				<Icon name="delete" size={20} />
				Löschen
			</Button>
		</div>
	</div>

	{#if recategorizeError}
		<div data-testid="invoice-recategorize-error" class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
			Kategorisierung fehlgeschlagen: {recategorizeError}
		</div>
	{/if}

	<div class="grid gap-6 lg:grid-cols-3">
		<!-- Main Info -->
		<div class="lg:col-span-2 space-y-6">
			<!-- Invoice Details -->
			<Card>
				<h2 class="text-lg font-semibold text-gray-900 mb-4">Rechnungsdetails</h2>
				<dl class="grid gap-4 sm:grid-cols-2">
					<div>
						<dt class="text-sm font-medium text-gray-500">Rechnungsdatum</dt>
						<dd class="mt-1 text-gray-900">{formatDate(data.invoice.invoiceDate)}</dd>
					</div>
					<div>
						<dt class="text-sm font-medium text-gray-500">Betrag</dt>
						<dd class="mt-1 text-xl font-semibold text-gray-900" data-testid="invoice-amount">{formatCurrency(data.invoice.amount)}</dd>
					</div>
					<div class="sm:col-span-2">
						<dt class="text-sm font-medium text-gray-500">Gebäude</dt>
						<dd class="mt-1">
							<a href="/buildings/{data.invoice.buildingId}" class="text-blue-600 hover:text-blue-700" data-testid="invoice-building-link">
								{data.invoice.buildingName}
							</a>
							<p class="text-sm text-gray-500">{data.invoice.buildingAddress}</p>
						</dd>
					</div>
					<div class="sm:col-span-2">
						<dt class="text-sm font-medium text-gray-500">Beschreibung</dt>
						<dd class="mt-1 text-gray-900">{data.invoice.description}</dd>
					</div>
				</dl>
			</Card>

			<!-- Categorization -->
			<Card>
				<h2 class="text-lg font-semibold text-gray-900 mb-4">Kategorisierung</h2>
				<dl class="grid gap-4 sm:grid-cols-2">
					<div>
						<dt class="text-sm font-medium text-gray-500">Kategorie</dt>
						<dd class="mt-1">
							{#if data.invoice.category}
								<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800" data-testid="invoice-category">
									{data.invoice.category.name}
								</span>
							{:else}
								<span class="text-gray-400">Nicht kategorisiert</span>
							{/if}
						</dd>
					</div>
					<div>
						<dt class="text-sm font-medium text-gray-500">Verteilschlüssel</dt>
						<dd class="mt-1">
							{#if data.invoice.distributionKey}
								<span class="text-gray-900" data-testid="invoice-distribution-key">{data.invoice.distributionKey.name}</span>
							{:else}
								<span class="text-gray-400">Nicht zugewiesen</span>
							{/if}
						</dd>
					</div>
					<div>
						<dt class="text-sm font-medium text-gray-500">Umlagefähigkeit</dt>
						<dd class="mt-1" data-testid="invoice-utility-cost">
							{#if data.invoice.isValidUtilityCost}
								<Badge variant="success">Umlagefähig</Badge>
							{:else}
								<Badge variant="danger">Nicht umlagefähig</Badge>
							{/if}
						</dd>
					</div>
				</dl>

				{#if data.invoice.llmConfidence}
					<div class="mt-6 p-4 bg-gray-50 rounded-lg">
						<h3 class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
							<Icon name="auto_awesome" size={16} class="text-blue-500" />
							KI-Kategorisierung
						</h3>
						<div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
							<span>Konfidenz:</span>
							<div class="flex-1 max-w-xs bg-gray-200 rounded-full h-2">
								<div
									class="bg-blue-500 h-2 rounded-full"
									style="width: {data.invoice.llmConfidence * 100}%"
								></div>
							</div>
							<span class="font-medium">{Math.round(data.invoice.llmConfidence * 100)}%</span>
						</div>
						{#if data.invoice.llmReasoning}
							<p class="text-sm text-gray-500">
								<Icon name="lightbulb" size={14} class="inline mr-1" />
								{data.invoice.llmReasoning}
							</p>
						{/if}
					</div>
				{/if}

				{#if data.invoice.manualOverrideBy || data.invoice.manualOverrideReason}
					<div class="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
						<h3 class="text-sm font-medium text-amber-800 mb-1 flex items-center gap-2">
							<Icon name="edit_note" size={16} />
							Manuell überschrieben
						</h3>
						{#if data.invoice.manualOverrideReason}
							<p data-testid="invoice-override-reason" class="text-sm text-amber-700">{data.invoice.manualOverrideReason}</p>
						{/if}
						{#if data.invoice.manualOverrideBy}
							<p class="text-xs text-amber-600 mt-1">von {data.invoice.manualOverrideBy}</p>
						{/if}
					</div>
				{/if}
			</Card>
		</div>

		<!-- Sidebar -->
		<div class="space-y-6">
			<!-- Quick Actions -->
			<Card>
				<h2 class="text-lg font-semibold text-gray-900 mb-4">Aktionen</h2>
				<div class="space-y-2">
					<Button href="/invoices/{data.invoice.id}/edit" variant="secondary" class="w-full justify-start">
						<Icon name="edit" size={18} />
						Bearbeiten
					</Button>
					<Button
						variant="secondary"
						class="w-full justify-start"
						onclick={handleRecategorize}
						disabled={isRecategorizing}
					>
						{#if isRecategorizing}
							<Icon name="progress_activity" size={18} class="animate-spin" />
						{:else}
							<Icon name="auto_awesome" size={18} />
						{/if}
						Neu kategorisieren
					</Button>
					<Button
						variant="secondary"
						class="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
						onclick={() => showDeleteModal = true}
					>
						<Icon name="delete" size={18} />
						Löschen
					</Button>
				</div>
			</Card>

			<!-- Metadata -->
			<Card>
				<h2 class="text-lg font-semibold text-gray-900 mb-4">Metadaten</h2>
				<dl class="space-y-3 text-sm">
					<div>
						<dt class="text-gray-500">Erstellt</dt>
						<dd class="text-gray-900">
							{data.invoice.createdAt ? formatDateTime(data.invoice.createdAt) : '-'}
						</dd>
					</div>
					<div>
						<dt class="text-gray-500">Zuletzt geändert</dt>
						<dd class="text-gray-900">
							{data.invoice.updatedAt ? formatDateTime(data.invoice.updatedAt) : '-'}
						</dd>
					</div>
					<div>
						<dt class="text-gray-500">ID</dt>
						<dd class="text-gray-900 font-mono text-xs">{data.invoice.id}</dd>
					</div>
				</dl>
			</Card>

			<!-- Swiss Law Info -->
			{#if !data.invoice.isValidUtilityCost}
				<Card>
					<div class="flex items-start gap-3" data-testid="invoice-legal-note">
						<Icon name="gavel" size={20} class="text-amber-500 flex-shrink-0 mt-0.5" />
						<div>
							<h3 class="font-medium text-gray-900 mb-1">Schweizer Mietrecht</h3>
							<p class="text-sm text-gray-600">
								Diese Kosten sind gemäss Art. 257a-257b OR nicht auf Mieter umlegbar.
								Typische nicht umlagefähige Kosten: Reparaturen, Versicherungen, Steuern, Hypothekenzinsen.
							</p>
						</div>
					</div>
				</Card>
			{/if}
		</div>
	</div>
</div>

<!-- Delete Modal -->
<Modal
	open={showDeleteModal}
	title="Rechnung löschen"
	onclose={() => showDeleteModal = false}
>
	<p class="text-gray-600 mb-4">
		Möchten Sie diese Rechnung wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
	</p>
	<div class="p-3 bg-gray-50 rounded-lg mb-4">
		<p class="font-medium text-gray-900">{data.invoice.billingEntity}</p>
		<p class="text-sm text-gray-500">{data.invoice.description}</p>
		<p class="text-sm font-medium text-gray-900 mt-1">{formatCurrency(data.invoice.amount)}</p>
	</div>
	{#if deleteError}
		<div class="p-3 bg-red-50 border border-red-200 rounded-lg mb-4 text-sm text-red-700">
			{deleteError}
		</div>
	{/if}
	<div class="flex justify-end gap-3">
		<Button variant="secondary" onclick={() => showDeleteModal = false} testid="invoice-delete-cancel">
			Abbrechen
		</Button>
		<Button
			variant="primary"
			onclick={handleDelete}
			disabled={isDeleting}
			class="bg-red-600 hover:bg-red-700"
			testid="invoice-delete-confirm"
		>
			{#if isDeleting}
				<Icon name="progress_activity" size={20} class="animate-spin" />
				Wird gelöscht...
			{:else}
				<Icon name="delete" size={20} />
				Löschen
			{/if}
		</Button>
	</div>
</Modal>
