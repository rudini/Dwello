<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';
	import { apiCall } from '$lib/api';
	import type { RentalContract } from '$lib/types';

	interface PageData {
		contract: RentalContract;
		tenants: { id: string; name: string }[];
		apartments: { id: string; unit: string; building: string; status: string }[];
	}

	let { data }: { data: PageData } = $props();

	// Helper to format date for input
	function formatDateForInput(dateStr: string | Date | undefined): string {
		if (!dateStr) return '';
		const date = new Date(dateStr);
		return date.toISOString().split('T')[0];
	}

	// Form state - using functions to capture initial values
	// This pattern is intentional for edit forms where we want initial snapshot
	let tenantId = $state((() => data.contract.tenant_id)());
	let apartmentId = $state((() => data.contract.apartment_id)());
	let startDate = $state((() => formatDateForInput(data.contract.start_date))());
	let endDate = $state((() => formatDateForInput(data.contract.end_date))());
	let baseRent = $state((() => data.contract.base_rent_chf.toString())());
	let additionalRent = $state((() => data.contract.additional_rent_chf?.toString() || '')());
	let advancePayment = $state((() => data.contract.advance_payment_chf?.toString() || '')());
	let isUnlimited = $state((() => !data.contract.end_date)());

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

		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();

		if (!validate()) return;

		isSubmitting = true;

		try {
			// Backend expects string values for decimal fields
			const response = await apiCall(`/contracts/${data.contract.id}`, {
				method: 'PUT',
				body: {
					tenantId: tenantId,
					apartmentId: apartmentId,
					startDate: startDate,
					endDate: isUnlimited ? null : endDate,
					baseRent: String(baseRent),
					additionalRent: String(additionalRent || 0),
					monthlyAdvancePayment: String(advancePayment || 0)
				}
			});

			if (response.error) {
				errors = { form: response.error.message || 'Ein Fehler ist aufgetreten' };
				return;
			}

			await goto(`/contracts/${data.contract.id}`);
		} catch (error) {
			console.error('Error updating contract:', error);
			const message = error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten';
			errors = { form: message };
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
	<title>Mietvertrag bearbeiten - Dwello</title>
</svelte:head>

<div class="max-w-2xl mx-auto space-y-6">
	<!-- Breadcrumb -->
	<nav class="flex items-center text-sm text-gray-500">
		<a href="/contracts" class="hover:text-primary transition-colors">Mietverträge</a>
		<Icon name="chevron_right" size={16} class="mx-2" />
		<a href="/contracts/{data.contract.id}" class="hover:text-primary transition-colors">
			Vertrag
		</a>
		<Icon name="chevron_right" size={16} class="mx-2" />
		<span class="text-gray-900 font-medium">Bearbeiten</span>
	</nav>

	<!-- Header -->
	<div>
		<h1 class="text-2xl font-bold text-gray-900">Mietvertrag bearbeiten</h1>
		<p class="text-gray-500 mt-1">Ändern Sie die Vertragsdaten.</p>
	</div>

	<!-- Form -->
	<Card>
		<form onsubmit={handleSubmit} class="space-y-6">
			{#if errors.form}
				<div class="bg-red-50 border border-red-200 rounded-lg p-4">
					<p class="text-sm text-red-700">{errors.form}</p>
				</div>
			{/if}

			<!-- Warning for active contract -->
			{#if data.contract.status === 'Aktiv'}
				<div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
					<div class="flex items-start gap-3">
						<Icon name="warning" size={20} class="text-amber-600 mt-0.5" />
						<div class="text-sm text-amber-800">
							<p class="font-medium">Aktiver Vertrag</p>
							<p class="mt-1">
								Änderungen an einem aktiven Vertrag werden sofort wirksam. Bei Mietanpassungen
								sollten Sie die gesetzlichen Kündigungsfristen beachten.
							</p>
						</div>
					</div>
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
					{#each data.tenants as tenant}
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
					{#each data.apartments as apt}
						<option
							value={apt.id}
							disabled={apt.status === 'Vermietet' && apt.id !== data.contract.apartment_id}
						>
							Wohnung {apt.unit} - {apt.building}
							{#if apt.id === data.contract.apartment_id}(aktuell){/if}
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
				<Button href="/contracts/{data.contract.id}" variant="secondary">Abbrechen</Button>
				<Button type="submit" variant="primary" disabled={isSubmitting}>
					{#if isSubmitting}
						<span class="animate-spin">
							<Icon name="refresh" size={18} />
						</span>
						Wird gespeichert...
					{:else}
						<Icon name="save" size={18} />
						Änderungen speichern
					{/if}
				</Button>
			</div>
		</form>
	</Card>
</div>
