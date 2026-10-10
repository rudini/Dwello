<script lang="ts">
	import Panel from '$lib/ui/Panel.svelte';
	import { formatCurrency, formatDate } from '$lib/utils/format';
	import type { DashboardData } from './+page.server';

	// Counts that lead to the filtered lists, and the rented share per building
	let { data }: { data: DashboardData } = $props();

	const figures = $derived([
		{
			label: 'Gebäude',
			value: data.portfolio.totalBuildings,
			href: '/buildings',
			testid: 'stat-buildings'
		},
		{
			label: 'Wohnungen',
			value: data.portfolio.totalApartments,
			href: '/apartments',
			testid: 'stat-apartments'
		},
		{
			label: 'Vermietet',
			value: data.portfolio.occupiedApartments,
			href: '/apartments?status=occupied',
			testid: 'stat-occupied'
		},
		{
			label: 'Wiedervermietet',
			value: data.portfolio.reletApartments,
			href: '/apartments?status=relet',
			testid: 'stat-relet'
		},
		{
			label: 'Leer',
			value: data.portfolio.vacantApartments,
			href: '/apartments?status=vacant',
			testid: 'stat-vacant'
		},
		{
			label: 'Gesperrt',
			value: data.portfolio.reservedApartments,
			href: '/apartments?status=reserved',
			testid: 'stat-reserved'
		}
	]);
	// The relet apartments as the building cards count them, by the start of their future contract
	function reletParts(starts: string[] = []) {
		const counts = new Map<string, number>();
		for (const start of starts) counts.set(start, (counts.get(start) ?? 0) + 1);
		return [...counts].map(([start, count]) => `, ${count} ab ${formatDate(start)}`).join('');
	}
	const statementFigures = [
		{ status: 'draft', label: 'Entwurf' },
		{ status: 'sent', label: 'Versendet' },
		{ status: 'paid', label: 'Bezahlt' },
		{ status: 'overdue', label: 'Überfällig' }
	] as const;
</script>

<section aria-labelledby="buildings-heading" class="flex flex-col gap-4">
	<h2 id="buildings-heading" class="text-2xl font-bold text-ink">Gebäude auf einen Blick</h2>
	<div class="grid gap-6 lg:grid-cols-2">
		<Panel title="Gebäude und Wohnungen" level={3}>
			<ul class="grid grid-cols-2 gap-2 sm:grid-cols-3">
				{#each figures as figure (figure.testid)}
					<li>
						<a
							href={figure.href}
							data-testid={figure.testid}
							class="flex min-h-12 flex-col rounded-control p-2 hover:bg-sunken"
						>
							<span class="text-2xl font-bold tabular-nums text-ink">{figure.value}</span>
							<span class="text-ink-muted">{figure.label}</span>
						</a>
					</li>
				{/each}
			</ul>
		</Panel>

		<Panel title="Nebenkostenabrechnungen" level={3}>
			<ul class="grid grid-cols-2 gap-2">
				{#each statementFigures as figure (figure.status)}
					<li>
						<a
							href="/statements?status={figure.status}"
							data-testid="statements-{figure.status}"
							class="flex min-h-12 flex-col rounded-control p-2 hover:bg-sunken"
						>
							<span
								class="text-2xl font-bold tabular-nums text-ink"
								data-testid="statements-{figure.status}-count"
								>{data.statements[figure.status]}</span
							>
							<span class="text-ink-muted">{figure.label}</span>
						</a>
					</li>
				{/each}
			</ul>
			<a
				href="/statements?status=overdue"
				data-testid="stat-overdue-amount"
				class="flex min-h-12 items-center justify-between gap-4 rounded-control p-2 hover:bg-sunken"
			>
				<span class="text-ink-muted">Überfällige Beträge</span>
				<span class="font-bold tabular-nums text-ink"
					>{formatCurrency(data.financial.overdueAmount)}</span
				>
			</a>
		</Panel>
	</div>

	{#if data.buildingOccupancy.length}
		<Panel title="Vermietete Wohnungen pro Gebäude" level={3}>
			<!-- TODO(fachlich prüfen): share of rented apartments has no glossary term ("Belegungsrate") -->
			<ul class="flex flex-col divide-y divide-line">
				{#each data.buildingOccupancy as building (building.buildingId)}
					<li data-testid="occupancy-row" class="flex min-h-12 flex-wrap items-center gap-4 py-2">
						<a
							href="/buildings/{building.buildingId}"
							data-testid="occupancy-building"
							class="inline-flex min-h-12 flex-1 items-center font-semibold text-accent underline underline-offset-4"
							>{building.buildingName}</a
						>
						<span class="tabular-nums text-ink-muted"
							><span data-testid="occupancy-count"
								>{building.occupiedApartments}/{building.totalApartments}</span
							>
							vermietet{reletParts(building.reletStarts)}</span
						>
						<span
							class="w-16 text-right font-semibold tabular-nums text-ink"
							data-testid="occupancy-rate">{building.occupancyRate.toFixed(1)}%</span
						>
					</li>
				{/each}
			</ul>
		</Panel>
	{/if}
</section>
