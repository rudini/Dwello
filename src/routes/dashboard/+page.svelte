<script lang="ts">
	import type { PageData } from './$types';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import StatCard from '$lib/components/StatCard.svelte';
	import ActivityFeed from '$lib/components/ActivityFeed.svelte';
	import OccupancyChart from '$lib/components/OccupancyChart.svelte';
	import StatementTiles from './StatementTiles.svelte';
	import QuickActions from './QuickActions.svelte';

	let { data }: { data: PageData } = $props();

	const chf = (amount: number) =>
		new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' }).format(amount);

	type Tile = {
		label: string;
		value: string | number;
		icon: string;
		iconColor: string;
		href?: string;
		testId: string;
	};
	const portfolio: Tile[] = $derived([
		{
			label: 'Gebäude',
			value: data.portfolio.totalBuildings,
			icon: 'apartment',
			iconColor: 'text-blue-600',
			href: '/buildings',
			testId: 'stat-buildings'
		},
		{
			label: 'Wohnungen',
			value: data.portfolio.totalApartments,
			icon: 'home',
			iconColor: 'text-purple-600',
			href: '/apartments',
			testId: 'stat-apartments'
		},
		{
			label: 'Vermietet',
			value: data.portfolio.occupiedApartments,
			icon: 'groups',
			iconColor: 'text-green-600',
			href: '/apartments?status=occupied',
			testId: 'stat-occupied'
		},
		{
			label: 'Wiedervermietet',
			value: data.portfolio.reletApartments,
			icon: 'event_available',
			iconColor: 'text-sky-600',
			href: '/apartments?status=relet',
			testId: 'stat-relet'
		},
		{
			label: 'Leer',
			value: data.portfolio.vacantApartments,
			icon: 'door_open',
			iconColor: 'text-amber-600',
			href: '/apartments?status=vacant',
			testId: 'stat-vacant'
		},
		{
			label: 'Gesperrt',
			value: data.portfolio.reservedApartments,
			icon: 'block',
			iconColor: 'text-red-600',
			href: '/apartments?status=reserved',
			testId: 'stat-reserved'
		},
		{
			label: 'Belegungsrate',
			value: `${data.portfolio.occupancyRate.toFixed(1)}%`,
			icon: 'pie_chart',
			iconColor: 'text-orange-600',
			testId: 'stat-occupancy-rate'
		}
	]);
	const financial: Tile[] = $derived([
		{
			label: 'Offene Abrechnungen',
			value: data.financial.outstandingStatements,
			icon: 'pending_actions',
			iconColor: 'text-yellow-600',
			testId: 'stat-open-statements'
		},
		{
			label: 'Ausstehende Nachzahlungen',
			value: chf(data.financial.totalPending),
			icon: 'account_balance_wallet',
			iconColor: 'text-blue-600',
			testId: 'stat-pending'
		},
		{
			label: 'Davon überfällig',
			value: chf(data.financial.overdueAmount),
			icon: 'warning',
			iconColor: 'text-red-600',
			href: '/statements?status=overdue',
			testId: 'stat-overdue-amount'
		},
		{
			label: 'Bezahlt (Monat)',
			value: chf(data.financial.paidThisMonth),
			icon: 'payments',
			iconColor: 'text-green-600',
			testId: 'stat-paid-month'
		}
	]);
</script>

<svelte:head>
	<title>Dashboard - Dwello</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
			<p class="text-gray-500 mt-1">Willkommen bei Dwello</p>
		</div>
		<div class="flex items-center gap-3">
			<Button href="/invoices/new" variant="secondary" testid="dashboard-action">
				<Icon name="receipt" size={20} />
				Rechnung erfassen
			</Button>
			<Button href="/statements/generate" variant="primary" testid="dashboard-action">
				<Icon name="receipt_long" size={20} />
				Abrechnungen erstellen
			</Button>
		</div>
	</div>

	<div data-testid="portfolio-section">
		<h2 class="text-lg font-semibold text-gray-900 mb-4">Portfolio</h2>
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{#each portfolio as tile (tile.testId)}
				<StatCard {...tile} />
			{/each}
		</div>
	</div>

	<div data-testid="financial-section">
		<h2 class="text-lg font-semibold text-gray-900 mb-4">Finanzen</h2>
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{#each financial as tile (tile.testId)}
				<StatCard {...tile} />
			{/each}
		</div>
	</div>

	<StatementTiles counts={data.statements} />

	<div class="grid gap-6 lg:grid-cols-2">
		<ActivityFeed activities={data.recentActivity} maxItems={5} />
		<OccupancyChart buildings={data.buildingOccupancy} />
	</div>

	<QuickActions />
</div>
