<script lang="ts">
	import { goto } from '$app/navigation';
	import { api } from '$lib/api';
	import type { InvoiceWithDetails, Category } from '$lib/types';
	import type { DistributionKeyRow } from '$lib/distribution-key';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';
	import OriginalSuggestion from '$lib/components/OriginalSuggestion.svelte';
	import InvoiceFormActions from '$lib/components/InvoiceFormActions.svelte';
	import FieldError from '$lib/components/FieldError.svelte';
	import InvoiceCategoryFields from '$lib/components/InvoiceCategoryFields.svelte';
	import InvoiceDataFields from '$lib/components/InvoiceDataFields.svelte';
	import PageTrail from '$lib/components/PageTrail.svelte';

	interface PageData {
		invoice: InvoiceWithDetails;
		buildings: { id: string; name: string; address: string }[];
		categories: Category[];
		distributionKeys: DistributionKeyRow[];
	}

	let { data }: { data: PageData } = $props();

	// Extract initial values for form (intentionally non-reactive - user edits these)
	// svelte-ignore state_referenced_locally
	const initial = data.invoice;
	const initialBuildingId = initial.buildingId;
	const initialInvoiceDate = initial.invoiceDate;
	const initialBillingEntity = initial.billingEntity;
	const initialDescription = initial.description;
	const initialAmount = initial.amount.toString();
	const initialCategoryId = initial.categoryId || '';
	const initialDistributionKeyId = initial.distributionKeyId || '';
	const initialIsValidUtilityCost = initial.isValidUtilityCost;
	const hasLlmConfidence = !!initial.llmConfidence;

	// Form state - initialized from captured values
	let buildingId = $state(initialBuildingId);
	let invoiceDate = $state(initialInvoiceDate);
	let billingEntity = $state(initialBillingEntity);
	let description = $state(initialDescription);
	let amount = $state(initialAmount);
	let categoryId = $state(initialCategoryId);
	let distributionKeyId = $state(initialDistributionKeyId);
	let isValidUtilityCost = $state(initialIsValidUtilityCost);
	let overrideReason = $state('');

	// Form validation
	let errors = $state<Record<string, string>>({});
	let isSubmitting = $state(false);
	let submitError = $state('');

	// Derived values
	// Overriding the KI's category needs a reason
	const needsReason = $derived(categoryId !== initialCategoryId && hasLlmConfidence);
	const hasChanges = $derived.by(() => {
		return (
			buildingId !== initialBuildingId ||
			invoiceDate !== initialInvoiceDate ||
			billingEntity !== initialBillingEntity ||
			description !== initialDescription ||
			amount !== initialAmount ||
			categoryId !== initialCategoryId ||
			distributionKeyId !== initialDistributionKeyId ||
			isValidUtilityCost !== initialIsValidUtilityCost
		);
	});

	function validate(): boolean {
		const newErrors: Record<string, string> = {};

		if (!buildingId) newErrors.buildingId = 'Bitte wählen Sie ein Gebäude';
		if (!invoiceDate) newErrors.invoiceDate = 'Bitte geben Sie ein Datum ein';
		if (!billingEntity.trim()) newErrors.billingEntity = 'Bitte geben Sie einen Lieferanten ein';
		if (!description.trim()) newErrors.description = 'Bitte geben Sie eine Beschreibung ein';
		if (!amount || parseFloat(amount) <= 0)
			newErrors.amount = 'Bitte geben Sie einen gültigen Betrag ein';

		// If category changed from LLM suggestion, require reason
		if (needsReason && !overrideReason.trim()) {
			newErrors.overrideReason = 'Bitte geben Sie einen Grund für die Änderung an';
		}

		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (!validate()) return;

		isSubmitting = true;
		submitError = '';

		const body: Record<string, unknown> = {
			buildingId,
			invoiceDate,
			billingEntityName: billingEntity,
			description,
			amount: String(parseFloat(amount)),
			categoryId: categoryId || null,
			distributionKeyId: distributionKeyId || null,
			isValidUtilityCost
		};

		if (overrideReason.trim()) {
			body.manualOverrideReason = overrideReason.trim();
		}

		const result = await api.put(`/invoices/${data.invoice.id}`, body);

		if (result.error) {
			submitError = result.error.message;
			isSubmitting = false;
			return;
		}

		goto(`/invoices/${data.invoice.id}`);
	}
</script>

<svelte:head>
	<title>Rechnung bearbeiten - Dwello</title>
</svelte:head>

<div class="max-w-3xl mx-auto space-y-6">
	<PageTrail
		links={[
			{ href: '/invoices', label: 'Rechnungen' },
			{ href: `/invoices/${data.invoice.id}`, label: data.invoice.billingEntity }
		]}
		current="Bearbeiten"
	/>

	<!-- Header -->
	<div class="flex items-center gap-4">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Rechnung bearbeiten</h1>
			<p class="text-ink-muted mt-1">{data.invoice.billingEntity}</p>
		</div>
	</div>

	<form onsubmit={handleSubmit} class="space-y-6">
		<!-- Basic Info -->
		<Card>
			<h2 class="text-lg font-semibold text-gray-900 mb-4">Rechnungsdaten</h2>
			<InvoiceDataFields
				bind:buildingId
				bind:invoiceDate
				bind:amount
				bind:billingEntity
				bind:description
				buildings={data.buildings}
				{errors}
			/>
		</Card>

		<!-- Original LLM Categorization Info -->
		{#if data.invoice.llmConfidence}
			<OriginalSuggestion invoice={data.invoice} />
		{/if}

		<!-- Category & Distribution -->
		<Card>
			<h2 class="text-lg font-semibold text-gray-900 mb-4">Kategorisierung & Verteilung</h2>
			<InvoiceCategoryFields
				bind:categoryId
				bind:distributionKeyId
				bind:isValidUtilityCost
				categories={data.categories}
				distributionKeys={data.distributionKeys}
			>
				{#if needsReason}
					<div class="sm:col-span-2">
						<label for="overrideReason" class="block text-sm font-medium text-gray-700 mb-1">
							Grund für Kategorieänderung <span class="text-critical">*</span>
						</label>
						<textarea
							id="overrideReason"
							data-testid="invoice-override-reason-input"
							bind:value={overrideReason}
							rows={2}
							placeholder="Warum wird die KI-Kategorisierung überschrieben?"
							class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
						></textarea>
						<FieldError message={errors.overrideReason} />
						<p class="mt-1 text-xs text-ink-muted">
							Dieser Grund wird protokolliert und dient zur Verbesserung der KI-Kategorisierung.
						</p>
					</div>
				{/if}
			</InvoiceCategoryFields>
		</Card>

		{#if submitError}
			<div class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-critical">
				Fehler beim Speichern: {submitError}
			</div>
		{/if}

		<!-- Actions -->
		<div class="flex items-center justify-between">
			<span class="text-sm text-caution flex items-center gap-1" hidden={!hasChanges}>
				<Icon name="edit" size={16} />
				Ungespeicherte Änderungen
			</span>
			<InvoiceFormActions
				cancelHref="/invoices/{data.invoice.id}"
				label="Änderungen speichern"
				busyLabel="Wird gespeichert..."
				busy={isSubmitting}
				disabled={!hasChanges}
			/>
		</div>
	</form>
</div>
