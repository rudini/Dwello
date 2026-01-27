<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';

	// Form state
	let name = $state('');
	let description = $state('');
	let formula = $state('{area}');

	let errors = $state<Record<string, string>>({});
	let isSubmitting = $state(false);
	let testResults = $state<{ apartment: string; share: number; percentage: number }[] | null>(null);

	const formulaVariables = [
		{ name: 'area', display: '{area}', description: 'Wohnfläche (m²)', icon: 'square_foot' },
		{ name: 'rooms', display: '{rooms}', description: 'Zimmeranzahl', icon: 'meeting_room' },
		{ name: 'persons', display: '{persons}', description: 'Personenanzahl', icon: 'people' },
		{ name: 'volume', display: '{volume}', description: 'Raumvolumen (m³)', icon: 'view_in_ar' },
		{ name: 'units', display: '{units}', description: 'Einheit (=1)', icon: 'home' }
	];

	const testApartments = [
		{ name: 'Wohnung 1.01', area: 65, rooms: 3, persons: 2, volume: 175, units: 1 },
		{ name: 'Wohnung 1.02', area: 85, rooms: 4, persons: 4, volume: 230, units: 1 },
		{ name: 'Wohnung 2.01', area: 55, rooms: 2.5, persons: 1, volume: 150, units: 1 },
		{ name: 'Wohnung 2.02', area: 95, rooms: 4.5, persons: 3, volume: 255, units: 1 }
	];

	function insertVariable(variable: string) {
		formula = formula + `{${variable}}`;
	}

	function evaluateFormula(apt: typeof testApartments[0]): number {
		try {
			let expr = formula
				.replace(/\{area\}/g, apt.area.toString())
				.replace(/\{rooms\}/g, apt.rooms.toString())
				.replace(/\{persons\}/g, apt.persons.toString())
				.replace(/\{volume\}/g, apt.volume.toString())
				.replace(/\{units\}/g, apt.units.toString());

			// Simple evaluation (only supports +, -, *, /, numbers)
			// In production, use a proper expression parser
			if (!/^[\d\s+\-*/().]+$/.test(expr)) {
				return 0;
			}
			return eval(expr) as number;
		} catch {
			return 0;
		}
	}

	function testFormula() {
		const results = testApartments.map((apt) => ({
			apartment: apt.name,
			share: evaluateFormula(apt)
		}));

		const total = results.reduce((sum, r) => sum + r.share, 0);

		testResults = results.map((r) => ({
			...r,
			percentage: total > 0 ? (r.share / total) * 100 : 0
		}));
	}

	function validate(): boolean {
		const newErrors: Record<string, string> = {};

		if (!name.trim()) {
			newErrors.name = 'Bitte geben Sie einen Namen ein';
		}

		if (!formula.trim()) {
			newErrors.formula = 'Bitte geben Sie eine Formel ein';
		} else {
			// Test if formula is valid
			try {
				const testValue = evaluateFormula(testApartments[0]);
				if (isNaN(testValue)) {
					newErrors.formula = 'Die Formel ist ungültig';
				}
			} catch {
				newErrors.formula = 'Die Formel enthält einen Syntaxfehler';
			}
		}

		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (!validate()) return;

		isSubmitting = true;

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		console.log('Creating distribution key:', {
			name,
			description,
			formula
		});

		goto('/config/distribution-keys');
	}
</script>

<svelte:head>
	<title>Neuer Verteilschlüssel - Dwello</title>
</svelte:head>

<div class="max-w-4xl mx-auto space-y-6">
	<!-- Header -->
	<div class="flex items-center gap-4">
		<a
			href="/config/distribution-keys"
			class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
		>
			<Icon name="arrow_back" size={20} />
		</a>
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Neuer Verteilschlüssel</h1>
			<p class="text-gray-500 mt-1">Erstellen Sie einen benutzerdefinierten Verteilschlüssel</p>
		</div>
	</div>

	<form onsubmit={handleSubmit} class="space-y-6">
		<!-- Basic Info -->
		<Card>
			<h2 class="text-lg font-semibold text-gray-900 mb-4">Schlüssel-Informationen</h2>
			<div class="grid gap-4 sm:grid-cols-2">
				<div>
					<label for="name" class="block text-sm font-medium text-gray-700 mb-1">
						Name <span class="text-red-500">*</span>
					</label>
					<input
						id="name"
						type="text"
						bind:value={name}
						placeholder="z.B. Mein Verteilschlüssel"
						class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 {errors.name
							? 'border-red-500'
							: 'border-gray-300'}"
					/>
					{#if errors.name}
						<p class="mt-1 text-sm text-red-500">{errors.name}</p>
					{/if}
				</div>
				<div>
					<label for="description" class="block text-sm font-medium text-gray-700 mb-1">
						Beschreibung
					</label>
					<input
						id="description"
						type="text"
						bind:value={description}
						placeholder="Optionale Beschreibung"
						class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>
			</div>
		</Card>

		<!-- Formula Builder -->
		<Card>
			<h2 class="text-lg font-semibold text-gray-900 mb-4">Formel</h2>

			<!-- Variable Buttons -->
			<div class="mb-4">
				<p class="text-sm text-gray-600 mb-2">Variablen einfügen:</p>
				<div class="flex flex-wrap gap-2">
					{#each formulaVariables as variable}
						<button
							type="button"
							onclick={() => insertVariable(variable.name)}
							class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg text-sm font-mono text-purple-700 hover:bg-purple-100 transition-colors"
						>
							<Icon name={variable.icon} size={16} />
							{variable.display}
						</button>
					{/each}
				</div>
			</div>

			<!-- Formula Input -->
			<div class="mb-4">
				<label for="formula" class="block text-sm font-medium text-gray-700 mb-1">
					Formel <span class="text-red-500">*</span>
				</label>
				<input
					id="formula"
					type="text"
					bind:value={formula}
					placeholder="z.B. {'{area}'} * 0.7 + {'{rooms}'} * 0.3"
					class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-lg {errors.formula
						? 'border-red-500'
						: 'border-gray-300'}"
				/>
				{#if errors.formula}
					<p class="mt-1 text-sm text-red-500">{errors.formula}</p>
				{/if}
				<p class="mt-1 text-xs text-gray-500">
					Verwenden Sie +, -, *, / und Klammern für Berechnungen
				</p>
			</div>

			<!-- Test Button -->
			<Button type="button" variant="secondary" onclick={testFormula}>
				<Icon name="science" size={20} />
				Formel testen
			</Button>

			<!-- Test Results -->
			{#if testResults}
				<div class="mt-4 p-4 bg-gray-50 rounded-lg">
					<h3 class="font-medium text-gray-900 mb-3">Testergebnis</h3>
					<div class="overflow-x-auto">
						<table class="w-full text-sm">
							<thead>
								<tr class="text-left text-gray-500 border-b">
									<th class="pb-2">Wohnung</th>
									<th class="pb-2 text-right">Wert</th>
									<th class="pb-2 text-right">Anteil</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-200">
								{#each testResults as result}
									<tr>
										<td class="py-2 text-gray-900">{result.apartment}</td>
										<td class="py-2 text-right font-mono">{result.share.toFixed(2)}</td>
										<td class="py-2 text-right font-medium text-blue-600">
											{result.percentage.toFixed(1)}%
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
					<p class="mt-3 text-xs text-gray-500">
						Testwohnungen: 65m²/3Zi, 85m²/4Zi, 55m²/2.5Zi, 95m²/4.5Zi
					</p>
				</div>
			{/if}
		</Card>

		<!-- Variable Reference -->
		<Card>
			<h2 class="text-lg font-semibold text-gray-900 mb-4">Variablen-Referenz</h2>
			<div class="grid gap-3 sm:grid-cols-2">
				{#each formulaVariables as variable}
					<div class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
						<Icon name={variable.icon} size={20} class="text-purple-600 mt-0.5" />
						<div>
							<code class="text-sm font-mono text-purple-700">{variable.display}</code>
							<p class="text-sm text-gray-600">{variable.description}</p>
						</div>
					</div>
				{/each}
			</div>
		</Card>

		<!-- Actions -->
		<div class="flex items-center justify-end gap-3">
			<Button href="/config/distribution-keys" variant="secondary">Abbrechen</Button>
			<Button type="submit" variant="primary" disabled={isSubmitting}>
				{#if isSubmitting}
					<Icon name="progress_activity" size={20} class="animate-spin" />
					Wird erstellt...
				{:else}
					<Icon name="add" size={20} />
					Schlüssel erstellen
				{/if}
			</Button>
		</div>
	</form>
</div>
