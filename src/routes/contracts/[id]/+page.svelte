<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import FieldError from '$lib/components/FieldError.svelte';
	import type { RentalContract, Tenant, Apartment, Building } from '$lib/types';
	import type { ActionData } from './$types';

	interface PageData {
		contract: RentalContract & {
			tenant: Tenant;
			apartment: Apartment;
			building: Building;
		};
		rentBreakdown: {
			baseRent: number;
			additionalRent: number;
			advancePayment: number;
			total: number;
		};
	}

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let showEndContractModal = $state(false);
	let showDeleteModal = $state(false);

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('de-CH', {
			style: 'currency',
			currency: 'CHF',
			minimumFractionDigits: 2
		}).format(amount);
	}

	function formatDate(dateStr: string | Date): string {
		const date = new Date(dateStr);
		return date.toLocaleDateString('de-CH', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		});
	}

	function getInitials(firstName: string, lastName: string): string {
		return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
	}
</script>

<svelte:head>
	<title
		>Mietvertrag - {data.contract.tenant.firstName} {data.contract.tenant.lastName} - Dwello</title
	>
</svelte:head>

<div class="space-y-6">
	<!-- Breadcrumb -->
	<nav class="flex items-center text-sm text-ink-muted">
		<a href="/contracts" data-testid="breadcrumb-link" class="hover:text-primary transition-colors"
			>Mietverträge</a
		>
		<Icon name="chevron_right" size={16} class="mx-2" />
		<span class="text-gray-900 font-medium">
			{data.contract.tenant.firstName}
			{data.contract.tenant.lastName} - Wohnung {data.contract.apartment.number}
		</span>
	</nav>

	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
		<div>
			<div class="flex items-center gap-3">
				<h1 class="text-2xl font-bold text-gray-900">Mietvertrag</h1>
				<span data-testid="contract-status">
					<StatusBadge
						status={!data.contract.endDate ? 'AKTIV' : 'Beendet'}
						variant={!data.contract.endDate ? 'success' : 'gray'}
					/>
				</span>
			</div>
			<p class="text-ink-muted mt-1" data-testid="contract-apartment">
				Wohnung {data.contract.apartment.number} - {data.contract.building.name ||
					data.contract.building.address}
			</p>
		</div>
		<div class="flex gap-2">
			<Button
				href="/contracts/{data.contract.id}/edit"
				variant="secondary"
				testid="contract-edit-button"
			>
				<Icon name="edit" size={18} />
				Bearbeiten
			</Button>
			{#if !data.contract.endDate}
				<Button
					variant="secondary"
					onclick={() => (showEndContractModal = true)}
					testid="contract-end-button"
				>
					<Icon name="event_busy" size={18} />
					Beenden
				</Button>
			{/if}
			<Button
				variant="danger-ghost"
				onclick={() => (showDeleteModal = true)}
				testid="contract-delete-button"
			>
				<Icon name="delete" size={18} />
				Löschen
			</Button>
		</div>
	</div>

	<!-- Main Content Grid -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Left Column - Tenant & Apartment Info -->
		<div class="lg:col-span-1 space-y-6">
			<!-- Tenant Card -->
			<Card>
				<h2 class="text-lg font-semibold text-gray-900 mb-4">Mieter</h2>
				<div class="flex items-center gap-4 mb-4">
					<div
						class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl"
					>
						{getInitials(data.contract.tenant.firstName, data.contract.tenant.lastName)}
					</div>
					<div>
						<p class="font-semibold text-gray-900">
							{data.contract.tenant.firstName}
							{data.contract.tenant.lastName}
						</p>
						{#if data.contract.tenant.email}
							<a
								href="mailto:{data.contract.tenant.email}"
								class="text-sm text-primary hover:underline"
								data-testid="tenant-email-link"
							>
								{data.contract.tenant.email}
							</a>
						{/if}
					</div>
				</div>
				{#if data.contract.tenant.phone}
					<div class="flex items-center text-sm text-gray-600 mb-4">
						<Icon name="phone" size={16} class="mr-2 text-ink-muted" />
						<a
							href="tel:{data.contract.tenant.phone}"
							class="hover:text-primary"
							data-testid="tenant-phone-link"
						>
							{data.contract.tenant.phone}
						</a>
					</div>
				{/if}
				<Button
					href="/tenants/{data.contract.tenant.id}"
					variant="secondary"
					size="sm"
					testid="contract-tenant-link"
				>
					<Icon name="person" size={16} />
					Mieterprofil ansehen
				</Button>
			</Card>

			<!-- Apartment Card -->
			<Card>
				<h2 class="text-lg font-semibold text-gray-900 mb-4">Wohnung</h2>
				<div class="space-y-3">
					<div class="flex items-start gap-3">
						<Icon name="door_front" size={20} class="text-ink-muted mt-0.5" />
						<div>
							<p class="font-medium text-gray-900">Wohnung {data.contract.apartment.number}</p>
							<p class="text-sm text-ink-muted">{data.contract.apartment.floor}</p>
						</div>
					</div>
					<div class="flex items-start gap-3">
						<Icon name="apartment" size={20} class="text-ink-muted mt-0.5" />
						<div>
							<p class="text-gray-900">
								{data.contract.building.name || data.contract.building.address}
							</p>
							<p class="text-sm text-ink-muted">
								{data.contract.building.address}, {data.contract.building.postalCode}
								{data.contract.building.city}
							</p>
						</div>
					</div>
					<div class="flex items-center gap-6 text-sm text-gray-600 pt-2">
						<span class="flex items-center gap-1">
							<Icon name="straighten" size={16} class="text-ink-muted" />
							{data.contract.apartment.area} m²
						</span>
						<span class="flex items-center gap-1">
							<Icon name="meeting_room" size={16} class="text-ink-muted" />
							{data.contract.apartment.rooms} Zimmer
						</span>
					</div>
				</div>
				<div class="mt-4 pt-4 border-t border-gray-100">
					<Button
						href="/apartments/{data.contract.apartment.id}"
						variant="secondary"
						size="sm"
						testid="contract-apartment-link"
					>
						<Icon name="visibility" size={16} />
						Wohnung ansehen
					</Button>
				</div>
			</Card>
		</div>

		<!-- Right Column - Contract Details -->
		<div class="lg:col-span-2 space-y-6">
			<!-- Contract Period -->
			<Card>
				<h2 class="text-lg font-semibold text-gray-900 mb-4">Vertragszeitraum</h2>
				<div class="grid grid-cols-2 gap-6">
					<div>
						<p class="text-sm text-ink-muted mb-1">Vertragsbeginn</p>
						<p class="text-lg font-semibold text-gray-900">
							{formatDate(data.contract.startDate)}
						</p>
					</div>
					<div>
						<p class="text-sm text-ink-muted mb-1">Vertragsende</p>
						{#if data.contract.endDate}
							<p class="text-lg font-semibold text-gray-900">
								{formatDate(data.contract.endDate)}
							</p>
						{:else}
							<p class="text-lg font-semibold text-positive">Unbefristet</p>
						{/if}
					</div>
				</div>
			</Card>

			<!-- Rent Breakdown -->
			<Card>
				<h2 class="text-lg font-semibold text-gray-900 mb-4">Monatliche Miete</h2>
				<div class="space-y-3">
					<div class="flex justify-between items-center py-2">
						<span class="text-gray-600">Nettomiete</span>
						<span class="font-medium text-gray-900">
							{formatCurrency(data.rentBreakdown.baseRent)}
						</span>
					</div>
					<div class="flex justify-between items-center py-2">
						<span class="text-gray-600">Nebenkosten (Akonto)</span>
						<span class="font-medium text-gray-900">
							{formatCurrency(data.rentBreakdown.additionalRent)}
						</span>
					</div>
					{#if data.rentBreakdown.advancePayment > 0}
						<div class="flex justify-between items-center py-2">
							<span class="text-gray-600">Parkplatz / Sonstiges</span>
							<span class="font-medium text-gray-900">
								{formatCurrency(data.rentBreakdown.advancePayment)}
							</span>
						</div>
					{/if}
					<div class="flex justify-between items-center py-3 border-t border-gray-200 mt-2">
						<span class="font-semibold text-gray-900">Total Bruttomiete</span>
						<span class="text-xl font-bold text-primary" data-testid="contract-total-rent">
							{formatCurrency(data.rentBreakdown.total)}
						</span>
					</div>
				</div>
			</Card>

			<!-- Quick Actions -->
			<Card>
				<h2 class="text-lg font-semibold text-gray-900 mb-4">Aktionen</h2>
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<Button
						href="/statements?contract={data.contract.id}"
						variant="secondary"
						testid="contract-statements-link"
					>
						<Icon name="receipt_long" size={18} />
						Nebenkostenabrechnungen
					</Button>
					<Button
						href="/invoices?building={data.contract.building.id}"
						variant="secondary"
						testid="contract-invoices-link"
					>
						<Icon name="receipt" size={18} />
						Rechnungen anzeigen
					</Button>
				</div>
			</Card>
		</div>
	</div>
</div>

<!-- End Contract Modal -->
{#if showEndContractModal}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
		<div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
			<div class="flex items-center gap-4 mb-4">
				<div class="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
					<Icon name="event_busy" size={24} class="text-caution" />
				</div>
				<div>
					<h3 class="text-lg font-semibold text-gray-900">Vertrag beenden</h3>
					<p class="text-sm text-ink-muted">
						{data.contract.tenant.firstName}
						{data.contract.tenant.lastName}
					</p>
				</div>
			</div>
			<p class="text-gray-600 mb-6">
				Sind Sie sicher, dass Sie diesen Mietvertrag beenden möchten? Das Vertragsende wird auf das
				heutige Datum gesetzt und die Wohnung wird als "Leer" markiert.
			</p>
			<FieldError message={form?.endError} />
			<form
				method="POST"
				action="?/end"
				use:enhance={() =>
					async ({ update }) => {
						await update();
						showEndContractModal = false;
					}}
				class="flex gap-3 justify-end"
			>
				<Button variant="secondary" onclick={() => (showEndContractModal = false)}>Abbrechen</Button
				>
				<Button type="submit" variant="primary" testid="contract-end-confirm">
					<Icon name="event_busy" size={18} />
					Vertrag beenden
				</Button>
			</form>
		</div>
	</div>
{/if}

<!-- Delete Confirmation Modal -->
{#if showDeleteModal}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
		<div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
			<div class="flex items-center gap-4 mb-4">
				<div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
					<Icon name="warning" size={24} class="text-critical" />
				</div>
				<div>
					<h3 class="text-lg font-semibold text-gray-900">Vertrag löschen</h3>
					<p class="text-sm text-ink-muted">Diese Aktion kann nicht rückgängig gemacht werden</p>
				</div>
			</div>
			<p class="text-gray-600 mb-6">
				Sind Sie sicher, dass Sie diesen Mietvertrag vollständig löschen möchten? Alle zugehörigen
				Daten werden unwiderruflich entfernt.
			</p>
			{#if !data.contract.endDate}
				<div class="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
					<div class="flex items-start gap-2">
						<Icon name="warning" size={18} class="text-caution mt-0.5" />
						<p class="text-sm text-caution">
							Dieser Vertrag ist noch aktiv. Beenden Sie den Vertrag zuerst, bevor Sie ihn löschen.
						</p>
					</div>
				</div>
			{/if}
			<FieldError message={form?.deleteError} />
			<form method="POST" action="?/delete" use:enhance class="flex gap-3 justify-end">
				<Button variant="secondary" onclick={() => (showDeleteModal = false)}>Abbrechen</Button>
				<Button
					type="submit"
					variant="danger"
					disabled={!data.contract.endDate}
					testid="contract-delete-confirm"
				>
					<Icon name="delete" size={18} />
					Löschen
				</Button>
			</form>
		</div>
	</div>
{/if}
