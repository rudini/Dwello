<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';

	const months = [
		{ key: 'january', label: 'Januar' },
		{ key: 'february', label: 'Februar' },
		{ key: 'march', label: 'März' },
		{ key: 'april', label: 'April' },
		{ key: 'may', label: 'Mai' },
		{ key: 'june', label: 'Juni' },
		{ key: 'july', label: 'Juli' },
		{ key: 'august', label: 'August' },
		{ key: 'september', label: 'September' },
		{ key: 'october', label: 'Oktober' },
		{ key: 'november', label: 'November' },
		{ key: 'december', label: 'Dezember' }
	] as const;

	// Form state
	let name = $state('');
	let description = $state('');
	let percentages = $state<Record<string, number>>({
		january: 15,
		february: 13,
		march: 10,
		april: 5,
		may: 0,
		june: 0,
		july: 0,
		august: 0,
		september: 2,
		october: 10,
		november: 15,
		december: 15
	});

	let errors = $state<Record<string, string>>({});
	let isSubmitting = $state(false);

	const total = $derived(Object.values(percentages).reduce((sum, val) => sum + val, 0));
	const isValidTotal = $derived(total >= 99 && total <= 101);
	const maxPercentage = $derived(Math.max(...Object.values(percentages)));

	function getBarHeight(value: number): number {
		if (maxPercentage === 0) return 0;
		return (value / maxPercentage) * 100;
	}

	function handlePercentageChange(key: string, event: Event) {
		const input = event.target as HTMLInputElement;
		const value = parseFloat(input.value) || 0;
		percentages = { ...percentages, [key]: Math.max(0, Math.min(100, value)) };
	}

	function applyPreset(preset: 'standard' | 'mittelland' | 'mountain' | 'tessin') {
		const presets = {
			standard: { january: 15, february: 13, march: 10, april: 5, may: 0, june: 0, july: 0, august: 0, september: 2, october: 10, november: 15, december: 15 },
			mittelland: { january: 18, february: 15, march: 12, april: 5, may: 0, june: 0, july: 0, august: 0, september: 0, october: 8, november: 12, december: 15 },
			mountain: { january: 16, february: 14, march: 12, april: 8, may: 3, june: 0, july: 0, august: 0, september: 3, october: 10, november: 14, december: 15 },
			tessin: { january: 20, february: 18, march: 12, april: 3, may: 0, june: 0, july: 0, august: 0, september: 0, october: 5, november: 12, december: 15 }
		};
		percentages = { ...presets[preset] };
	}

	function validate(): boolean {
		const newErrors: Record<string, string> = {};

		if (!name.trim()) {
			newErrors.name = 'Bitte geben Sie einen Namen ein';
		}

		if (!isValidTotal) {
			newErrors.total = 'Die Summe muss zwischen 99% und 101% liegen';
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

		console.log('Creating heating profile:', {
			name,
			description,
			monthlyPercentages: percentages
		});

		goto('/config/heating-profiles');
	}
</script>

<svelte:head>
	<title>Neues Heizprofil - Dwello</title>
</svelte:head>

<div class="max-w-4xl mx-auto space-y-6">
	<!-- Header -->
	<div class="flex items-center gap-4">
		<a
			href="/config/heating-profiles"
			class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
		>
			<Icon name="arrow_back" size={20} />
		</a>
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Neues Heizprofil</h1>
			<p class="text-gray-500 mt-1">Erstellen Sie ein benutzerdefiniertes Heizprofil</p>
		</div>
	</div>

	<form onsubmit={handleSubmit} class="space-y-6">
		<!-- Basic Info -->
		<Card>
			<h2 class="text-lg font-semibold text-gray-900 mb-4">Profil-Informationen</h2>
			<div class="grid gap-4 sm:grid-cols-2">
				<div>
					<label for="name" class="block text-sm font-medium text-gray-700 mb-1">
						Name <span class="text-red-500">*</span>
					</label>
					<input
						id="name"
						type="text"
						bind:value={name}
						placeholder="z.B. Mein Heizprofil"
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

		<!-- Presets -->
		<Card>
			<h2 class="text-lg font-semibold text-gray-900 mb-4">Vorlage verwenden</h2>
			<div class="flex flex-wrap gap-2">
				<Button type="button" variant="secondary" size="sm" onclick={() => applyPreset('standard')}>
					Standard
				</Button>
				<Button type="button" variant="secondary" size="sm" onclick={() => applyPreset('mittelland')}>
					Mittelland
				</Button>
				<Button type="button" variant="secondary" size="sm" onclick={() => applyPreset('mountain')}>
					Bergregion
				</Button>
				<Button type="button" variant="secondary" size="sm" onclick={() => applyPreset('tessin')}>
					Tessin
				</Button>
			</div>
		</Card>

		<!-- Monthly Percentages -->
		<Card>
			<div class="flex items-center justify-between mb-4">
				<h2 class="text-lg font-semibold text-gray-900">Monatliche Verteilung</h2>
				<div class="text-right">
					<p class="text-2xl font-bold {isValidTotal ? 'text-green-600' : 'text-amber-600'}">
						{total.toFixed(0)}%
					</p>
					<p class="text-xs text-gray-500">Summe (Ziel: 100%)</p>
				</div>
			</div>

			{#if errors.total}
				<div class="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
					<Icon name="warning" size={18} class="text-amber-500" />
					<span class="text-sm text-amber-700">{errors.total}</span>
				</div>
			{/if}

			<!-- Visual Chart -->
			<div class="h-40 flex items-end gap-1 mb-4 p-4 bg-gray-50 rounded-lg">
				{#each months as month}
					{@const value = percentages[month.key]}
					{@const height = getBarHeight(value)}
					<div class="flex-1 flex flex-col items-center gap-1">
						<span class="text-xs font-medium text-gray-600">{value}%</span>
						<div
							class="w-full rounded-t transition-all {value > 0 ? 'bg-orange-400' : 'bg-gray-200'}"
							style="height: {height}%"
						></div>
						<span class="text-xs text-gray-500">{month.label.slice(0, 3)}</span>
					</div>
				{/each}
			</div>

			<!-- Input Grid -->
			<div class="grid gap-3 sm:grid-cols-4 lg:grid-cols-6">
				{#each months as month}
					<div>
						<label for={month.key} class="block text-xs font-medium text-gray-700 mb-1">
							{month.label}
						</label>
						<div class="relative">
							<input
								id={month.key}
								type="number"
								step="0.5"
								min="0"
								max="100"
								value={percentages[month.key]}
								oninput={(e) => handlePercentageChange(month.key, e)}
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
							/>
							<span class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
						</div>
					</div>
				{/each}
			</div>
		</Card>

		<!-- Info -->
		<Card>
			<div class="flex items-start gap-3">
				<Icon name="info" size={24} class="text-blue-500 flex-shrink-0" />
				<div class="text-sm text-gray-600">
					<p class="font-medium text-gray-900 mb-1">Hinweis zur Heizverteilung</p>
					<p>
						Die Summe aller Monatsprozente sollte genau 100% ergeben. Bei der Abrechnung werden
						Heizkosten entsprechend dieser Verteilung auf die Monate aufgeteilt. Dies ermöglicht
						eine faire Berechnung bei Mieterwechseln während der Heizperiode.
					</p>
				</div>
			</div>
		</Card>

		<!-- Actions -->
		<div class="flex items-center justify-end gap-3">
			<Button href="/config/heating-profiles" variant="secondary">Abbrechen</Button>
			<Button type="submit" variant="primary" disabled={isSubmitting}>
				{#if isSubmitting}
					<Icon name="progress_activity" size={20} class="animate-spin" />
					Wird erstellt...
				{:else}
					<Icon name="add" size={20} />
					Profil erstellen
				{/if}
			</Button>
		</div>
	</form>
</div>
