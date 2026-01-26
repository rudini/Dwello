<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';
	import type { Tenant } from '$lib/types';

	interface PageData {
		tenant: Tenant;
	}

	let { data }: { data: PageData } = $props();

	// Form state - using functions to capture initial values
	// This pattern is intentional for edit forms where we want initial snapshot
	let firstName = $state((() => data.tenant.first_name)());
	let lastName = $state((() => data.tenant.last_name)());
	let email = $state((() => data.tenant.email)());
	let phoneNumber = $state((() => data.tenant.phone_number || '')());
	let address = $state((() => data.tenant.address || '')());
	let postalCode = $state((() => data.tenant.postal_code || '')());
	let city = $state((() => data.tenant.city || '')());

	let isSubmitting = $state(false);
	let errors = $state<Record<string, string>>({});

	function validate(): boolean {
		const newErrors: Record<string, string> = {};

		if (!firstName.trim()) {
			newErrors.firstName = 'Vorname ist erforderlich';
		}
		if (!lastName.trim()) {
			newErrors.lastName = 'Nachname ist erforderlich';
		}
		if (!email.trim()) {
			newErrors.email = 'E-Mail ist erforderlich';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			newErrors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
		}
		if (phoneNumber && !/^[\d\s+()-]+$/.test(phoneNumber)) {
			newErrors.phoneNumber = 'Bitte geben Sie eine gültige Telefonnummer ein';
		}
		if (postalCode && !/^\d{4}$/.test(postalCode)) {
			newErrors.postalCode = 'PLZ muss 4 Ziffern haben';
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
			// const response = await fetch(`/api/tenants/${data.tenant.id}`, {
			// 	method: 'PUT',
			// 	headers: { 'Content-Type': 'application/json' },
			// 	body: JSON.stringify({
			// 		first_name: firstName,
			// 		last_name: lastName,
			// 		email,
			// 		phone_number: phoneNumber || null,
			// 		address: address || null,
			// 		postal_code: postalCode || null,
			// 		city: city || null
			// 	})
			// });

			// Mock success
			await new Promise((r) => setTimeout(r, 500));
			await goto(`/tenants/${data.tenant.id}`);
		} catch (error) {
			console.error('Error updating tenant:', error);
			errors = { form: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.' };
		} finally {
			isSubmitting = false;
		}
	}
</script>

<svelte:head>
	<title>{data.tenant.first_name} {data.tenant.last_name} bearbeiten - Dwello</title>
</svelte:head>

<div class="max-w-2xl mx-auto space-y-6">
	<!-- Breadcrumb -->
	<nav class="flex items-center text-sm text-gray-500">
		<a href="/tenants" class="hover:text-primary transition-colors">Mieter</a>
		<Icon name="chevron_right" size={16} class="mx-2" />
		<a href="/tenants/{data.tenant.id}" class="hover:text-primary transition-colors">
			{data.tenant.first_name} {data.tenant.last_name}
		</a>
		<Icon name="chevron_right" size={16} class="mx-2" />
		<span class="text-gray-900 font-medium">Bearbeiten</span>
	</nav>

	<!-- Header -->
	<div>
		<h1 class="text-2xl font-bold text-gray-900">
			{data.tenant.first_name} {data.tenant.last_name} bearbeiten
		</h1>
		<p class="text-gray-500 mt-1">Ändern Sie die Kontaktdaten des Mieters.</p>
	</div>

	<!-- Form -->
	<Card>
		<form onsubmit={handleSubmit} class="space-y-6">
			{#if errors.form}
				<div class="bg-red-50 border border-red-200 rounded-lg p-4">
					<p class="text-sm text-red-700">{errors.form}</p>
				</div>
			{/if}

			<!-- Name -->
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div>
					<label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
						Vorname <span class="text-red-500">*</span>
					</label>
					<input
						id="firstName"
						type="text"
						bind:value={firstName}
						placeholder="Hans"
						class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary {errors.firstName
							? 'border-red-500'
							: 'border-gray-300'}"
					/>
					{#if errors.firstName}
						<p class="mt-1 text-sm text-red-600">{errors.firstName}</p>
					{/if}
				</div>
				<div>
					<label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
						Nachname <span class="text-red-500">*</span>
					</label>
					<input
						id="lastName"
						type="text"
						bind:value={lastName}
						placeholder="Müller"
						class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary {errors.lastName
							? 'border-red-500'
							: 'border-gray-300'}"
					/>
					{#if errors.lastName}
						<p class="mt-1 text-sm text-red-600">{errors.lastName}</p>
					{/if}
				</div>
			</div>

			<!-- Contact Info -->
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700 mb-1">
						E-Mail <span class="text-red-500">*</span>
					</label>
					<input
						id="email"
						type="email"
						bind:value={email}
						placeholder="hans.mueller@email.com"
						class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary {errors.email
							? 'border-red-500'
							: 'border-gray-300'}"
					/>
					{#if errors.email}
						<p class="mt-1 text-sm text-red-600">{errors.email}</p>
					{/if}
				</div>
				<div>
					<label for="phoneNumber" class="block text-sm font-medium text-gray-700 mb-1">
						Telefon <span class="text-gray-400">(optional)</span>
					</label>
					<input
						id="phoneNumber"
						type="tel"
						bind:value={phoneNumber}
						placeholder="+41 79 123 45 67"
						class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary {errors.phoneNumber
							? 'border-red-500'
							: 'border-gray-300'}"
					/>
					{#if errors.phoneNumber}
						<p class="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
					{/if}
				</div>
			</div>

			<!-- Address Section -->
			<div class="border-t border-gray-200 pt-6">
				<h3 class="text-sm font-medium text-gray-700 mb-4">
					Adresse <span class="text-gray-400">(optional)</span>
				</h3>

				<div class="space-y-4">
					<div>
						<label for="address" class="block text-sm font-medium text-gray-700 mb-1">
							Strasse und Hausnummer
						</label>
						<input
							id="address"
							type="text"
							bind:value={address}
							placeholder="Musterstrasse 12"
							class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
						/>
					</div>

					<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<div>
							<label for="postalCode" class="block text-sm font-medium text-gray-700 mb-1">
								PLZ
							</label>
							<input
								id="postalCode"
								type="text"
								bind:value={postalCode}
								placeholder="8000"
								maxlength="4"
								class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary {errors.postalCode
									? 'border-red-500'
									: 'border-gray-300'}"
							/>
							{#if errors.postalCode}
								<p class="mt-1 text-sm text-red-600">{errors.postalCode}</p>
							{/if}
						</div>
						<div class="sm:col-span-2">
							<label for="city" class="block text-sm font-medium text-gray-700 mb-1">
								Stadt
							</label>
							<input
								id="city"
								type="text"
								bind:value={city}
								placeholder="Zürich"
								class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
							/>
						</div>
					</div>
				</div>
			</div>

			<!-- Actions -->
			<div class="flex gap-3 pt-4 border-t border-gray-200">
				<Button href="/tenants/{data.tenant.id}" variant="secondary">Abbrechen</Button>
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
