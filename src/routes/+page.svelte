<script lang="ts">
	import { user } from '$lib/stores';

	interface DashboardStats {
		totalBuildings: number;
		totalApartments: number;
		occupiedApartments: number;
		vacantApartments: number;
		pendingStatements: number;
		overdueStatements: number;
	}

	let { data }: { data: { stats: DashboardStats } } = $props();

	const stats = $derived(data.stats);

	const occupancyRate = $derived(
		stats && stats.totalApartments > 0
			? Math.round((stats.occupiedApartments / stats.totalApartments) * 100)
			: 0
	);
</script>

<svelte:head>
	<title>Dashboard - Dwello</title>
</svelte:head>

<div class="space-y-6">
	<!-- Welcome Header -->
	<div class="bg-white rounded-lg shadow-sm p-6">
		<h1 class="text-2xl font-bold text-gray-900">
			Welcome back{$user?.name ? `, ${$user.name.split(' ')[0]}` : ''}!
		</h1>
		<p class="mt-1 text-gray-600">Here's an overview of your property portfolio.</p>
	</div>

	<!-- Stats Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
		<!-- Total Buildings -->
		<div class="bg-white rounded-lg shadow-sm p-6">
			<div class="flex items-center">
				<div class="flex-shrink-0 p-3 bg-blue-100 rounded-lg">
					<span class="material-symbols-outlined text-blue-600">apartment</span>
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-500">Buildings</p>
					<p class="text-2xl font-semibold text-gray-900">{stats.totalBuildings}</p>
				</div>
			</div>
		</div>

		<!-- Total Apartments -->
		<div class="bg-white rounded-lg shadow-sm p-6">
			<div class="flex items-center">
				<div class="flex-shrink-0 p-3 bg-green-100 rounded-lg">
					<span class="material-symbols-outlined text-green-600">door_front</span>
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-500">Apartments</p>
					<p class="text-2xl font-semibold text-gray-900">{stats.totalApartments}</p>
				</div>
			</div>
		</div>

		<!-- Occupancy Rate -->
		<div class="bg-white rounded-lg shadow-sm p-6">
			<div class="flex items-center">
				<div class="flex-shrink-0 p-3 bg-purple-100 rounded-lg">
					<span class="material-symbols-outlined text-purple-600">trending_up</span>
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-500">Occupancy Rate</p>
					<p class="text-2xl font-semibold text-gray-900">{occupancyRate}%</p>
				</div>
			</div>
			<div class="mt-3">
				<div class="w-full bg-gray-200 rounded-full h-2">
					<div
						class="bg-purple-600 h-2 rounded-full transition-all duration-300"
						style="width: {occupancyRate}%"
					></div>
				</div>
				<p class="mt-1 text-xs text-gray-500">
					{stats.occupiedApartments} occupied, {stats.vacantApartments} vacant
				</p>
			</div>
		</div>

		<!-- Pending Statements -->
		<div class="bg-white rounded-lg shadow-sm p-6">
			<div class="flex items-center">
				<div
					class="flex-shrink-0 p-3 rounded-lg {stats.overdueStatements > 0
						? 'bg-red-100'
						: 'bg-yellow-100'}"
				>
					<span
						class="material-symbols-outlined {stats.overdueStatements > 0
							? 'text-red-600'
							: 'text-yellow-600'}"
					>
						summarize
					</span>
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-500">Pending Statements</p>
					<p class="text-2xl font-semibold text-gray-900">{stats.pendingStatements}</p>
				</div>
			</div>
			{#if stats.overdueStatements > 0}
				<p class="mt-2 text-sm text-red-600">
					{stats.overdueStatements} overdue
				</p>
			{/if}
		</div>
	</div>

	<!-- Quick Actions -->
	<div class="bg-white rounded-lg shadow-sm p-6">
		<h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
		<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
			<a
				href="/buildings/new"
				class="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
			>
				<span class="material-symbols-outlined text-2xl text-blue-600 mb-2">add_business</span>
				<span class="text-sm font-medium text-gray-700">Add Building</span>
			</a>
			<a
				href="/tenants/new"
				class="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors"
			>
				<span class="material-symbols-outlined text-2xl text-green-600 mb-2">person_add</span>
				<span class="text-sm font-medium text-gray-700">Add Tenant</span>
			</a>
			<a
				href="/invoices/new"
				class="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
			>
				<span class="material-symbols-outlined text-2xl text-purple-600 mb-2">receipt</span>
				<span class="text-sm font-medium text-gray-700">Add Invoice</span>
			</a>
			<a
				href="/statements/generate"
				class="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-colors"
			>
				<span class="material-symbols-outlined text-2xl text-orange-600 mb-2">calculate</span>
				<span class="text-sm font-medium text-gray-700">Generate Statements</span>
			</a>
		</div>
	</div>
</div>
