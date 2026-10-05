<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { TenantsListData } from '$lib/types';
	import { listSearchUrl } from '$lib/list-url';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import SearchField from '$lib/components/SearchField.svelte';
	import FilterSelect from '$lib/components/FilterSelect.svelte';
	import FilterActions from '$lib/components/FilterActions.svelte';
	import ListPagination from '$lib/components/ListPagination.svelte';
	import Card from '$lib/components/Card.svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';

	let { data }: { data: TenantsListData } = $props();

	let searchTerm = $state($page.url.searchParams.get('search') || '');
	let statusFilter = $state($page.url.searchParams.get('status') || '');

	const statusOptions = [
		{ value: 'active', label: 'Aktive Mieter' },
		{ value: 'inactive', label: 'Ehemalige Mieter' }
	];

	const filtered = $derived(!!(searchTerm || statusFilter));

	function handleSearch(event: SubmitEvent) {
		event.preventDefault();
		goto(listSearchUrl('/tenants', { search: searchTerm, status: statusFilter }));
	}

	function clearFilters() {
		searchTerm = '';
		statusFilter = '';
		goto('/tenants');
	}

	function getInitials(firstName: string, lastName: string): string {
		return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
	}
</script>

<svelte:head>
	<title>Mieter - Dwello</title>
</svelte:head>

<div class="space-y-6" data-testid="tenants-page">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Mieter</h1>
			<p class="text-gray-500 mt-1">{data.total} Mieter insgesamt</p>
		</div>
		<Button href="/tenants/new" variant="primary" testid="tenants-new-button">
			<Icon name="person_add" size={20} />
			Neuer Mieter
		</Button>
	</div>

	<!-- Search and Filters -->
	<Card>
		<form onsubmit={handleSearch} class="space-y-4">
			<div class="flex flex-col sm:flex-row gap-4">
				<SearchField
					bind:value={searchTerm}
					placeholder="Name, E-Mail oder Gebäude..."
					testid="tenants-search-input"
				/>
				<FilterSelect
					id="status"
					label="Status"
					allLabel="Alle Mieter"
					options={statusOptions}
					value={statusFilter}
					testid="tenants-status-filter"
					onchange={(value) => (statusFilter = value)}
				/>
			</div>
			<FilterActions {filtered} onclear={clearFilters} testid="tenants-search-submit" />
		</form>
	</Card>

	<!-- Tenants List -->
	{#if data.tenants.length === 0}
		<Card>
			<div class="text-center py-12">
				<Icon name="person" size={48} class="mx-auto text-gray-300 mb-4" />
				<h3 class="text-lg font-medium text-gray-900 mb-2">Keine Mieter gefunden</h3>
				<p class="text-gray-500 mb-6">
					{#if filtered}
						Versuchen Sie es mit anderen Suchbegriffen oder Filtern.
					{:else}
						Erstellen Sie Ihren ersten Mieter, um loszulegen.
					{/if}
				</p>
				{#if !filtered}
					<Button href="/tenants/new" variant="primary">
						<Icon name="person_add" size={20} />
						Ersten Mieter erstellen
					</Button>
				{/if}
			</div>
		</Card>
	{:else}
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.tenants as tenant}
				<a
					href="/tenants/{tenant.id}"
					data-testid="tenant-card-{tenant.id}"
					class="block bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200"
				>
					<div class="p-5">
						<!-- Header with Avatar and Status -->
						<div class="flex items-start gap-4 mb-4">
							<!-- Avatar -->
							<div
								class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg flex-shrink-0"
							>
								{getInitials(tenant.firstName, tenant.lastName)}
							</div>
							<div class="flex-1 min-w-0">
								<div class="flex items-center justify-between gap-2">
									<h3 class="font-semibold text-gray-900 truncate">
										{tenant.firstName}
										{tenant.lastName}
									</h3>
									{#if tenant.isActive}
										<span data-testid="tenant-active"
											><StatusBadge status="AKTIV" variant="success" /></span
										>
									{/if}
								</div>
								<p class="text-sm text-gray-500 truncate">{tenant.email}</p>
							</div>
						</div>

						<!-- Contact Info -->
						{#if tenant.phone}
							<div class="flex items-center text-sm text-gray-600 mb-3">
								<Icon name="phone" size={16} class="mr-2 text-gray-400" />
								<span>{tenant.phone}</span>
							</div>
						{/if}

						<!-- Current Occupancy -->
						<div class="pt-3 border-t border-gray-100">
							{#if tenant.currentApartment && tenant.currentBuilding}
								<div class="flex items-center text-sm text-gray-600">
									<Icon name="home" size={16} class="mr-2 text-gray-400" />
									<span class="truncate">{tenant.currentApartment} - {tenant.currentBuilding}</span>
								</div>
							{:else}
								<div class="flex items-center text-sm text-gray-400">
									<Icon name="home" size={16} class="mr-2" />
									<span>Keine aktive Miete</span>
								</div>
							{/if}
						</div>
					</div>
				</a>
			{/each}
		</div>

		<ListPagination {data} />
	{/if}
</div>
