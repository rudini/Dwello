<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';
	import DocumentRow from '$lib/components/DocumentRow.svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import type { Tenant, ContractHistory, StatementDocument } from '$lib/types';

	interface PageData {
		tenant: Tenant;
		currentOccupancy: {
			apartment: string;
			building: string;
			rent: number;
			startDate: string;
		} | null;
		contractHistory: ContractHistory[];
		documents: StatementDocument[];
	}

	let { data }: { data: PageData } = $props();

	let showDeleteModal = $state(false);

	function getInitials(firstName: string, lastName: string): string {
		return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('de-CH', {
			style: 'currency',
			currency: 'CHF',
			minimumFractionDigits: 2
		}).format(amount);
	}

	async function handleDelete() {
		// In production, call the API
		// await fetch(`/api/tenants/${data.tenant.id}`, { method: 'DELETE' });
		await new Promise((r) => setTimeout(r, 500));
		await goto('/tenants');
	}
</script>

<svelte:head>
	<title>{data.tenant.firstName} {data.tenant.lastName} - Dwello</title>
</svelte:head>

<div class="space-y-6">
	<!-- Breadcrumb -->
	<nav class="flex items-center text-sm text-gray-500">
		<a href="/tenants" class="hover:text-primary transition-colors">Mieter</a>
		<Icon name="chevron_right" size={16} class="mx-2" />
		<span class="text-gray-900 font-medium">
			{data.tenant.firstName}
			{data.tenant.lastName}
		</span>
	</nav>

	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
		<div class="flex items-center gap-4">
			<!-- Large Avatar -->
			<div
				class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl"
			>
				{getInitials(data.tenant.firstName, data.tenant.lastName)}
			</div>
			<div>
				<div class="flex items-center gap-3">
					<h1 class="text-2xl font-bold text-gray-900">
						{data.tenant.firstName}
						{data.tenant.lastName}
					</h1>
					{#if data.currentOccupancy}
						<StatusBadge status="AKTIV" variant="success" />
					{/if}
				</div>
				<p class="text-gray-500 mt-1">{data.tenant.email}</p>
			</div>
		</div>
		<div class="flex gap-2">
			<Button href="/tenants/{data.tenant.id}/edit" variant="secondary">
				<Icon name="edit" size={18} />
				Bearbeiten
			</Button>
			<Button variant="danger" onclick={() => (showDeleteModal = true)}>
				<Icon name="delete" size={18} />
				Löschen
			</Button>
		</div>
	</div>

	<!-- Main Content Grid -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Left Column - Contact Info -->
		<div class="lg:col-span-1 space-y-6">
			<!-- Contact Information -->
			<Card>
				<h2 class="text-lg font-semibold text-gray-900 mb-4">Kontaktdaten</h2>
				<div class="space-y-4">
					<div class="flex items-start gap-3">
						<Icon name="email" size={20} class="text-gray-400 mt-0.5" />
						<div>
							<p class="text-sm text-gray-500">E-Mail</p>
							<a href="mailto:{data.tenant.email}" class="text-primary hover:underline">
								{data.tenant.email}
							</a>
						</div>
					</div>
					<div class="flex items-start gap-3">
						<Icon name="forward_to_inbox" size={20} class="text-gray-400 mt-0.5" />
						<div>
							<p class="text-sm text-gray-500">Korrespondenz</p>
							<p class="text-gray-900" data-testid="tenant-channel">
								{data.tenant.correspondenceChannel === 'email' ? 'Per E-Mail' : 'Per Brief'}
							</p>
						</div>
					</div>
					{#if data.tenant.phone}
						<div class="flex items-start gap-3">
							<Icon name="phone" size={20} class="text-gray-400 mt-0.5" />
							<div>
								<p class="text-sm text-gray-500">Telefon</p>
								<a href="tel:{data.tenant.phone}" class="text-primary hover:underline">
									{data.tenant.phone}
								</a>
							</div>
						</div>
					{/if}
					{#if data.tenant.address}
						<div class="flex items-start gap-3">
							<Icon name="location_on" size={20} class="text-gray-400 mt-0.5" />
							<div>
								<p class="text-sm text-gray-500">Adresse</p>
								<p class="text-gray-900">{data.tenant.address}</p>
								{#if data.tenant.postalCode && data.tenant.city}
									<p class="text-gray-900">{data.tenant.postalCode} {data.tenant.city}</p>
								{/if}
							</div>
						</div>
					{/if}
				</div>
			</Card>

			<!-- Current Occupancy -->
			<Card>
				<h2 class="text-lg font-semibold text-gray-900 mb-4">Aktuelle Miete</h2>
				{#if data.currentOccupancy}
					<div class="space-y-4">
						<div class="flex items-start gap-3">
							<Icon name="apartment" size={20} class="text-gray-400 mt-0.5" />
							<div>
								<p class="text-sm text-gray-500">Wohnung</p>
								<p class="text-gray-900">{data.currentOccupancy.apartment}</p>
								<p class="text-sm text-gray-500">{data.currentOccupancy.building}</p>
							</div>
						</div>
						<div class="flex items-start gap-3">
							<Icon name="payments" size={20} class="text-gray-400 mt-0.5" />
							<div>
								<p class="text-sm text-gray-500">Monatliche Miete</p>
								<p class="text-lg font-semibold text-primary">
									{formatCurrency(data.currentOccupancy.rent)}
								</p>
							</div>
						</div>
						<div class="flex items-start gap-3">
							<Icon name="event" size={20} class="text-gray-400 mt-0.5" />
							<div>
								<p class="text-sm text-gray-500">Mietbeginn</p>
								<p class="text-gray-900">{data.currentOccupancy.startDate}</p>
							</div>
						</div>
					</div>
					<div class="mt-4 pt-4 border-t border-gray-100">
						<Button href="/apartments/apt-001" variant="secondary" size="sm">
							<Icon name="visibility" size={16} />
							Wohnung ansehen
						</Button>
					</div>
				{:else}
					<div class="text-center py-6">
						<Icon name="home" size={40} class="mx-auto text-gray-300 mb-2" />
						<p class="text-gray-500 text-sm">Keine aktive Miete</p>
						<p class="text-gray-400 text-xs mt-1">Dieser Mieter hat keinen aktiven Vertrag.</p>
					</div>
				{/if}
			</Card>
		</div>

		<!-- Right Column - Contract History -->
		<div class="lg:col-span-2">
			<Card>
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-lg font-semibold text-gray-900">Mietvertragshistorie</h2>
					<Button href="/contracts/new?tenant={data.tenant.id}" variant="primary" size="sm">
						<Icon name="add" size={16} />
						Neuer Vertrag
					</Button>
				</div>

				{#if data.contractHistory.length === 0}
					<div class="text-center py-12">
						<Icon name="description" size={48} class="mx-auto text-gray-300 mb-4" />
						<h3 class="text-lg font-medium text-gray-900 mb-2">Keine Verträge</h3>
						<p class="text-gray-500 mb-4">Dieser Mieter hat noch keine Mietverträge.</p>
						<Button href="/contracts/new?tenant={data.tenant.id}" variant="primary">
							<Icon name="add" size={18} />
							Ersten Vertrag erstellen
						</Button>
					</div>
				{:else}
					<div class="overflow-x-auto">
						<table class="w-full">
							<thead>
								<tr class="border-b border-gray-200">
									<th
										class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4"
									>
										Wohnung
									</th>
									<th
										class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4"
									>
										Zeitraum
									</th>
									<th
										class="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4"
									>
										Mietzins
									</th>
									<th
										class="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4"
									>
										Status
									</th>
									<th class="py-3 px-4"></th>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-100">
								{#each data.contractHistory as contract}
									<tr class="hover:bg-gray-50 transition-colors">
										<td class="py-4 px-4">
											<span class="font-medium text-gray-900">Wohnung 2.04</span>
										</td>
										<td class="py-4 px-4 text-gray-600">{contract.period}</td>
										<td class="py-4 px-4 text-right font-medium text-gray-900">
											{formatCurrency(contract.rentBrutto)}
										</td>
										<td class="py-4 px-4 text-center">
											<StatusBadge
												status={contract.isActive ? 'AKTIV' : 'Beendet'}
												variant={contract.isActive ? 'success' : 'gray'}
											/>
										</td>
										<td class="py-4 px-4 text-right">
											<Button href="/contracts/{contract.id}" variant="secondary" size="sm">
												<Icon name="visibility" size={16} />
											</Button>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			</Card>

			<Card>
				<h2 class="text-lg font-semibold text-gray-900 mb-4">Dokumente</h2>
				{#if data.documents.length === 0}
					<p class="text-gray-500">Noch keine Dokumente.</p>
				{:else}
					<ul class="divide-y divide-gray-100" data-testid="tenant-documents">
						{#each data.documents as document (document.id)}
							<DocumentRow {document} />
						{/each}
					</ul>
				{/if}
			</Card>
		</div>
	</div>
</div>

<!-- Delete Confirmation Modal -->
{#if showDeleteModal}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
		<div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
			<div class="flex items-center gap-4 mb-4">
				<div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
					<Icon name="warning" size={24} class="text-red-600" />
				</div>
				<div>
					<h3 class="text-lg font-semibold text-gray-900">Mieter löschen</h3>
					<p class="text-sm text-gray-500">
						{data.tenant.firstName}
						{data.tenant.lastName}
					</p>
				</div>
			</div>
			<p class="text-gray-600 mb-6">
				Sind Sie sicher, dass Sie diesen Mieter löschen möchten? Diese Aktion kann nicht rückgängig
				gemacht werden.
			</p>
			{#if data.currentOccupancy}
				<div class="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
					<div class="flex items-start gap-2">
						<Icon name="warning" size={18} class="text-amber-600 mt-0.5" />
						<p class="text-sm text-amber-800">
							Dieser Mieter hat einen aktiven Mietvertrag. Der Vertrag muss zuerst beendet werden.
						</p>
					</div>
				</div>
			{/if}
			<div class="flex gap-3 justify-end">
				<Button variant="secondary" onclick={() => (showDeleteModal = false)}>Abbrechen</Button>
				<Button variant="danger" onclick={handleDelete} disabled={!!data.currentOccupancy}>
					<Icon name="delete" size={18} />
					Löschen
				</Button>
			</div>
		</div>
	</div>
{/if}
