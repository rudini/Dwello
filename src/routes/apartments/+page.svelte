<script lang="ts">
	import { page } from '$app/stores';
	import type { ApartmentsListData } from '$lib/types';
	import Button from '$lib/ui/Button.svelte';
	import EmptyState from '$lib/ui/EmptyState.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Pagination from '$lib/ui/Pagination.svelte';
	import ApartmentCard from './ApartmentCard.svelte';
	import ApartmentFilters from './ApartmentFilters.svelte';
	import StatusLegend from './StatusLegend.svelte';

	let { data }: { data: ApartmentsListData } = $props();

	const filtered = $derived(
		['search', 'building', 'status'].some((key) => $page.url.searchParams.get(key))
	);
</script>

<svelte:head>
	<title>Wohnungen - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8" data-testid="apartments-page">
	<PageHeader title="Wohnungen" purpose="Alle Wohnungen Ihrer Gebäude mit Mietstatus.">
		{#snippet action()}
			<Button href="/apartments/new" variant="primary" icon="add" testid="apartments-new-button"
				>Wohnung erfassen</Button
			>
		{/snippet}
	</PageHeader>

	<ApartmentFilters buildings={data.buildings} />

	{#if data.apartments.length === 0}
		<section class="rounded-panel border border-line bg-surface">
			{#if filtered}
				<EmptyState
					title="Keine Wohnungen gefunden"
					text="Keine Wohnung passt zu Ihrer Suche. Wählen Sie andere Filter oder zeigen Sie alle Wohnungen."
					illustration="no-results"
					actionLabel="Filter zurücksetzen"
					actionHref="/apartments"
					testid="apartments-empty"
				/>
			{:else}
				<EmptyState
					title="Noch keine Wohnungen"
					text="Erfassen Sie die Wohnungen Ihrer Gebäude, damit Sie sie vermieten und abrechnen können."
					illustration="apartment"
					actionLabel="Wohnung erfassen"
					actionHref="/apartments/new"
					testid="apartments-empty"
				/>
			{/if}
		</section>
	{:else}
		<section aria-labelledby="apartments-count" class="flex flex-col gap-4">
			<h2 id="apartments-count" tabindex="-1" data-results class="text-xl font-bold text-ink">
				{data.total === 1 ? '1 Wohnung' : `${data.total} Wohnungen`}
			</h2>
			<ul class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{#each data.apartments as apartment (apartment.id)}
					<ApartmentCard {apartment} />
				{/each}
			</ul>
		</section>
		<Pagination url={$page.url} page={data.page} pageSize={data.pageSize} total={data.total} />
		<StatusLegend />
	{/if}
</div>
