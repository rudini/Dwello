<script lang="ts">
	import type { PageData } from './$types';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import StatCard from '$lib/components/StatCard.svelte';
	import ActivityFeed from '$lib/components/ActivityFeed.svelte';
	import OccupancyChart from '$lib/components/OccupancyChart.svelte';

	let { data }: { data: PageData } = $props();

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('de-CH', {
			style: 'currency',
			currency: 'CHF'
		}).format(amount);
	}
</script>

<svelte:head>
	<title>Dashboard - Dwello</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
			<p class="text-gray-500 mt-1">Willkommen bei Dwello</p>
		</div>
		<div class="flex items-center gap-3">
			<Button href="/invoices/new" variant="secondary">
				<Icon name="receipt" size={20} />
				Rechnung erfassen
			</Button>
			<Button href="/statements/generate" variant="primary">
				<Icon name="receipt_long" size={20} />
				Abrechnungen erstellen
			</Button>
		</div>
	</div>

	<!-- Portfolio Overview -->
	<div data-testid="portfolio-section">
		<h2 class="text-lg font-semibold text-gray-900 mb-4">Portfolio Übersicht</h2>
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<StatCard
				label="Gebäude"
				value={data.portfolio.totalBuildings}
				icon="apartment"
				iconColor="text-blue-600"
				href="/buildings"
			/>
			<StatCard
				label="Wohnungen"
				value={data.portfolio.totalApartments}
				icon="home"
				iconColor="text-purple-600"
				href="/apartments"
			/>
			<StatCard
				label="Vermietet"
				value={data.portfolio.occupiedApartments}
				icon="groups"
				iconColor="text-green-600"
				href="/tenants"
			/>
			<StatCard
				label="Wiedervermietet"
				value={data.portfolio.reletApartments}
				icon="event_available"
				iconColor="text-sky-600"
				href="/apartments?status=relet"
			/>
			<StatCard
				label="Leer"
				value={data.portfolio.vacantApartments}
				icon="door_open"
				iconColor="text-amber-600"
				href="/apartments?status=vacant"
			/>
			<StatCard
				label="Gesperrt"
				value={data.portfolio.reservedApartments}
				icon="block"
				iconColor="text-red-600"
				href="/apartments?status=reserved"
			/>
			<StatCard
				label="Belegungsrate"
				value="{data.portfolio.occupancyRate.toFixed(1)}%"
				icon="pie_chart"
				iconColor="text-orange-600"
			/>
		</div>
	</div>

	<!-- Financial Overview -->
	<div data-testid="financial-section">
		<h2 class="text-lg font-semibold text-gray-900 mb-4">Finanzen</h2>
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<StatCard
				label="Offene Abrechnungen"
				value={data.financial.outstandingStatements}
				icon="pending_actions"
				iconColor="text-yellow-600"
				href="/statements?status=sent"
			/>
			<StatCard
				label="Ausstehend"
				value={formatCurrency(data.financial.totalPending)}
				icon="account_balance_wallet"
				iconColor="text-blue-600"
			/>
			<StatCard
				label="Überfällig"
				value={formatCurrency(data.financial.overdueAmount)}
				icon="warning"
				iconColor="text-red-600"
				href="/statements?status=overdue"
			/>
			<StatCard
				label="Bezahlt (Monat)"
				value={formatCurrency(data.financial.paidThisMonth)}
				icon="payments"
				iconColor="text-green-600"
			/>
		</div>
	</div>

	<!-- Statements Status -->
	<div data-testid="statements-status-section">
		<h2 class="text-lg font-semibold text-gray-900 mb-4">Abrechnungen Status</h2>
		<div class="grid gap-4 sm:grid-cols-4">
			<a
				href="/statements?status=draft"
				data-testid="statements-draft"
				class="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-gray-300 transition-all"
			>
				<div class="flex items-center gap-3">
					<div class="p-2 bg-gray-100 rounded-lg">
						<Icon name="edit_note" size={24} class="text-gray-600" />
					</div>
					<div>
						<p class="text-2xl font-bold text-gray-900">{data.statements.draft}</p>
						<p class="text-sm text-gray-500">Entwürfe</p>
					</div>
				</div>
			</a>
			<a
				href="/statements?status=sent"
				data-testid="statements-sent"
				class="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-gray-300 transition-all"
			>
				<div class="flex items-center gap-3">
					<div class="p-2 bg-blue-100 rounded-lg">
						<Icon name="send" size={24} class="text-blue-600" />
					</div>
					<div>
						<p class="text-2xl font-bold text-gray-900">{data.statements.sent}</p>
						<p class="text-sm text-gray-500">Versendet</p>
					</div>
				</div>
			</a>
			<a
				href="/statements?status=paid"
				data-testid="statements-paid"
				class="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-gray-300 transition-all"
			>
				<div class="flex items-center gap-3">
					<div class="p-2 bg-green-100 rounded-lg">
						<Icon name="check_circle" size={24} class="text-green-600" />
					</div>
					<div>
						<p class="text-2xl font-bold text-gray-900">{data.statements.paid}</p>
						<p class="text-sm text-gray-500">Bezahlt</p>
					</div>
				</div>
			</a>
			<a
				href="/statements?status=overdue"
				data-testid="statements-overdue"
				class="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-gray-300 transition-all"
			>
				<div class="flex items-center gap-3">
					<div class="p-2 bg-red-100 rounded-lg">
						<Icon name="warning" size={24} class="text-red-600" />
					</div>
					<div>
						<p class="text-2xl font-bold text-gray-900">{data.statements.overdue}</p>
						<p class="text-sm text-gray-500">Überfällig</p>
					</div>
				</div>
			</a>
		</div>
	</div>

	<!-- Two Column Layout: Activity + Occupancy -->
	<div class="grid gap-6 lg:grid-cols-2">
		<!-- Recent Activity -->
		<ActivityFeed activities={data.recentActivity} maxItems={5} />

		<!-- Occupancy Chart -->
		<OccupancyChart buildings={data.buildingOccupancy} />
	</div>

	<!-- Quick Actions Footer -->
	<div class="bg-white border border-gray-200 rounded-xl p-6">
		<h3 class="text-lg font-semibold text-gray-900 mb-4">Schnellaktionen</h3>
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<a
				href="/buildings/new"
				class="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
			>
				<div class="p-2 bg-blue-100 rounded-lg">
					<Icon name="add_business" size={24} class="text-blue-600" />
				</div>
				<div>
					<p class="font-medium text-gray-900">Gebäude hinzufügen</p>
					<p class="text-sm text-gray-500">Neues Gebäude erfassen</p>
				</div>
			</a>
			<a
				href="/tenants/new"
				class="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
			>
				<div class="p-2 bg-green-100 rounded-lg">
					<Icon name="person_add" size={24} class="text-green-600" />
				</div>
				<div>
					<p class="font-medium text-gray-900">Mieter hinzufügen</p>
					<p class="text-sm text-gray-500">Neuen Mieter erfassen</p>
				</div>
			</a>
			<a
				href="/invoices/new"
				class="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
			>
				<div class="p-2 bg-purple-100 rounded-lg">
					<Icon name="receipt" size={24} class="text-purple-600" />
				</div>
				<div>
					<p class="font-medium text-gray-900">Rechnung erfassen</p>
					<p class="text-sm text-gray-500">Neue Rechnung hinzufügen</p>
				</div>
			</a>
			<a
				href="/statements/generate"
				class="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
			>
				<div class="p-2 bg-orange-100 rounded-lg">
					<Icon name="calculate" size={24} class="text-orange-600" />
				</div>
				<div>
					<p class="font-medium text-gray-900">Abrechnungen erstellen</p>
					<p class="text-sm text-gray-500">Neue NK-Abrechnungen</p>
				</div>
			</a>
		</div>
	</div>
</div>
