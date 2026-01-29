<script lang="ts">
	import type { ConfigPageData, AccountingPeriod } from '$lib/types';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';

	let { data }: { data: ConfigPageData } = $props();

	// Form state - capture initial values
	// svelte-ignore state_referenced_locally
	const initial = data.config;
	let accountingPeriod = $state<AccountingPeriod>(initial.accountingPeriod);
	let managementFeePercentage = $state(initial.managementFeePercentage.toString());
	let defaultHeatingProfileId = $state(initial.defaultHeatingProfileId || '');
	let defaultDistributionKeyId = $state(initial.defaultDistributionKeyId || '');
	let companyName = $state(initial.companyName || '');
	let companyAddress = $state(initial.companyAddress || '');
	let iban = $state(initial.iban || '');

	let errors = $state<Record<string, string>>({});
	let isSubmitting = $state(false);
	let showSuccess = $state(false);

	const hasChanges = $derived.by(() => {
		return (
			accountingPeriod !== initial.accountingPeriod ||
			managementFeePercentage !== initial.managementFeePercentage.toString() ||
			defaultHeatingProfileId !== (initial.defaultHeatingProfileId || '') ||
			defaultDistributionKeyId !== (initial.defaultDistributionKeyId || '') ||
			companyName !== (initial.companyName || '') ||
			companyAddress !== (initial.companyAddress || '') ||
			iban !== (initial.iban || '')
		);
	});

	const accountingPeriodOptions = [
		{ value: 'calendar', label: 'Kalenderjahr (Jan - Dez)' },
		{ value: 'july-june', label: 'Juli - Juni' },
		{ value: 'october-september', label: 'Oktober - September' }
	];

	// Calculate total percentage for a heating profile
	function getProfileTotal(profile: typeof data.heatingProfiles[0]): number {
		return Object.values(profile.monthlyPercentages).reduce((sum, val) => sum + val, 0);
	}

	function validate(): boolean {
		const newErrors: Record<string, string> = {};

		const fee = parseFloat(managementFeePercentage);
		if (isNaN(fee) || fee < 0 || fee > 3) {
			newErrors.managementFeePercentage = 'Die Verwaltungsgebühr muss zwischen 0% und 3% liegen';
		}

		if (iban && !validateIBAN(iban)) {
			newErrors.iban = 'Bitte geben Sie eine gültige Schweizer IBAN ein';
		}

		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	function validateIBAN(value: string): boolean {
		const cleaned = value.replace(/\s/g, '').toUpperCase();
		return /^CH\d{2}\d{4}\d{4}\d{4}\d{4}\d$/.test(cleaned) ||
		       /^CH\d{2}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d$/.test(value.toUpperCase());
	}

	function formatIBAN(value: string): string {
		const cleaned = value.replace(/\s/g, '').toUpperCase();
		const groups = cleaned.match(/.{1,4}/g);
		return groups ? groups.join(' ') : value;
	}

	function handleIBANInput(event: Event) {
		const input = event.target as HTMLInputElement;
		iban = formatIBAN(input.value);
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (!validate()) return;

		isSubmitting = true;

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		console.log('Saving configuration:', {
			accountingPeriod,
			managementFeePercentage: parseFloat(managementFeePercentage),
			defaultHeatingProfileId,
			defaultDistributionKeyId,
			companyName,
			companyAddress,
			iban
		});

		isSubmitting = false;
		showSuccess = true;
		setTimeout(() => (showSuccess = false), 3000);
	}

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleString('de-CH');
	}
</script>

<svelte:head>
	<title>Einstellungen - Dwello</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Einstellungen</h1>
			<p class="text-gray-500 mt-1">Systemkonfiguration und Standardwerte</p>
		</div>
		{#if data.config.updatedAt}
			<p class="text-sm text-gray-500">
				Zuletzt geändert: {formatDate(data.config.updatedAt)}
			</p>
		{/if}
	</div>

	<!-- Success Message -->
	{#if showSuccess}
		<div class="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
			<Icon name="check_circle" size={20} class="text-green-500" />
			<span class="text-green-700">Einstellungen wurden erfolgreich gespeichert.</span>
		</div>
	{/if}

	<form onsubmit={handleSubmit} class="space-y-6">
		<!-- Quick Links -->
		<div class="grid gap-4 sm:grid-cols-3">
			<a
				href="/config/categories"
				class="p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all flex items-center gap-4"
			>
				<div class="p-3 bg-blue-100 rounded-lg">
					<Icon name="category" size={24} class="text-blue-600" />
				</div>
				<div>
					<h3 class="font-medium text-gray-900">Kategorien</h3>
					<p class="text-sm text-gray-500">Kostenkategorien verwalten</p>
				</div>
			</a>
			<a
				href="/config/heating-profiles"
				class="p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all flex items-center gap-4"
			>
				<div class="p-3 bg-orange-100 rounded-lg">
					<Icon name="local_fire_department" size={24} class="text-orange-600" />
				</div>
				<div>
					<h3 class="font-medium text-gray-900">Heizprofile</h3>
					<p class="text-sm text-gray-500">Heizverteilung konfigurieren</p>
				</div>
			</a>
			<a
				href="/config/distribution-keys"
				class="p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all flex items-center gap-4"
			>
				<div class="p-3 bg-purple-100 rounded-lg">
					<Icon name="calculate" size={24} class="text-purple-600" />
				</div>
				<div>
					<h3 class="font-medium text-gray-900">Verteilschlüssel</h3>
					<p class="text-sm text-gray-500">Kostenverteilung definieren</p>
				</div>
			</a>
		</div>

		<!-- Company Info -->
		<Card>
			<h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
				<Icon name="business" size={20} class="text-gray-400" />
				Unternehmensdaten
			</h2>
			<div class="grid gap-4 sm:grid-cols-2">
				<div class="sm:col-span-2">
					<label for="companyName" class="block text-sm font-medium text-gray-700 mb-1">
						Firmenname
					</label>
					<input
						id="companyName"
						type="text"
						bind:value={companyName}
						placeholder="z.B. Muster Immobilien AG"
						class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>
				<div class="sm:col-span-2">
					<label for="companyAddress" class="block text-sm font-medium text-gray-700 mb-1">
						Adresse
					</label>
					<input
						id="companyAddress"
						type="text"
						bind:value={companyAddress}
						placeholder="z.B. Bahnhofstrasse 1, 8001 Zürich"
						class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>
				<div class="sm:col-span-2">
					<label for="iban" class="block text-sm font-medium text-gray-700 mb-1">
						IBAN (für QR-Rechnungen)
					</label>
					<input
						id="iban"
						type="text"
						value={iban}
						oninput={handleIBANInput}
						placeholder="CH93 0076 2011 6238 5295 7"
						class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono {errors.iban
							? 'border-red-500'
							: 'border-gray-300'}"
					/>
					{#if errors.iban}
						<p class="mt-1 text-sm text-red-500">{errors.iban}</p>
					{/if}
					<p class="mt-1 text-xs text-gray-500">
						Schweizer IBAN für die Generierung von QR-Rechnungen
					</p>
				</div>
			</div>
		</Card>

		<!-- Accounting Settings -->
		<Card>
			<h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
				<Icon name="calendar_month" size={20} class="text-gray-400" />
				Abrechnungseinstellungen
			</h2>
			<div class="grid gap-4 sm:grid-cols-2">
				<div>
					<label for="accountingPeriod" class="block text-sm font-medium text-gray-700 mb-1">
						Abrechnungsperiode
					</label>
					<select
						id="accountingPeriod"
						bind:value={accountingPeriod}
						class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						{#each accountingPeriodOptions as option}
							<option value={option.value}>{option.label}</option>
						{/each}
					</select>
					<p class="mt-1 text-xs text-gray-500">
						Zeitraum für die Nebenkostenabrechnung
					</p>
				</div>
				<div>
					<label for="managementFee" class="block text-sm font-medium text-gray-700 mb-1">
						Verwaltungsgebühr (%)
					</label>
					<div class="relative">
						<input
							id="managementFee"
							type="number"
							step="0.1"
							min="0"
							max="3"
							bind:value={managementFeePercentage}
							class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 {errors.managementFeePercentage
								? 'border-red-500'
								: 'border-gray-300'}"
						/>
						<span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
					</div>
					{#if errors.managementFeePercentage}
						<p class="mt-1 text-sm text-red-500">{errors.managementFeePercentage}</p>
					{/if}
					<p class="mt-1 text-xs text-gray-500">
						Maximal 3% gemäss schweizerischem Mietrecht
					</p>
				</div>
			</div>
		</Card>

		<!-- Default Values -->
		<Card>
			<h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
				<Icon name="tune" size={20} class="text-gray-400" />
				Standardwerte
			</h2>
			<div class="grid gap-4 sm:grid-cols-2">
				<div>
					<label for="heatingProfile" class="block text-sm font-medium text-gray-700 mb-1">
						Standard-Heizprofil
					</label>
					<select
						id="heatingProfile"
						bind:value={defaultHeatingProfileId}
						class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="">Kein Standard</option>
						{#each data.heatingProfiles as profile}
							{@const total = getProfileTotal(profile)}
							{@const isValid = total === 100}
							<option value={profile.id} disabled={!isValid}>
								{profile.name} ({total}%){isValid ? '' : ' - nicht wählbar'}
							</option>
						{/each}
					</select>
					<p class="mt-1 text-xs text-gray-500">
						Wird für neue Abrechnungen vorausgewählt. Nur Profile mit exakt 100% Summe sind wählbar.
					</p>
				</div>
				<div>
					<label for="distributionKey" class="block text-sm font-medium text-gray-700 mb-1">
						Standard-Verteilschlüssel
					</label>
					<select
						id="distributionKey"
						bind:value={defaultDistributionKeyId}
						class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="">Kein Standard</option>
						{#each data.distributionKeys as key}
							<option value={key.id}>{key.name}</option>
						{/each}
					</select>
					<p class="mt-1 text-xs text-gray-500">
						Wird für neue Rechnungen vorausgewählt
					</p>
				</div>
			</div>
		</Card>

		<!-- Swiss Law Info -->
		<Card>
			<div class="flex items-start gap-3">
				<Icon name="gavel" size={24} class="text-blue-500 flex-shrink-0" />
				<div>
					<h3 class="font-medium text-gray-900 mb-1">Schweizer Mietrecht</h3>
					<p class="text-sm text-gray-600">
						Die Verwaltungsgebühr ist gemäss Art. 257b OR auf maximal 3% der umlagefähigen
						Nebenkosten beschränkt. Diese Gebühr deckt den administrativen Aufwand für die
						Erstellung der Nebenkostenabrechnung.
					</p>
				</div>
			</div>
		</Card>

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
			<Button type="submit" variant="primary" disabled={isSubmitting || !hasChanges}>
				{#if isSubmitting}
					<Icon name="progress_activity" size={20} class="animate-spin" />
					Wird gespeichert...
				{:else}
					<Icon name="check" size={20} />
					Einstellungen speichern
				{/if}
			</Button>
		</div>
	</form>
</div>
