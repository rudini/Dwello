<script lang="ts">
	import { m } from '$lib/paraglide/messages';
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
	<title>{m.nav_apartments()} - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8" data-testid="apartments-page">
	<PageHeader title={m.nav_apartments()} purpose={m.apartments_purpose()}>
		{#snippet action()}
			<Button href="/apartments/new" variant="primary" icon="add" testid="apartments-new-button"
				>{m.buildings_add_apartment()}</Button
			>
		{/snippet}
	</PageHeader>

	<!-- new for each address: after a link, back or forward the form shows the filters of the list shown (#159) -->
	{#key $page.url.search}
		<ApartmentFilters buildings={data.buildings} />
	{/key}

	{#if data.apartments.length === 0}
		<section class="rounded-panel border border-line bg-surface">
			{#if filtered}
				<EmptyState
					title={m.apartments_none_found()}
					text={m.apartments_none_found_text()}
					illustration="no-results"
					actionLabel={m.buildings_reset_filters()}
					actionHref="/apartments"
					actionTestid="apartments-show-all"
					testid="apartments-empty"
				/>
			{:else}
				<EmptyState
					title={m.buildings_no_apartments()}
					text={m.apartments_none_yet_text()}
					illustration="apartment"
					actionLabel={m.buildings_add_apartment()}
					actionHref="/apartments/new"
					testid="apartments-empty"
				/>
			{/if}
		</section>
	{:else}
		<section aria-labelledby="apartments-count" class="flex flex-col gap-4">
			<h2 id="apartments-count" tabindex="-1" data-results class="text-xl font-bold text-ink">
				{(data.total === 1 ? m.apartments_count_one : m.apartments_count_many)({
					count: data.total
				})}
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
