<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { TenantsListData } from '$lib/types';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';

	let { data }: { data: TenantsListData } = $props();

	let searchTerm = $state($page.url.searchParams.get('search') || '');
	let statusFilter = $state($page.url.searchParams.get('status') || '');

	// Derived values
	const totalPages = $derived.by(() => Math.ceil(data.total / data.pageSize));
	const hasNextPage = $derived.by(() => data.page < totalPages);
	const hasPrevPage = $derived.by(() => data.page > 1);

	function handleSearch() {
		const params = new URLSearchParams();
		if (searchTerm) params.set('search', searchTerm);
		if (statusFilter) params.set('status', statusFilter);
		params.set('page', '1');
		goto(`/tenants?${params.toString()}`);
	}

	function handlePageChange(newPage: number) {
		const params = new URLSearchParams($page.url.searchParams);
		params.set('page', newPage.toString());
		goto(`/tenants?${params.toString()}`);
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
		<Button href="/tenants/new" variant="primary">
			<Icon name="person_add" size={20} />
			Neuer Mieter
		</Button>
	</div>

	<!-- Search and Filters -->
	<Card>
		<form onsubmit={(e) => { e.preventDefault(); handleSearch(); }} class="space-y-4">
			<div class="flex flex-col sm:flex-row gap-4">
				<div class="flex-1">
					<label for="search" class="block text-sm font-medium text-gray-700 mb-1">Suche</label>
					<div class="relative">
						<Icon
							name="search"
							size={20}
							class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
						/>
						<input
							id="search"
							type="text"
							bind:value={searchTerm}
							placeholder="Name, E-Mail oder Gebäude..."
							class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
						/>
					</div>
				</div>
				<div class="w-full sm:w-48">
					<label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
					<select
						id="status"
						bind:value={statusFilter}
						class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
					>
						<option value="">Alle Mieter</option>
						<option value="active">Aktive Mieter</option>
						<option value="inactive">Ehemalige Mieter</option>
					</select>
				</div>
			</div>
			<div class="flex gap-2">
				<Button type="submit" variant="primary" size="sm">
					<Icon name="search" size={16} />
					Suchen
				</Button>
				{#if searchTerm || statusFilter}
					<Button type="button" variant="secondary" size="sm" onclick={clearFilters}>
						<Icon name="close" size={16} />
						Filter löschen
					</Button>
				{/if}
			</div>
		</form>
	</Card>

	<!-- Tenants List -->
	{#if data.tenants.length === 0}
		<Card>
			<div class="text-center py-12">
				<Icon name="person" size={48} class="mx-auto text-gray-300 mb-4" />
				<h3 class="text-lg font-medium text-gray-900 mb-2">Keine Mieter gefunden</h3>
				<p class="text-gray-500 mb-6">
					{#if searchTerm || statusFilter}
						Versuchen Sie es mit anderen Suchbegriffen oder Filtern.
					{:else}
						Erstellen Sie Ihren ersten Mieter, um loszulegen.
					{/if}
				</p>
				{#if !searchTerm && !statusFilter}
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
										{tenant.firstName} {tenant.lastName}
									</h3>
									{#if tenant.contractCount > 0}
										<StatusBadge status="AKTIV" variant="success" />
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

		<!-- Pagination -->
		{#if totalPages > 1}
			<div class="flex items-center justify-between">
				<p class="text-sm text-gray-600">
					Seite {data.page} von {totalPages} ({data.total} Ergebnisse)
				</p>
				<div class="flex gap-2">
					<Button
						variant="secondary"
						size="sm"
						disabled={!hasPrevPage}
						onclick={() => handlePageChange(data.page - 1)}
					>
						<Icon name="chevron_left" size={16} />
						Zurück
					</Button>
					<Button
						variant="secondary"
						size="sm"
						disabled={!hasNextPage}
						onclick={() => handlePageChange(data.page + 1)}
					>
						Weiter
						<Icon name="chevron_right" size={16} />
					</Button>
				</div>
			</div>
		{/if}
	{/if}
</div>
