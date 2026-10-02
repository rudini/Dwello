<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';

	// Form state
	let name = $state('');
	let nameDE = $state('');
	let nameFR = $state('');
	let nameIT = $state('');
	let nameEN = $state('');
	let description = $state('');
	let isAllowedUtilityCost = $state(true);
	let sortOrder = $state('');

	// Form validation
	let errors = $state<Record<string, string>>({});
	let isSubmitting = $state(false);
	let showTranslations = $state(false);

	function validate(): boolean {
		const newErrors: Record<string, string> = {};

		if (!name.trim()) newErrors.name = 'Bitte geben Sie einen Namen ein';
		if (name.trim().length > 100)
			newErrors.name = 'Der Name darf maximal 100 Zeichen lang sein';

		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (!validate()) return;

		isSubmitting = true;

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// In production, this would POST to the API
		console.log('Creating category:', {
			name,
			nameDE: nameDE || name,
			nameFR,
			nameIT,
			nameEN,
			description,
			isAllowedUtilityCost,
			sortOrder: sortOrder ? parseInt(sortOrder) : undefined
		});

		goto('/config/categories');
	}
</script>

<svelte:head>
	<title>Neue Kategorie - Dwello</title>
</svelte:head>

<div class="max-w-3xl mx-auto space-y-6">
	<!-- Header -->
	<div class="flex items-center gap-4">
		<a
			href="/config/categories"
			class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
		>
			<Icon name="arrow_back" size={20} />
		</a>
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Neue Kategorie</h1>
			<p class="text-gray-500 mt-1">Erstellen Sie eine neue Kostenkategorie</p>
		</div>
	</div>

	<form onsubmit={handleSubmit} class="space-y-6">
		<!-- Basic Info -->
		<Card>
			<h2 class="text-lg font-semibold text-gray-900 mb-4">Kategorie-Informationen</h2>
			<div class="space-y-4">
				<!-- Name -->
				<div>
					<label for="name" class="block text-sm font-medium text-gray-700 mb-1">
						Kategoriename <span class="text-red-500">*</span>
					</label>
					<input
						id="name"
						type="text"
						bind:value={name}
						placeholder="z.B. Heizung, Warmwasser, Hauswart"
						class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 {errors.name
							? 'border-red-500'
							: 'border-gray-300'}"
					/>
					{#if errors.name}
						<p class="mt-1 text-sm text-red-500">{errors.name}</p>
					{/if}
				</div>

				<!-- Description -->
				<div>
					<label for="description" class="block text-sm font-medium text-gray-700 mb-1">
						Beschreibung
					</label>
					<textarea
						id="description"
						bind:value={description}
						rows={2}
						placeholder="Optionale Beschreibung der Kategorie"
						class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
					></textarea>
				</div>

				<!-- Sort Order -->
				<div>
					<label for="sortOrder" class="block text-sm font-medium text-gray-700 mb-1">
						Sortierreihenfolge
					</label>
					<input
						id="sortOrder"
						type="number"
						min="1"
						bind:value={sortOrder}
						placeholder="z.B. 1, 2, 3..."
						class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>
					<p class="mt-1 text-xs text-gray-500">
						Bestimmt die Anzeigereihenfolge in Listen (kleinere Zahlen zuerst)
					</p>
				</div>
			</div>
		</Card>

		<!-- Translations -->
		<Card>
			<button
				type="button"
				onclick={() => (showTranslations = !showTranslations)}
				class="w-full flex items-center justify-between"
			>
				<h2 class="text-lg font-semibold text-gray-900">Übersetzungen</h2>
				<Icon
					name={showTranslations ? 'expand_less' : 'expand_more'}
					size={24}
					class="text-gray-400"
				/>
			</button>
			{#if showTranslations}
				<div class="mt-4 grid gap-4 sm:grid-cols-2">
					<div>
						<label for="nameDE" class="block text-sm font-medium text-gray-700 mb-1">
							Deutsch (DE)
						</label>
						<input
							id="nameDE"
							type="text"
							bind:value={nameDE}
							placeholder={name || 'Name auf Deutsch'}
							class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div>
						<label for="nameFR" class="block text-sm font-medium text-gray-700 mb-1">
							Französisch (FR)
						</label>
						<input
							id="nameFR"
							type="text"
							bind:value={nameFR}
							placeholder="Name auf Französisch"
							class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div>
						<label for="nameIT" class="block text-sm font-medium text-gray-700 mb-1">
							Italienisch (IT)
						</label>
						<input
							id="nameIT"
							type="text"
							bind:value={nameIT}
							placeholder="Name auf Italienisch"
							class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div>
						<label for="nameEN" class="block text-sm font-medium text-gray-700 mb-1">
							Englisch (EN)
						</label>
						<input
							id="nameEN"
							type="text"
							bind:value={nameEN}
							placeholder="Name auf Englisch"
							class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
				</div>
			{/if}
		</Card>

		<!-- Utility Cost Classification -->
		<Card>
			<h2 class="text-lg font-semibold text-gray-900 mb-4">Umlagefähigkeit</h2>

			<!-- Swiss Law Reference -->
			<div class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
				<div class="flex items-start gap-3">
					<Icon name="gavel" size={20} class="text-blue-500 flex-shrink-0 mt-0.5" />
					<div class="text-sm">
						<p class="font-medium text-blue-900 mb-1">Schweizer Mietrecht (Art. 257a-257b OR)</p>
						<p class="text-blue-700">
							Gemäss schweizerischem Mietrecht dürfen nur bestimmte Nebenkosten auf Mieter umgelegt
							werden. Dazu gehören insbesondere:
						</p>
						<ul class="mt-2 space-y-1 text-blue-700">
							<li class="flex items-center gap-1">
								<Icon name="check" size={14} class="text-green-600" />
								Heiz- und Warmwasserkosten
							</li>
							<li class="flex items-center gap-1">
								<Icon name="check" size={14} class="text-green-600" />
								Wasser- und Abwassergebühren
							</li>
							<li class="flex items-center gap-1">
								<Icon name="check" size={14} class="text-green-600" />
								Allgemeinstrom für Gemeinschaftsflächen
							</li>
							<li class="flex items-center gap-1">
								<Icon name="check" size={14} class="text-green-600" />
								Hauswart, Reinigung, Gartenpflege
							</li>
							<li class="flex items-center gap-1">
								<Icon name="check" size={14} class="text-green-600" />
								Aufzugbetrieb und -wartung
							</li>
							<li class="flex items-center gap-1">
								<Icon name="check" size={14} class="text-green-600" />
								Kehrichtabfuhr
							</li>
							<li class="flex items-center gap-1">
								<Icon name="check" size={14} class="text-green-600" />
								Verwaltungsgebühren (üblich bis 3%)
							</li>
						</ul>
						<p class="mt-2 text-blue-700">
							<strong>Nicht umlagefähig:</strong> Reparaturen, Versicherungen, Steuern,
							Hypothekenzinsen, Anschlussgebühren.
						</p>
					</div>
				</div>
			</div>

			<!-- Checkbox -->
			<div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
				<input
					id="isAllowedUtilityCost"
					type="checkbox"
					bind:checked={isAllowedUtilityCost}
					class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
				/>
				<div>
					<label for="isAllowedUtilityCost" class="font-medium text-gray-900 cursor-pointer">
						Umlagefähige Nebenkosten
					</label>
					<p class="text-sm text-gray-500">
						{#if isAllowedUtilityCost}
							Diese Kategorie enthält Kosten, die gemäss Art. 257a-257b OR auf Mieter umgelegt
							werden können.
						{:else}
							Diese Kategorie enthält Kosten, die <strong>nicht</strong> auf Mieter umgelegt werden dürfen.
						{/if}
					</p>
				</div>
			</div>

			{#if !isAllowedUtilityCost}
				<div class="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
					<Icon name="warning" size={18} class="text-amber-500 flex-shrink-0 mt-0.5" />
					<p class="text-sm text-amber-700">
						<strong>Hinweis:</strong> Rechnungen in dieser Kategorie werden bei der
						Nebenkostenabrechnung nicht berücksichtigt und können nicht auf Mieter übertragen werden.
					</p>
				</div>
			{/if}
		</Card>

		<!-- Actions -->
		<div class="flex items-center justify-end gap-3">
			<Button href="/config/categories" variant="secondary">Abbrechen</Button>
			<Button type="submit" variant="primary" disabled={isSubmitting}>
				{#if isSubmitting}
					<Icon name="progress_activity" size={20} class="animate-spin" />
					Wird erstellt...
				{:else}
					<Icon name="add" size={20} />
					Kategorie erstellen
				{/if}
			</Button>
		</div>
	</form>
</div>
