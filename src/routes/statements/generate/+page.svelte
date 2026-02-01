<script lang="ts">
	import type { Building, Category, DistributionKey, HeatingProfile } from '$lib/types';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';

	interface GenerateStatementData {
		buildings: (Building & { apartmentCount: number })[];
		categories: Category[];
		distributionKeys: DistributionKey[];
		heatingProfiles: HeatingProfile[];
		defaultPeriod: {
			start: string;
			end: string;
		};
	}

	let { data }: { data: GenerateStatementData } = $props();

	// Extract values from props as derived for reactivity
	const buildings = $derived(data.buildings);
	const heatingProfiles = $derived(data.heatingProfiles);

	// Helper to calculate sum of monthly percentages
	function getProfileSum(profile: HeatingProfile): number {
		return Object.values(profile.monthlyPercentages).reduce((sum, val) => sum + Number(val), 0);
	}

	// Check if profile is valid (sums to 100%)
	function isProfileValid(profile: HeatingProfile): boolean {
		return Math.abs(getProfileSum(profile) - 100) < 0.01;
	}

	// Get first valid profile for initial selection
	const validHeatingProfiles = $derived(
		heatingProfiles.filter((p) => isProfileValid(p))
	);

	// Wizard state
	let currentStep = $state(1);
	const totalSteps = 4;

	// Step 1: Period
	let periodStart = $state('');
	let periodEnd = $state('');
	let heatingProfileId = $state('');

	// Initialize period and heating profile from props
	$effect(() => {
		if (data.defaultPeriod) {
			periodStart = data.defaultPeriod.start;
			periodEnd = data.defaultPeriod.end;
		}
	});

	// Set initial heating profile to first valid one
	$effect(() => {
		if (validHeatingProfiles.length > 0 && !heatingProfileId) {
			heatingProfileId = validHeatingProfiles[0].id;
		}
	});

	// Step 2: Buildings/Apartments
	let selectedBuildingIds = $state<string[]>([]);
	let selectAllBuildings = $state(false);

	// Step 3: Preview data (mock)
	let previewData = $state<{
		totalStatements: number;
		totalCosts: number;
		buildings: { name: string; apartments: number; costs: number }[];
	} | null>(null);

	// Step 4: Generation state
	let isGenerating = $state(false);
	let generationProgress = $state(0);
	let generationComplete = $state(false);

	const selectedHeatingProfile = $derived(
		heatingProfiles.find((p) => p.id === heatingProfileId)
	);

	const totalSelectedApartments = $derived(() => {
		return buildings
			.filter((b) => selectedBuildingIds.includes(b.id))
			.reduce((sum, b) => sum + b.apartmentCount, 0);
	});

	function toggleBuilding(buildingId: string) {
		if (selectedBuildingIds.includes(buildingId)) {
			selectedBuildingIds = selectedBuildingIds.filter((id) => id !== buildingId);
		} else {
			selectedBuildingIds = [...selectedBuildingIds, buildingId];
		}
	}

	function toggleAllBuildings() {
		if (selectAllBuildings) {
			selectedBuildingIds = [];
			selectAllBuildings = false;
		} else {
			selectedBuildingIds = buildings.map((b) => b.id);
			selectAllBuildings = true;
		}
	}

	function nextStep() {
		if (currentStep === 2) {
			// Generate preview data
			previewData = {
				totalStatements: totalSelectedApartments(),
				totalCosts: totalSelectedApartments() * 3500, // Mock calculation
				buildings: buildings
					.filter((b) => selectedBuildingIds.includes(b.id))
					.map((b) => ({
						name: b.name || `${b.address}, ${b.city}`,
						apartments: b.apartmentCount,
						costs: b.apartmentCount * 3500
					}))
			};
		}
		if (currentStep < totalSteps) {
			currentStep++;
		}
	}

	function prevStep() {
		if (currentStep > 1) {
			currentStep--;
		}
	}

	function canProceed(): boolean {
		switch (currentStep) {
			case 1:
				return !!periodStart && !!periodEnd && !!heatingProfileId;
			case 2:
				return selectedBuildingIds.length > 0;
			case 3:
				return true;
			default:
				return false;
		}
	}

	async function startGeneration() {
		isGenerating = true;
		generationProgress = 0;

		// Simulate generation progress
		const totalApartments = totalSelectedApartments();
		for (let i = 0; i <= totalApartments; i++) {
			await new Promise((resolve) => setTimeout(resolve, 100));
			generationProgress = Math.round((i / totalApartments) * 100);
		}

		isGenerating = false;
		generationComplete = true;
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('de-CH', {
			style: 'currency',
			currency: 'CHF'
		}).format(amount);
	}

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('de-CH');
	}

	function getPeriodLabel(): string {
		const start = new Date(periodStart);
		return `${start.getFullYear()} (${formatDate(periodStart)} - ${formatDate(periodEnd)})`;
	}
</script>

<svelte:head>
	<title>Abrechnungen erstellen - Dwello</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center gap-4">
		<a
			href="/statements"
			class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
		>
			<Icon name="arrow_back" size={24} />
		</a>
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Nebenkostenabrechnungen erstellen</h1>
			<p class="text-gray-500 mt-1">Schritt {currentStep} von {totalSteps}</p>
		</div>
	</div>

	<!-- Progress Steps -->
	<div class="flex items-center justify-between max-w-3xl mx-auto">
		{#each [{ num: 1, label: 'Periode' }, { num: 2, label: 'Gebäude' }, { num: 3, label: 'Vorschau' }, { num: 4, label: 'Erstellen' }] as step}
			<div class="flex items-center">
				<div
					class="flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors
					{currentStep > step.num
						? 'bg-green-500 text-white'
						: currentStep === step.num
							? 'bg-blue-600 text-white'
							: 'bg-gray-200 text-gray-500'}"
				>
					{#if currentStep > step.num}
						<Icon name="check" size={20} />
					{:else}
						{step.num}
					{/if}
				</div>
				<span
					class="ml-2 text-sm font-medium {currentStep >= step.num
						? 'text-gray-900'
						: 'text-gray-400'}"
				>
					{step.label}
				</span>
			</div>
			{#if step.num < totalSteps}
				<div
					class="flex-1 h-1 mx-4 rounded {currentStep > step.num ? 'bg-green-500' : 'bg-gray-200'}"
				></div>
			{/if}
		{/each}
	</div>

	<!-- Step Content -->
	<Card>
		{#if currentStep === 1}
			<!-- Step 1: Period Selection -->
			<div class="space-y-6">
				<div>
					<h2 class="text-lg font-semibold text-gray-900 mb-4">Abrechnungsperiode wählen</h2>
					<p class="text-gray-500 mb-6">
						Wählen Sie den Zeitraum für die Nebenkostenabrechnung und das Heizungsprofil.
					</p>
				</div>

				<div class="grid gap-6 md:grid-cols-2">
					<div>
						<label for="periodStart" class="block text-sm font-medium text-gray-700 mb-2">
							Periode Start
						</label>
						<input
							id="periodStart"
							type="date"
							bind:value={periodStart}
							class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div>
						<label for="periodEnd" class="block text-sm font-medium text-gray-700 mb-2">
							Periode Ende
						</label>
						<input
							id="periodEnd"
							type="date"
							bind:value={periodEnd}
							class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
				</div>

				<div>
					<label for="heatingProfile" class="block text-sm font-medium text-gray-700 mb-2">
						Heizungsprofil
					</label>
					<select
						id="heatingProfile"
						bind:value={heatingProfileId}
						class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						{#each heatingProfiles as profile}
							{@const sum = getProfileSum(profile)}
							{@const valid = isProfileValid(profile)}
							<option
								value={profile.id}
								disabled={!valid}
								class={valid ? '' : 'text-gray-400'}
							>
								{profile.name} ({sum.toFixed(sum % 1 === 0 ? 0 : 1)}%){valid ? '' : ' - nicht wählbar'}
							</option>
						{/each}
					</select>
					{#if selectedHeatingProfile?.description}
						<p class="text-sm text-gray-500 mt-2">{selectedHeatingProfile.description}</p>
					{/if}
				</div>

				<!-- Heating Profile Preview -->
				{#if selectedHeatingProfile}
					<div class="bg-gray-50 rounded-lg p-4">
						<h3 class="text-sm font-medium text-gray-700 mb-6">Monatliche Verteilung</h3>
						<div class="flex items-end gap-1 h-24">
							{#each Object.entries(selectedHeatingProfile.monthlyPercentages) as [month, value]}
								<div class="flex-1 flex flex-col items-center h-full">
									<div class="w-full flex-1 relative">
										<div
											class="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t transition-all"
											style="height: {(value / 16) * 100}%"
										></div>
									</div>
									<span class="text-xs text-gray-500 mt-1 flex-shrink-0"
										>{month.slice(0, 1).toUpperCase()}</span
									>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		{:else if currentStep === 2}
			<!-- Step 2: Building Selection -->
			<div class="space-y-6">
				<div>
					<h2 class="text-lg font-semibold text-gray-900 mb-4">Gebäude auswählen</h2>
					<p class="text-gray-500 mb-6">
						Wählen Sie die Gebäude aus, für die Abrechnungen erstellt werden sollen.
					</p>
				</div>

				<div class="flex items-center justify-between pb-4 border-b border-gray-200">
					<label class="flex items-center gap-3 cursor-pointer">
						<input
							type="checkbox"
							checked={selectAllBuildings}
							onchange={toggleAllBuildings}
							class="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
						/>
						<span class="font-medium text-gray-900">Alle Gebäude auswählen</span>
					</label>
					<span class="text-sm text-gray-500">
						{selectedBuildingIds.length} von {buildings.length} ausgewählt
					</span>
				</div>

				<div class="space-y-3">
					{#each buildings as building}
						<label
							class="flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors
							{selectedBuildingIds.includes(building.id)
								? 'border-blue-500 bg-blue-50'
								: 'border-gray-200 hover:border-gray-300'}"
						>
							<input
								type="checkbox"
								checked={selectedBuildingIds.includes(building.id)}
								onchange={() => toggleBuilding(building.id)}
								class="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
							/>
							<div class="flex-1">
								<p class="font-medium text-gray-900">
									{building.name || `${building.address}, ${building.city}`}
								</p>
								<p class="text-sm text-gray-500">
									{building.address}, {building.postalCode}
									{building.city}
								</p>
							</div>
							<div class="text-right">
								<p class="font-medium text-gray-900">{building.apartmentCount}</p>
								<p class="text-sm text-gray-500">Wohnungen</p>
							</div>
						</label>
					{/each}
				</div>

				{#if selectedBuildingIds.length > 0}
					<div class="bg-blue-50 rounded-lg p-4 flex items-center justify-between">
						<div class="flex items-center gap-3">
							<Icon name="info" size={24} class="text-blue-600" />
							<span class="text-blue-800">
								Es werden <strong>{totalSelectedApartments()}</strong> Abrechnungen erstellt.
							</span>
						</div>
					</div>
				{/if}
			</div>
		{:else if currentStep === 3}
			<!-- Step 3: Preview -->
			<div class="space-y-6">
				<div>
					<h2 class="text-lg font-semibold text-gray-900 mb-4">Vorschau</h2>
					<p class="text-gray-500 mb-6">
						Überprüfen Sie die Zusammenfassung vor dem Erstellen der Abrechnungen.
					</p>
				</div>

				<!-- Summary Cards -->
				<div class="grid gap-4 sm:grid-cols-3">
					<div class="bg-gray-50 rounded-lg p-4">
						<p class="text-sm text-gray-500">Abrechnungsperiode</p>
						<p class="text-lg font-semibold text-gray-900 mt-1">{getPeriodLabel()}</p>
					</div>
					<div class="bg-gray-50 rounded-lg p-4">
						<p class="text-sm text-gray-500">Anzahl Abrechnungen</p>
						<p class="text-lg font-semibold text-gray-900 mt-1">{previewData?.totalStatements}</p>
					</div>
					<div class="bg-gray-50 rounded-lg p-4">
						<p class="text-sm text-gray-500">Geschätzte Gesamtkosten</p>
						<p class="text-lg font-semibold text-gray-900 mt-1">
							{formatCurrency(previewData?.totalCosts || 0)}
						</p>
					</div>
				</div>

				<!-- Building Breakdown -->
				<div>
					<h3 class="text-sm font-medium text-gray-700 mb-3">Aufschlüsselung nach Gebäude</h3>
					<div class="border border-gray-200 rounded-lg overflow-hidden">
						<table class="w-full">
							<thead class="bg-gray-50">
								<tr>
									<th
										class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
									>
										Gebäude
									</th>
									<th
										class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
									>
										Wohnungen
									</th>
									<th
										class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
									>
										Geschätzte Kosten
									</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-200">
								{#each previewData?.buildings || [] as building}
									<tr>
										<td class="px-4 py-3 text-sm text-gray-900">{building.name}</td>
										<td class="px-4 py-3 text-sm text-gray-900 text-right">{building.apartments}</td
										>
										<td class="px-4 py-3 text-sm text-gray-900 text-right"
											>{formatCurrency(building.costs)}</td
										>
									</tr>
								{/each}
							</tbody>
							<tfoot class="bg-gray-50">
								<tr>
									<td class="px-4 py-3 text-sm font-semibold text-gray-900">Total</td>
									<td class="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
										{previewData?.totalStatements}
									</td>
									<td class="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
										{formatCurrency(previewData?.totalCosts || 0)}
									</td>
								</tr>
							</tfoot>
						</table>
					</div>
				</div>

				<!-- Configuration Summary -->
				<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
					<div class="flex items-start gap-3">
						<Icon name="warning" size={24} class="text-yellow-600 flex-shrink-0" />
						<div>
							<p class="font-medium text-yellow-800">Vor dem Erstellen beachten</p>
							<ul class="mt-2 text-sm text-yellow-700 space-y-1">
								<li>• Alle Rechnungen für die Periode sollten erfasst sein</li>
								<li>• Mieterwechsel sollten korrekt eingetragen sein</li>
								<li>• Verteilschlüssel müssen konfiguriert sein</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		{:else if currentStep === 4}
			<!-- Step 4: Generation -->
			<div class="space-y-6">
				{#if !generationComplete}
					<div class="text-center py-8">
						{#if isGenerating}
							<div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
								<Icon name="sync" size={32} class="text-blue-600 animate-spin" />
							</div>
							<h2 class="text-lg font-semibold text-gray-900 mb-2">Abrechnungen werden erstellt...</h2>
							<p class="text-gray-500 mb-6">Bitte warten Sie, bis der Vorgang abgeschlossen ist.</p>

							<div class="max-w-md mx-auto">
								<div class="flex items-center justify-between text-sm text-gray-600 mb-2">
									<span>Fortschritt</span>
									<span>{generationProgress}%</span>
								</div>
								<div class="w-full bg-gray-200 rounded-full h-3">
									<div
										class="bg-blue-600 h-3 rounded-full transition-all duration-300"
										style="width: {generationProgress}%"
									></div>
								</div>
							</div>
						{:else}
							<div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
								<Icon name="receipt_long" size={32} class="text-blue-600" />
							</div>
							<h2 class="text-lg font-semibold text-gray-900 mb-2">Bereit zum Erstellen</h2>
							<p class="text-gray-500 mb-6">
								Klicken Sie auf "Abrechnungen erstellen", um {previewData?.totalStatements} Abrechnungen zu generieren.
							</p>
							<Button variant="primary" onclick={startGeneration}>
								<Icon name="play_arrow" size={20} />
								Abrechnungen erstellen
							</Button>
						{/if}
					</div>
				{:else}
					<div class="text-center py-8">
						<div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
							<Icon name="check_circle" size={32} class="text-green-600" />
						</div>
						<h2 class="text-lg font-semibold text-gray-900 mb-2">Abrechnungen erstellt!</h2>
						<p class="text-gray-500 mb-6">
							{previewData?.totalStatements} Nebenkostenabrechnungen wurden erfolgreich erstellt.
						</p>

						<div class="flex items-center justify-center gap-4">
							<Button href="/statements" variant="primary">
								<Icon name="visibility" size={20} />
								Abrechnungen anzeigen
							</Button>
							<Button href="/statements/generate" variant="secondary">
								<Icon name="add" size={20} />
								Weitere erstellen
							</Button>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</Card>

	<!-- Navigation -->
	{#if currentStep < 4 || (currentStep === 4 && !isGenerating && !generationComplete)}
		<div class="flex items-center justify-between">
			<div>
				{#if currentStep > 1 && !isGenerating}
					<Button variant="secondary" onclick={prevStep}>
						<Icon name="arrow_back" size={20} />
						Zurück
					</Button>
				{/if}
			</div>
			<div>
				{#if currentStep < 4}
					<Button variant="primary" onclick={nextStep} disabled={!canProceed()}>
						Weiter
						<Icon name="arrow_forward" size={20} />
					</Button>
				{/if}
			</div>
		</div>
	{/if}
</div>
