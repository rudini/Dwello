<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';
	import FieldError from '$lib/components/FieldError.svelte';
	import { apiCall } from '$lib/api';
	import type { RentalContract } from '$lib/types';
	import {
		computeAvailability,
		checkDateRangeOverlap,
		type AvailabilityInfo,
		type ContractForAvailability
	} from '$lib/utils/contract-availability';

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
	let tenantId = $state((() => data.contract.tenantId)());
	let apartmentId = $state((() => data.contract.apartmentId)());
	let startDate = $state((() => formatDateForInput(data.contract.startDate))());
	let endDate = $state((() => formatDateForInput(data.contract.endDate))());
	let baseRent = $state((() => data.contract.baseRent)());
	let additionalRent = $state((() => data.contract.additionalRent || '')());
	let advancePayment = $state((() => data.contract.monthlyAdvancePayment || '')());
	let isUnlimited = $state((() => !data.contract.endDate)());

	let isSubmitting = $state(false);
	let errors = $state<Record<string, string>>({});

	// Availability state - now per apartment
	let isLoadingAvailability = $state(true);
	let apartmentAvailability = $state<Map<string, AvailabilityInfo>>(new Map());
	let apartmentContracts = $state<ContractForAvailability[]>([]);

	// The ID of the current contract being edited (to exclude from overlap checks)
	// Using function to capture initial value (intentional for edit form)
	const currentContractId = (() => data.contract.id)();
	const originalApartmentId = (() => data.contract.apartmentId)();

	// Selected apartment's availability
	const selectedAvailability = $derived(apartmentId ? apartmentAvailability.get(apartmentId) : null);

	// Fetch availability for all apartments on mount
	$effect(() => {
		fetchAllApartmentAvailability();
	});

	// Update contracts when apartment changes (for overlap checking)
	$effect(() => {
		if (apartmentId) {
			fetchApartmentContracts(apartmentId);
		} else {
			apartmentContracts = [];
		}
	});

	// Check for date range overlap (excluding current contract)
	const overlapWarning = $derived.by(() => {
		if (!startDate || apartmentContracts.length === 0) return null;
		const result = checkDateRangeOverlap(
			startDate,
			isUnlimited ? null : endDate || null,
			apartmentContracts,
			currentContractId
		);
		return result.hasOverlap ? result.message : null;
	});

	async function fetchAllApartmentAvailability() {
		isLoadingAvailability = true;
		const availabilityMap = new Map<string, AvailabilityInfo>();

		try {
			// Fetch contracts for all apartments in parallel
			const apartmentList = data.apartments || [];
			const promises = apartmentList.map(async (apt) => {
				const response = await apiCall<{ contracts: ContractForAvailability[] }>(
					`/contracts?apartmentId=${apt.id}`
				);
				const contracts = response.data?.contracts || [];
				// For the original apartment, exclude current contract from availability check
				const excludeId = apt.id === originalApartmentId ? currentContractId : undefined;
				return { id: apt.id, availability: computeAvailability(contracts, excludeId) };
			});

			const results = await Promise.all(promises);
			for (const result of results) {
				availabilityMap.set(result.id, result.availability);
			}
		} catch (error) {
			console.error('Error fetching apartment availability:', error);
		} finally {
			apartmentAvailability = availabilityMap;
			isLoadingAvailability = false;
		}
	}

	async function fetchApartmentContracts(aptId: string) {
		try {
			const response = await apiCall<{ contracts: ContractForAvailability[] }>(
				`/contracts?apartmentId=${aptId}`
			);
			apartmentContracts = response.data?.contracts || [];
		} catch (error) {
			console.error('Error fetching apartment contracts:', error);
			apartmentContracts = [];
		}
	}

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
		<a href="/contracts" data-testid="breadcrumb-link" class="hover:text-primary transition-colors">Mietverträge</a>
		<Icon name="chevron_right" size={16} class="mx-2" />
		<a href="/contracts/{data.contract.id}" data-testid="breadcrumb-link" class="hover:text-primary transition-colors">
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
					<p class="text-sm text-red-700" data-testid="form-error">{errors.form}</p>
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
				<FieldError message={errors.tenantId} />
			</div>

			<!-- Apartment Selection -->
			<div>
				<label for="apartment" class="block text-sm font-medium text-gray-700 mb-1">
					Wohnung <span class="text-red-500">*</span>
				</label>
				{#if isLoadingAvailability}
					<div class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center gap-2 text-gray-500">
						<span class="animate-spin">
							<Icon name="refresh" size={16} />
						</span>
						Verfügbarkeit wird geprüft...
					</div>
				{:else}
					<select
						id="apartment"
						bind:value={apartmentId}
						data-testid="apartment-select"
						class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white {errors.apartmentId
							? 'border-red-500'
							: 'border-gray-300'}"
					>
						<option value="">Wohnung auswählen...</option>
						{#each data.apartments as apt}
							{@const aptAvailability = apartmentAvailability.get(apt.id)}
							{@const isCurrentApartment = apt.id === originalApartmentId}
							<option
								value={apt.id}
								disabled={!isCurrentApartment && aptAvailability?.hasOngoingContract}
							>
								Wohnung {apt.unit} - {apt.building}
								{#if isCurrentApartment}
									(aktuell)
								{:else if aptAvailability?.hasOngoingContract}
									(nicht verfügbar)
								{:else if aptAvailability?.availableFrom}
									(verfügbar ab {aptAvailability.availableFrom})
								{/if}
							</option>
						{/each}
					</select>
				{/if}
				<FieldError message={errors.apartmentId} />

				<!-- Availability Info for "available from" case when changing apartment -->
				{#if apartmentId !== originalApartmentId && selectedAvailability?.statusType === 'available-from'}
					<div
						class="mt-2 p-3 rounded-lg flex items-start gap-2 bg-blue-50 border border-blue-200"
						data-testid="availability-info"
					>
						<Icon name="info" size={18} class="text-blue-600" />
						<span class="text-sm text-blue-700">
							{selectedAvailability.message}
						</span>
					</div>
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
							min={apartmentId !== originalApartmentId ? selectedAvailability?.availableFrom || undefined : undefined}
							data-testid="start-date-input"
							class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary {errors.startDate
								? 'border-red-500'
								: 'border-gray-300'}"
						/>
						<FieldError message={errors.startDate} />
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
						<FieldError message={errors.endDate} />
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

				<!-- Overlap Warning -->
				{#if overlapWarning}
					<div
						class="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2"
						data-testid="overlap-warning"
					>
						<Icon name="warning" size={18} class="text-amber-600 mt-0.5" />
						<span class="text-sm text-amber-700">{overlapWarning}</span>
					</div>
				{/if}
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
								data-testid="contract-base-rent-input"
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
						<FieldError message={errors.baseRent} />
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
						<FieldError message={errors.additionalRent} />
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
						<FieldError message={errors.advancePayment} />
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
				<Button href="/contracts/{data.contract.id}" variant="secondary" testid="form-cancel">Abbrechen</Button>
				<Button
					type="submit"
					variant="primary"
					disabled={isSubmitting}
					testid="submit-button"
				>
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
