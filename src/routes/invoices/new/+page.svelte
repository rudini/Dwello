<script lang="ts">
	import { goto } from '$app/navigation';
	import { untrack } from 'svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';
	import InvoiceCategoryFields from '$lib/components/InvoiceCategoryFields.svelte';
	import InvoiceDataFields from '$lib/components/InvoiceDataFields.svelte';
	import InvoiceFormActions from '$lib/components/InvoiceFormActions.svelte';
	import InvoiceSuggestion from '$lib/components/InvoiceSuggestion.svelte';
	import { suggestionProvenance, type Suggestion } from '$lib/invoice';
	import PageTrail from '$lib/components/PageTrail.svelte';
	import { api } from '$lib/api';
	import { addToast } from '$lib/stores';

	// Server-loaded data
	let { data } = $props();

	// Form state
	let buildingId = $state('');
	let invoiceDate = $state(new Date().toISOString().split('T')[0]);
	let billingEntity = $state('');
	let description = $state('');
	let amount = $state('');
	let categoryId = $state('');
	let distributionKeyId = $state(untrack(() => data.defaultDistributionKeyId ?? ''));
	let isValidUtilityCost = $state(true);

	// LLM categorization state
	let isCategorizingLLM = $state(false);
	let llmSuggestion = $state<Suggestion | null>(null);

	// Form validation
	let errors = $state<Record<string, string>>({});
	let isSubmitting = $state(false);

	function validate(): boolean {
		const newErrors: Record<string, string> = {};

		if (!buildingId) newErrors.buildingId = 'Bitte wählen Sie ein Gebäude';
		if (!invoiceDate) newErrors.invoiceDate = 'Bitte geben Sie ein Datum ein';
		if (!billingEntity.trim()) newErrors.billingEntity = 'Bitte geben Sie einen Lieferanten ein';
		if (!description.trim()) newErrors.description = 'Bitte geben Sie eine Beschreibung ein';
		if (!amount || parseFloat(amount) <= 0) newErrors.amount = 'Bitte geben Sie einen gültigen Betrag ein';

		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	async function triggerLLMCategorization() {
		if (!billingEntity.trim() || !description.trim() || !data.llmAvailable) {
			return;
		}

		isCategorizingLLM = true;
		llmSuggestion = null;

		try {
			const response = await api.post<{
				category: { id: string; name: string; isAllowedUtilityCost: boolean } | null;
				confidence: number;
				isAllowedUtilityCost: boolean;
				reasoning?: string;
				source: string;
			}>('/invoices/categorize', {
				billingEntityName: billingEntity.trim(),
				description: description.trim(),
				amount: String(amount || '0')
			});

			if (response.error) {
				console.error('LLM categorization error:', response.error);
				addToast('error', 'KI-Kategorisierung fehlgeschlagen');
			} else if (response.data) {
				llmSuggestion = {
					category: response.data.category,
					confidence: response.data.confidence,
					reasoning: response.data.reasoning,
					isAllowedUtilityCost: response.data.isAllowedUtilityCost
				};

				// Auto-apply category when confidence is high enough
				if (response.data.category && response.data.confidence >= 0.7) {
					categoryId = response.data.category.id;
					isValidUtilityCost = response.data.isAllowedUtilityCost;
				}
			}
		} catch (error) {
			console.error('LLM categorization failed:', error);
		} finally {
			isCategorizingLLM = false;
		}
	}

	function acceptLLMSuggestion() {
		const suggestion = llmSuggestion;
		if (suggestion?.category) {
			categoryId = suggestion.category.id;
			isValidUtilityCost = suggestion.isAllowedUtilityCost;
		}
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (!validate()) return;

		isSubmitting = true;

		try {
			const response = await api.post('/invoices', {
				buildingId,
				invoiceDate,
				billingEntityName: billingEntity.trim(),
				description: description.trim(),
				amount: String(amount),
				categoryId: categoryId || null,
				distributionKeyId: distributionKeyId || null,
				isValidUtilityCost,
				...suggestionProvenance(llmSuggestion)
			});

			if (response.error) {
				addToast('error', response.error.message || 'Fehler beim Erstellen der Rechnung');
			} else {
				addToast('success', 'Rechnung erfolgreich erstellt');
				goto('/invoices');
			}
		} catch {
			addToast('error', 'Fehler beim Erstellen der Rechnung');
		} finally {
			isSubmitting = false;
		}
	}
</script>

<svelte:head>
	<title>Neue Rechnung - Dwello</title>
</svelte:head>

<div class="max-w-3xl mx-auto space-y-6">
	<PageTrail links={[{ href: '/invoices', label: 'Rechnungen' }]} current="Neue Rechnung" />

	<!-- Header -->
	<div class="flex items-center gap-4">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Neue Rechnung</h1>
			<p class="text-gray-500 mt-1">Erfassen Sie eine neue Rechnung für die Nebenkostenabrechnung</p>
		</div>
	</div>

	<!-- LLM Status Banner -->
	{#if data.llmAvailable}
		<div class="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
			<Icon name="auto_awesome" size={18} />
			<span>KI-Kategorisierung ist aktiv. Die Rechnung wird automatisch analysiert.</span>
		</div>
	{/if}

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
				onblur={triggerLLMCategorization}
			/>
		</Card>

		<!-- LLM Categorization -->
		{#if isCategorizingLLM || llmSuggestion}
			<InvoiceSuggestion categorizing={isCategorizingLLM} suggestion={llmSuggestion} onaccept={acceptLLMSuggestion} />
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
			/>
		</Card>

		<!-- Actions -->
		<div class="flex justify-end">
			<InvoiceFormActions
				cancelHref="/invoices"
				label="Rechnung erstellen"
				busyLabel="Wird erstellt..."
				busy={isSubmitting}
			/>
		</div>
	</form>
</div>
