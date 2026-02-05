<script lang="ts">
	import { goto } from '$app/navigation';
	import { api } from '$lib/api';
	import type { InvoiceWithDetails, Category, DistributionKey } from '$lib/types';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';

	interface PageData {
		invoice: InvoiceWithDetails;
		buildings: { id: string; name: string; address: string }[];
		categories: Category[];
		distributionKeys: DistributionKey[];
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
	const selectedCategory = $derived.by(() => data.categories.find(c => c.id === categoryId));
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
		if (!amount || parseFloat(amount) <= 0) newErrors.amount = 'Bitte geben Sie einen gültigen Betrag ein';

		// If category changed from LLM suggestion, require reason
		if (categoryId !== initialCategoryId && hasLlmConfidence && !overrideReason.trim()) {
			newErrors.overrideReason = 'Bitte geben Sie einen Grund für die Änderung an';
		}

		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	function handleCategoryChange() {
		const cat = data.categories.find(c => c.id === categoryId);
		if (cat) {
			isValidUtilityCost = cat.isAllowedUtilityCost;
		}
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
	<title>Bearbeiten: {data.invoice.billingEntity} - Dwello</title>
</svelte:head>

<div class="max-w-3xl mx-auto space-y-6">
	<!-- Header -->
	<div class="flex items-center gap-4">
		<a
			href="/invoices/{data.invoice.id}"
			class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
		>
			<Icon name="arrow_back" size={20} />
		</a>
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Rechnung bearbeiten</h1>
			<p class="text-gray-500 mt-1">{data.invoice.billingEntity}</p>
		</div>
	</div>

	<form onsubmit={handleSubmit} class="space-y-6">
		<!-- Basic Info -->
		<Card>
			<h2 class="text-lg font-semibold text-gray-900 mb-4">Rechnungsdaten</h2>
			<div class="grid gap-4 sm:grid-cols-2">
				<!-- Building -->
				<div class="sm:col-span-2">
					<label for="building" class="block text-sm font-medium text-gray-700 mb-1">
						Gebäude <span class="text-red-500">*</span>
					</label>
					<select
						id="building"
						bind:value={buildingId}
						class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 {errors.buildingId ? 'border-red-500' : 'border-gray-300'}"
					>
						<option value="">Gebäude auswählen...</option>
						{#each data.buildings as building}
							<option value={building.id}>{building.name} - {building.address}</option>
						{/each}
					</select>
					{#if errors.buildingId}
						<p class="mt-1 text-sm text-red-500">{errors.buildingId}</p>
					{/if}
				</div>

				<!-- Invoice Date -->
				<div>
					<label for="invoiceDate" class="block text-sm font-medium text-gray-700 mb-1">
						Rechnungsdatum <span class="text-red-500">*</span>
					</label>
					<input
						id="invoiceDate"
						type="date"
						bind:value={invoiceDate}
						class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 {errors.invoiceDate ? 'border-red-500' : 'border-gray-300'}"
					/>
					{#if errors.invoiceDate}
						<p class="mt-1 text-sm text-red-500">{errors.invoiceDate}</p>
					{/if}
				</div>

				<!-- Amount -->
				<div>
					<label for="amount" class="block text-sm font-medium text-gray-700 mb-1">
						Betrag (CHF) <span class="text-red-500">*</span>
					</label>
					<input
						id="amount"
						type="number"
						step="0.01"
						min="0"
						bind:value={amount}
						placeholder="0.00"
						class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 {errors.amount ? 'border-red-500' : 'border-gray-300'}"
					/>
					{#if errors.amount}
						<p class="mt-1 text-sm text-red-500">{errors.amount}</p>
					{/if}
				</div>

				<!-- Billing Entity -->
				<div class="sm:col-span-2">
					<label for="billingEntity" class="block text-sm font-medium text-gray-700 mb-1">
						Lieferant / Rechnungssteller <span class="text-red-500">*</span>
					</label>
					<input
						id="billingEntity"
						type="text"
						bind:value={billingEntity}
						placeholder="z.B. Energie Zürich AG"
						class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 {errors.billingEntity ? 'border-red-500' : 'border-gray-300'}"
					/>
					{#if errors.billingEntity}
						<p class="mt-1 text-sm text-red-500">{errors.billingEntity}</p>
					{/if}
				</div>

				<!-- Description -->
				<div class="sm:col-span-2">
					<label for="description" class="block text-sm font-medium text-gray-700 mb-1">
						Beschreibung <span class="text-red-500">*</span>
					</label>
					<textarea
						id="description"
						bind:value={description}
						rows={3}
						placeholder="z.B. Heizöllieferung Q4 2024"
						class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none {errors.description ? 'border-red-500' : 'border-gray-300'}"
					></textarea>
					{#if errors.description}
						<p class="mt-1 text-sm text-red-500">{errors.description}</p>
					{/if}
				</div>
			</div>
		</Card>

		<!-- Original LLM Categorization Info -->
		{#if data.invoice.llmConfidence}
			<Card>
				<h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
					<Icon name="auto_awesome" size={20} class="text-blue-500" />
					Ursprüngliche KI-Kategorisierung
				</h2>
				<div class="p-4 bg-gray-50 rounded-lg">
					<div class="flex items-center gap-2 mb-2">
						<span class="text-sm text-gray-600">Kategorie:</span>
						{#if data.invoice.category}
							<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
								{data.invoice.category.name}
							</span>
						{/if}
					</div>
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
			</Card>
		{/if}

		<!-- Category & Distribution -->
		<Card>
			<h2 class="text-lg font-semibold text-gray-900 mb-4">Kategorisierung & Verteilung</h2>
			<div class="grid gap-4 sm:grid-cols-2">
				<!-- Category -->
				<div>
					<label for="category" class="block text-sm font-medium text-gray-700 mb-1">
						Kategorie
					</label>
					<select
						id="category"
						bind:value={categoryId}
						onchange={handleCategoryChange}
						class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="">Kategorie auswählen...</option>
						<optgroup label="Umlagefähige Kosten">
							{#each data.categories.filter(c => c.isAllowedUtilityCost) as category}
								<option value={category.id}>{category.name}</option>
							{/each}
						</optgroup>
						<optgroup label="Nicht umlagefähige Kosten">
							{#each data.categories.filter(c => !c.isAllowedUtilityCost) as category}
								<option value={category.id}>{category.name}</option>
							{/each}
						</optgroup>
					</select>
				</div>

				<!-- Distribution Key -->
				<div>
					<label for="distributionKey" class="block text-sm font-medium text-gray-700 mb-1">
						Verteilschlüssel
					</label>
					<select
						id="distributionKey"
						bind:value={distributionKeyId}
						class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="">Verteilschlüssel auswählen...</option>
						{#each data.distributionKeys as key}
							<option value={key.id}>{key.name}</option>
						{/each}
					</select>
				</div>

				<!-- Override Reason (if category changed) -->
				{#if categoryId !== initialCategoryId && hasLlmConfidence}
					<div class="sm:col-span-2">
						<label for="overrideReason" class="block text-sm font-medium text-gray-700 mb-1">
							Grund für Kategorieänderung <span class="text-red-500">*</span>
						</label>
						<textarea
							id="overrideReason"
							bind:value={overrideReason}
							rows={2}
							placeholder="Warum wird die KI-Kategorisierung überschrieben?"
							class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none {errors.overrideReason ? 'border-red-500' : 'border-gray-300'}"
						></textarea>
						{#if errors.overrideReason}
							<p class="mt-1 text-sm text-red-500">{errors.overrideReason}</p>
						{/if}
						<p class="mt-1 text-xs text-gray-500">
							Dieser Grund wird protokolliert und dient zur Verbesserung der KI-Kategorisierung.
						</p>
					</div>
				{/if}

				<!-- Validity -->
				<div class="sm:col-span-2">
					<div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
						<input
							id="isValidUtilityCost"
							type="checkbox"
							bind:checked={isValidUtilityCost}
							class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
						/>
						<div>
							<label for="isValidUtilityCost" class="font-medium text-gray-900">
								Umlagefähige Nebenkosten
							</label>
							<p class="text-sm text-gray-500">
								Gemäss schweizerischem Mietrecht auf Mieter umlegbare Kosten
							</p>
						</div>
					</div>

					{#if selectedCategory && !selectedCategory.isAllowedUtilityCost}
						<div class="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
							<Icon name="warning" size={18} class="text-amber-500 flex-shrink-0 mt-0.5" />
							<div class="text-sm text-amber-700">
								<strong>Hinweis:</strong> Diese Kategorie enthält typischerweise nicht umlagefähige Kosten
								(z.B. Reparaturen, Versicherungen). Diese können nicht auf Mieter übertragen werden.
							</div>
						</div>
					{/if}
				</div>
			</div>
		</Card>

		{#if submitError}
			<div class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
				Fehler beim Speichern: {submitError}
			</div>
		{/if}

		<!-- Actions -->
		<div class="flex items-center justify-between">
			<div>
				{#if hasChanges}
					<span class="text-sm text-amber-600 flex items-center gap-1">
						<Icon name="edit" size={16} />
						Ungespeicherte Änderungen
					</span>
				{/if}
			</div>
			<div class="flex items-center gap-3">
				<Button href="/invoices/{data.invoice.id}" variant="secondary">
					Abbrechen
				</Button>
				<Button type="submit" variant="primary" disabled={isSubmitting || !hasChanges}>
					{#if isSubmitting}
						<Icon name="progress_activity" size={20} class="animate-spin" />
						Wird gespeichert...
					{:else}
						<Icon name="check" size={20} />
						Änderungen speichern
					{/if}
				</Button>
			</div>
		</div>
	</form>
</div>
