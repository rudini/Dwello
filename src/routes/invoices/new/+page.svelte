<script lang="ts">
	import { goto } from '$app/navigation';
	import { untrack } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';
	import Badge from '$lib/components/Badge.svelte';
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
	let llmSuggestion = $state<{
		category: { id: string; name: string; isAllowedUtilityCost: boolean } | null;
		confidence: number;
		reasoning?: string;
		isAllowedUtilityCost: boolean;
	} | null>(null);

	// Form validation
	let errors = $state<Record<string, string>>({});
	let isSubmitting = $state(false);

	// Derived values
	const selectedCategory = $derived.by(() => data.categories.find((c: { id: string }) => c.id === categoryId));

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

	function handleCategoryChange() {
		const cat = data.categories.find((c: { id: string }) => c.id === categoryId);
		if (cat) {
			isValidUtilityCost = cat.isAllowedUtilityCost;
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
				isValidUtilityCost
			});

			if (response.error) {
				addToast('error', response.error.message || 'Fehler beim Erstellen der Rechnung');
			} else {
				addToast('success', 'Rechnung erfolgreich erstellt');
				goto('/invoices');
			}
		} catch (error) {
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
	<!-- Header -->
	<div class="flex items-center gap-4">
		<a
			href="/invoices"
			class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
		>
			<Icon name="arrow_back" size={20} />
		</a>
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
						onblur={triggerLLMCategorization}
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
						onblur={triggerLLMCategorization}
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

		<!-- LLM Categorization -->
		{#if isCategorizingLLM || llmSuggestion}
			<Card>
				<h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
					<Icon name="auto_awesome" size={20} class="text-blue-500" />
					KI-Kategorisierung
				</h2>

				{#if isCategorizingLLM}
					<div class="flex items-center gap-3 text-gray-600">
						<div class="animate-spin">
							<Icon name="progress_activity" size={24} />
						</div>
						<span>Analysiere Rechnung mit KI...</span>
					</div>
				{:else if llmSuggestion}
					{@const suggestion = llmSuggestion}
					<div class="space-y-4">
						<div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
							<div class="flex items-start justify-between gap-4">
								<div class="flex-1">
									<div class="flex items-center gap-2 mb-2">
										<span class="font-medium text-gray-900">Vorgeschlagene Kategorie:</span>
										{#if suggestion.category}
											<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
												{suggestion.category.name}
											</span>
											{#if !suggestion.isAllowedUtilityCost}
												<Badge variant="danger">Nicht umlagefähig</Badge>
											{/if}
										{:else}
											<span class="text-gray-500">Keine Kategorie gefunden</span>
										{/if}
									</div>
									<div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
										<span>Konfidenz:</span>
										<div class="flex-1 max-w-xs bg-gray-200 rounded-full h-2">
											<div
												class="bg-blue-500 h-2 rounded-full"
												style="width: {suggestion.confidence * 100}%"
											></div>
										</div>
										<span class="font-medium">{Math.round(suggestion.confidence * 100)}%</span>
									</div>
									{#if suggestion.reasoning}
										<p class="text-sm text-gray-500">
											<Icon name="lightbulb" size={16} class="inline mr-1" />
											{suggestion.reasoning}
										</p>
									{/if}
								</div>
								{#if suggestion.category}
									<Button
										type="button"
										variant="primary"
										size="sm"
										onclick={acceptLLMSuggestion}
									>
										<Icon name="check" size={16} />
										Übernehmen
									</Button>
								{/if}
							</div>
						</div>
					</div>
				{/if}
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
							{#each data.categories.filter((c: { isAllowedUtilityCost: boolean }) => c.isAllowedUtilityCost) as category}
								<option value={category.id}>{category.name}</option>
							{/each}
						</optgroup>
						<optgroup label="Nicht umlagefähige Kosten">
							{#each data.categories.filter((c: { isAllowedUtilityCost: boolean }) => !c.isAllowedUtilityCost) as category}
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

		<!-- Actions -->
		<div class="flex items-center justify-end gap-3">
			<Button href="/invoices" variant="secondary">
				Abbrechen
			</Button>
			<Button type="submit" variant="primary" disabled={isSubmitting}>
				{#if isSubmitting}
					<Icon name="progress_activity" size={20} class="animate-spin" />
					Wird erstellt...
				{:else}
					<Icon name="check" size={20} />
					Rechnung erstellen
				{/if}
			</Button>
		</div>
	</form>
</div>
