<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';

	// Get pre-filled tenant or apartment from URL
	const prefilledTenant = $page.url.searchParams.get('tenant') || '';
	const prefilledApartment = $page.url.searchParams.get('apartment') || '';

	// Mock data for dropdowns
	const tenants = [
		{ id: 'tenant-001', name: 'Hans Müller' },
		{ id: 'tenant-002', name: 'Maria Schmidt' },
		{ id: 'tenant-003', name: 'Peter Weber' },
		{ id: 'tenant-004', name: 'Anna Keller' },
		{ id: 'tenant-005', name: 'Thomas Brunner' },
		{ id: 'tenant-006', name: 'Sarah Fischer' },
		{ id: 'tenant-007', name: 'Kevin Meier' }
	];

	const apartments = [
		{ id: 'apt-001', unit: '2.04', building: 'Musterhaus Zentrum', status: 'Vermietet' },
		{ id: 'apt-002', unit: '1.02', building: 'Musterhaus Zentrum', status: 'Vermietet' },
		{ id: 'apt-003', unit: '0.01', building: 'Musterhaus Zentrum', status: 'Leer' },
		{ id: 'apt-004', unit: '3.01', building: 'Seepark Residenz', status: 'Vermietet' },
		{ id: 'apt-005', unit: '2.02', building: 'Seepark Residenz', status: 'Vermietet' },
		{ id: 'apt-006', unit: '1.01', building: 'Seepark Residenz', status: 'Leer' }
	];

	// Form state
	let tenantId = $state(prefilledTenant);
	let apartmentId = $state(prefilledApartment);
	let startDate = $state('');
	let endDate = $state('');
	let baseRent = $state('');
	let additionalRent = $state('');
	let advancePayment = $state('');
	let isUnlimited = $state(true);

	let isSubmitting = $state(false);
	let errors = $state<Record<string, string>>({});

	// Derived total
	const totalRent = $derived.by(() => {
		const base = parseFloat(baseRent) || 0;
		const additional = parseFloat(additionalRent) || 0;
		const advance = parseFloat(advancePayment) || 0;
		return base + additional + advance;
	});

	function validate(): boolean {
		const newErrors: Record<string, string> = {};

		if (!tenantId) {
			newErrors.tenantId = 'Bitte wählen Sie einen Mieter aus';
		}
		if (!apartmentId) {
			newErrors.apartmentId = 'Bitte wählen Sie eine Wohnung aus';
		}
		if (!startDate) {
			newErrors.startDate = 'Vertragsbeginn ist erforderlich';
		}
		if (!isUnlimited && !endDate) {
			newErrors.endDate = 'Vertragsende ist erforderlich bei befristetem Vertrag';
		}
		if (!isUnlimited && endDate && startDate && new Date(endDate) <= new Date(startDate)) {
			newErrors.endDate = 'Vertragsende muss nach Vertragsbeginn liegen';
		}
		if (!baseRent) {
			newErrors.baseRent = 'Nettomiete ist erforderlich';
		} else if (isNaN(parseFloat(baseRent)) || parseFloat(baseRent) <= 0) {
			newErrors.baseRent = 'Bitte geben Sie eine gültige Miete ein';
		}
		if (additionalRent && (isNaN(parseFloat(additionalRent)) || parseFloat(additionalRent) < 0)) {
			newErrors.additionalRent = 'Bitte geben Sie einen gültigen Betrag ein';
		}
		if (advancePayment && (isNaN(parseFloat(advancePayment)) || parseFloat(advancePayment) < 0)) {
			newErrors.advancePayment = 'Bitte geben Sie einen gültigen Betrag ein';
		}

		// Check if apartment is available
		const selectedApartment = apartments.find((a) => a.id === apartmentId);
		if (selectedApartment && selectedApartment.status === 'Vermietet') {
			newErrors.apartmentId = 'Diese Wohnung ist bereits vermietet';
		}

		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();

		if (!validate()) return;

		isSubmitting = true;

		try {
			// In production, call the API
			// const response = await fetch('/api/contracts', {
			// 	method: 'POST',
			// 	headers: { 'Content-Type': 'application/json' },
			// 	body: JSON.stringify({
			// 		tenant_id: tenantId,
			// 		apartment_id: apartmentId,
			// 		start_date: startDate,
			// 		end_date: isUnlimited ? null : endDate,
			// 		base_rent_chf: parseFloat(baseRent),
			// 		additional_rent_chf: parseFloat(additionalRent) || 0,
			// 		advance_payment_chf: parseFloat(advancePayment) || 0
			// 	})
			// });

			// Mock success
			await new Promise((r) => setTimeout(r, 500));
			await goto('/contracts');
		} catch (error) {
			console.error('Error creating contract:', error);
			errors = { form: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.' };
		} finally {
			isSubmitting = false;
		}
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('de-CH', {
			style: 'currency',
			currency: 'CHF',
			minimumFractionDigits: 2
		}).format(amount);
	}
</script>

<svelte:head>
	<title>Neuer Mietvertrag - Dwello</title>
</svelte:head>

<div class="max-w-2xl mx-auto space-y-6">
	<!-- Breadcrumb -->
	<nav class="flex items-center text-sm text-gray-500">
		<a href="/contracts" class="hover:text-primary transition-colors">Mietverträge</a>
		<Icon name="chevron_right" size={16} class="mx-2" />
		<span class="text-gray-900 font-medium">Neuer Vertrag</span>
	</nav>

	<!-- Header -->
	<div>
		<h1 class="text-2xl font-bold text-gray-900">Neuen Mietvertrag erstellen</h1>
		<p class="text-gray-500 mt-1">Erstellen Sie einen neuen Mietvertrag zwischen Mieter und Wohnung.</p>
	</div>

	<!-- Form -->
	<Card>
		<form onsubmit={handleSubmit} class="space-y-6">
			{#if errors.form}
				<div class="bg-red-50 border border-red-200 rounded-lg p-4">
					<p class="text-sm text-red-700">{errors.form}</p>
				</div>
			{/if}

			<!-- Tenant Selection -->
			<div>
				<label for="tenant" class="block text-sm font-medium text-gray-700 mb-1">
					Mieter <span class="text-red-500">*</span>
				</label>
				<select
					id="tenant"
					bind:value={tenantId}
					class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white {errors.tenantId
						? 'border-red-500'
						: 'border-gray-300'}"
				>
					<option value="">Mieter auswählen...</option>
					{#each tenants as tenant}
						<option value={tenant.id}>{tenant.name}</option>
					{/each}
				</select>
				{#if errors.tenantId}
					<p class="mt-1 text-sm text-red-600">{errors.tenantId}</p>
				{/if}
			</div>

			<!-- Apartment Selection -->
			<div>
				<label for="apartment" class="block text-sm font-medium text-gray-700 mb-1">
					Wohnung <span class="text-red-500">*</span>
				</label>
				<select
					id="apartment"
					bind:value={apartmentId}
					class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white {errors.apartmentId
						? 'border-red-500'
						: 'border-gray-300'}"
				>
					<option value="">Wohnung auswählen...</option>
					{#each apartments as apt}
						<option value={apt.id} disabled={apt.status === 'Vermietet'}>
							Wohnung {apt.unit} - {apt.building}
							{#if apt.status === 'Vermietet'}(vermietet){/if}
							{#if apt.status === 'Leer'}(verfügbar){/if}
						</option>
					{/each}
				</select>
				{#if errors.apartmentId}
					<p class="mt-1 text-sm text-red-600">{errors.apartmentId}</p>
				{/if}
			</div>

			<!-- Contract Period -->
			<div class="border-t border-gray-200 pt-6">
				<h3 class="text-sm font-medium text-gray-700 mb-4">Vertragszeitraum</h3>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
					<div>
						<label for="startDate" class="block text-sm font-medium text-gray-700 mb-1">
							Vertragsbeginn <span class="text-red-500">*</span>
						</label>
						<input
							id="startDate"
							type="date"
							bind:value={startDate}
							class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary {errors.startDate
								? 'border-red-500'
								: 'border-gray-300'}"
						/>
						{#if errors.startDate}
							<p class="mt-1 text-sm text-red-600">{errors.startDate}</p>
						{/if}
					</div>
					<div>
						<label for="endDate" class="block text-sm font-medium text-gray-700 mb-1">
							Vertragsende {#if !isUnlimited}<span class="text-red-500">*</span>{/if}
						</label>
						<input
							id="endDate"
							type="date"
							bind:value={endDate}
							disabled={isUnlimited}
							class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary {errors.endDate
								? 'border-red-500'
								: 'border-gray-300'} {isUnlimited ? 'bg-gray-50 text-gray-400' : ''}"
						/>
						{#if errors.endDate}
							<p class="mt-1 text-sm text-red-600">{errors.endDate}</p>
						{/if}
					</div>
				</div>

				<label class="flex items-center gap-2 cursor-pointer">
					<input
						type="checkbox"
						bind:checked={isUnlimited}
						class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
					/>
					<span class="text-sm text-gray-700">Unbefristeter Vertrag</span>
				</label>
			</div>

			<!-- Rent -->
			<div class="border-t border-gray-200 pt-6">
				<h3 class="text-sm font-medium text-gray-700 mb-4">Mietzins</h3>

				<div class="space-y-4">
					<div>
						<label for="baseRent" class="block text-sm font-medium text-gray-700 mb-1">
							Nettomiete (CHF) <span class="text-red-500">*</span>
						</label>
						<div class="relative">
							<span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">CHF</span>
							<input
								id="baseRent"
								type="number"
								step="0.01"
								min="0"
								bind:value={baseRent}
								placeholder="2100.00"
								class="w-full pl-14 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary {errors.baseRent
									? 'border-red-500'
									: 'border-gray-300'}"
							/>
						</div>
						{#if errors.baseRent}
							<p class="mt-1 text-sm text-red-600">{errors.baseRent}</p>
						{/if}
					</div>

					<div>
						<label for="additionalRent" class="block text-sm font-medium text-gray-700 mb-1">
							Nebenkosten Akonto (CHF) <span class="text-gray-400">(optional)</span>
						</label>
						<div class="relative">
							<span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">CHF</span>
							<input
								id="additionalRent"
								type="number"
								step="0.01"
								min="0"
								bind:value={additionalRent}
								placeholder="250.00"
								class="w-full pl-14 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary {errors.additionalRent
									? 'border-red-500'
									: 'border-gray-300'}"
							/>
						</div>
						{#if errors.additionalRent}
							<p class="mt-1 text-sm text-red-600">{errors.additionalRent}</p>
						{/if}
					</div>

					<div>
						<label for="advancePayment" class="block text-sm font-medium text-gray-700 mb-1">
							Parkplatz / Sonstiges (CHF) <span class="text-gray-400">(optional)</span>
						</label>
						<div class="relative">
							<span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">CHF</span>
							<input
								id="advancePayment"
								type="number"
								step="0.01"
								min="0"
								bind:value={advancePayment}
								placeholder="120.00"
								class="w-full pl-14 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary {errors.advancePayment
									? 'border-red-500'
									: 'border-gray-300'}"
							/>
						</div>
						{#if errors.advancePayment}
							<p class="mt-1 text-sm text-red-600">{errors.advancePayment}</p>
						{/if}
					</div>
				</div>

				<!-- Total Preview -->
				{#if totalRent > 0}
					<div class="mt-4 p-4 bg-gray-50 rounded-lg">
						<div class="flex justify-between items-center">
							<span class="font-medium text-gray-700">Total Bruttomiete</span>
							<span class="text-xl font-bold text-primary">{formatCurrency(totalRent)}</span>
						</div>
					</div>
				{/if}
			</div>

			<!-- Actions -->
			<div class="flex gap-3 pt-4 border-t border-gray-200">
				<Button href="/contracts" variant="secondary">Abbrechen</Button>
				<Button type="submit" variant="primary" disabled={isSubmitting}>
					{#if isSubmitting}
						<span class="animate-spin">
							<Icon name="refresh" size={18} />
						</span>
						Wird erstellt...
					{:else}
						<Icon name="add" size={18} />
						Vertrag erstellen
					{/if}
				</Button>
			</div>
		</form>
	</Card>
</div>
