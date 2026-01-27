<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';
	import Badge from '$lib/components/Badge.svelte';

	// Mock data for form
	const buildings = [
		{ id: 'building-001', name: 'Musterhaus Zentrum', address: 'Musterstraße 12, 8000 Zürich' },
		{ id: 'building-002', name: 'Seepark Residenz', address: 'Seestrasse 45, 6004 Luzern' },
		{ id: 'building-003', name: 'Alpenblick', address: 'Bergweg 7, 3012 Bern' },
		{ id: 'building-004', name: 'Sonnenhof', address: 'Bahnhofstrasse 88, 4051 Basel' }
	];

	const categories = [
		{ id: 'cat-001', name: 'Heizung', isAllowedUtilityCost: true },
		{ id: 'cat-002', name: 'Warmwasser', isAllowedUtilityCost: true },
		{ id: 'cat-003', name: 'Wasser/Abwasser', isAllowedUtilityCost: true },
		{ id: 'cat-004', name: 'Allgemeinstrom', isAllowedUtilityCost: true },
		{ id: 'cat-005', name: 'Hauswart', isAllowedUtilityCost: true },
		{ id: 'cat-006', name: 'Aufzug', isAllowedUtilityCost: true },
		{ id: 'cat-007', name: 'Gartenpflege', isAllowedUtilityCost: true },
		{ id: 'cat-008', name: 'Kehricht', isAllowedUtilityCost: true },
		{ id: 'cat-009', name: 'Reparaturen', isAllowedUtilityCost: false },
		{ id: 'cat-010', name: 'Versicherung', isAllowedUtilityCost: false }
	];

	const distributionKeys = [
		{ id: 'dk-units', name: 'Nach Einheiten' },
		{ id: 'dk-area', name: 'Nach Fläche' },
		{ id: 'dk-heating', name: 'Heizkosten' },
		{ id: 'dk-rooms', name: 'Nach Zimmern' }
	];

	// Form state
	let buildingId = $state('');
	let invoiceDate = $state(new Date().toISOString().split('T')[0]);
	let billingEntity = $state('');
	let description = $state('');
	let amount = $state('');
	let categoryId = $state('');
	let distributionKeyId = $state('');
	let isValidUtilityCost = $state(true);

	// LLM categorization state
	let isCategorizingLLM = $state(false);
	let llmSuggestion = $state<{
		categoryId: string;
		confidence: number;
		reasoning: string;
	} | null>(null);

	// Form validation
	let errors = $state<Record<string, string>>({});
	let isSubmitting = $state(false);

	// Derived values
	const selectedCategory = $derived.by(() => categories.find(c => c.id === categoryId));

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
		if (!billingEntity.trim() || !description.trim()) {
			return;
		}

		isCategorizingLLM = true;
		llmSuggestion = null;

		// Simulate LLM categorization (in production, this would call the backend)
		await new Promise(resolve => setTimeout(resolve, 1500));

		// Mock LLM response based on keywords
		const descLower = description.toLowerCase();
		const entityLower = billingEntity.toLowerCase();

		let suggestion = {
			categoryId: 'cat-005', // Default to Hauswart
			confidence: 0.75,
			reasoning: 'Basierend auf der Beschreibung kategorisiert.'
		};

		if (descLower.includes('heiz') || descLower.includes('öl') || descLower.includes('gas')) {
			suggestion = { categoryId: 'cat-001', confidence: 0.92, reasoning: 'Heizkosten erkannt anhand Schlüsselwörter (Heizöl, Gas)' };
		} else if (descLower.includes('wasser') && !descLower.includes('warm')) {
			suggestion = { categoryId: 'cat-003', confidence: 0.88, reasoning: 'Wasser/Abwasser erkannt' };
		} else if (descLower.includes('warmwasser')) {
			suggestion = { categoryId: 'cat-002', confidence: 0.90, reasoning: 'Warmwasser erkannt' };
		} else if (descLower.includes('strom') || entityLower.includes('ekz') || entityLower.includes('ewz')) {
			suggestion = { categoryId: 'cat-004', confidence: 0.87, reasoning: 'Stromrechnung von Energieversorger erkannt' };
		} else if (descLower.includes('lift') || entityLower.includes('schindler') || entityLower.includes('aufzug')) {
			suggestion = { categoryId: 'cat-006', confidence: 0.91, reasoning: 'Aufzugswartung erkannt' };
		} else if (descLower.includes('garten') || descLower.includes('rasen') || descLower.includes('pflege')) {
			suggestion = { categoryId: 'cat-007', confidence: 0.85, reasoning: 'Gartenpflege erkannt' };
		} else if (descLower.includes('kehricht') || descLower.includes('abfall') || descLower.includes('müll')) {
			suggestion = { categoryId: 'cat-008', confidence: 0.89, reasoning: 'Abfallentsorgung erkannt' };
		} else if (descLower.includes('reparatur') || descLower.includes('defekt') || descLower.includes('ersatz')) {
			suggestion = { categoryId: 'cat-009', confidence: 0.86, reasoning: 'Reparatur erkannt - nicht umlagefähige Nebenkosten' };
		} else if (entityLower.includes('hauswart') || descLower.includes('reinigung')) {
			suggestion = { categoryId: 'cat-005', confidence: 0.84, reasoning: 'Hauswartdienste erkannt' };
		}

		llmSuggestion = suggestion;
		isCategorizingLLM = false;
	}

	function acceptLLMSuggestion() {
		const suggestion = llmSuggestion;
		if (suggestion) {
			categoryId = suggestion.categoryId;
			const cat = categories.find(c => c.id === suggestion.categoryId);
			if (cat) {
				isValidUtilityCost = cat.isAllowedUtilityCost;
			}
		}
	}

	function handleCategoryChange() {
		const cat = categories.find(c => c.id === categoryId);
		if (cat) {
			isValidUtilityCost = cat.isAllowedUtilityCost;
		}
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (!validate()) return;

		isSubmitting = true;

		// Simulate API call
		await new Promise(resolve => setTimeout(resolve, 1000));

		// In production, this would POST to the API
		console.log('Creating invoice:', {
			buildingId,
			invoiceDate,
			billingEntity,
			description,
			amount: parseFloat(amount),
			categoryId,
			distributionKeyId,
			isValidUtilityCost
		});

		goto('/invoices');
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
						{#each buildings as building}
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
						<span>Analysiere Rechnung...</span>
					</div>
				{:else if llmSuggestion}
					{@const suggestion = llmSuggestion}
					{@const suggestedCategory = categories.find(c => c.id === suggestion.categoryId)}
					<div class="space-y-4">
						<div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
							<div class="flex items-start justify-between gap-4">
								<div class="flex-1">
									<div class="flex items-center gap-2 mb-2">
										<span class="font-medium text-gray-900">Vorgeschlagene Kategorie:</span>
										<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
											{suggestedCategory?.name}
										</span>
										{#if suggestedCategory && !suggestedCategory.isAllowedUtilityCost}
											<Badge variant="danger">Nicht umlagefähig</Badge>
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
									<p class="text-sm text-gray-500">
										<Icon name="lightbulb" size={16} class="inline mr-1" />
										{suggestion.reasoning}
									</p>
								</div>
								<Button
									type="button"
									variant="primary"
									size="sm"
									onclick={acceptLLMSuggestion}
								>
									<Icon name="check" size={16} />
									Übernehmen
								</Button>
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
							{#each categories.filter(c => c.isAllowedUtilityCost) as category}
								<option value={category.id}>{category.name}</option>
							{/each}
						</optgroup>
						<optgroup label="Nicht umlagefähige Kosten">
							{#each categories.filter(c => !c.isAllowedUtilityCost) as category}
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
						{#each distributionKeys as key}
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
