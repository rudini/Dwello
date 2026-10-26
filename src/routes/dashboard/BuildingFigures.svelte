<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Panel from '$lib/ui/Panel.svelte';
	import { reletParts, statusLabels } from '$lib/apartment';
	import { endedSince } from '$lib/contract-status';
	import { formatCurrency } from '$lib/utils/format';
	import type { PageData } from './$types';

	// Counts that lead to the filtered lists, and the rented share per building
	let { data }: { data: PageData } = $props();

	const figures = $derived([
		{
			label: m.nav_buildings(),
			value: data.portfolio.totalBuildings,
			href: '/buildings',
			testid: 'stat-buildings'
		},
		{
			label: m.nav_apartments(),
			value: data.portfolio.totalApartments,
			href: '/apartments',
			testid: 'stat-apartments'
		},
		{
			label: statusLabels.occupied,
			value: data.portfolio.occupiedApartments,
			href: '/apartments?status=occupied',
			testid: 'stat-occupied'
		},
		{
			label: statusLabels.relet,
			value: data.portfolio.reletApartments,
			href: '/apartments?status=relet',
			testid: 'stat-relet'
		},
		{
			label: statusLabels.vacant,
			value: data.portfolio.vacantApartments,
			href: '/apartments?status=vacant',
			testid: 'stat-vacant'
		},
		{
			label: statusLabels.reserved,
			value: data.portfolio.reservedApartments,
			href: '/apartments?status=reserved',
			testid: 'stat-reserved'
		}
	]);
	// The relet apartments as the building cards count them, and each empty one, since when if it had a contract (#145)
	const occupancyNotes = (building: PageData['buildingOccupancy'][number]) =>
		[
			...reletParts(building.reletStarts),
			...(building.vacant ?? []).map(({ number, lastContractEnd }) =>
				lastContractEnd
					? m.dashboard_vacant_since({ number, date: endedSince(lastContractEnd) })
					: m.dashboard_vacant({ number })
			)
		]
			.map((note) => `, ${note}`)
			.join('');
	const anyVacant = $derived(data.buildingOccupancy.some((b) => b.vacant?.length));
	const statementFigures = [
		{ status: 'draft', label: m.statements_status_draft() },
		{ status: 'sent', label: m.statements_status_sent() },
		{ status: 'paid', label: m.statements_status_paid() },
		{ status: 'settled', label: m.statements_status_settled() },
		{ status: 'overdue', label: m.statements_status_overdue() }
	] as const;
</script>

<section aria-labelledby="buildings-heading" class="flex flex-col gap-4">
	<h2 id="buildings-heading" class="text-2xl font-bold text-ink">{m.dashboard_glance_heading()}</h2>
	<div class="grid gap-6 lg:grid-cols-2">
		<Panel title={m.dashboard_buildings_apartments()} level={3}>
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

		<Panel title={m.nav_statements()} level={3}>
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
				<span class="text-ink-muted">{m.dashboard_overdue_amounts()}</span>
				<span class="font-bold tabular-nums text-ink"
					>{formatCurrency(data.financial.overdueAmount)}</span
				>
			</a>
		</Panel>
	</div>

	{#if data.buildingOccupancy.length}
		<Panel title={m.dashboard_occupancy_heading()} level={3}>
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
							{building.occupiedApartments === 1
								? m.dashboard_occupied_one()
								: m.dashboard_occupied()}{occupancyNotes(building)}</span
						>
					</li>
				{/each}
			</ul>
			{#if anyVacant}
				<p class="text-ink-muted" data-testid="occupancy-vacancy-help">
					{m.apartments_vacancy_costs_help()}
				</p>
			{/if}
		</Panel>
	{/if}
</section>
