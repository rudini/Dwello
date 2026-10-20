<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { BuildingsListData } from '$lib/types';
	import { listSearchUrl } from '$lib/list-url';
	import Button from '$lib/ui/Button.svelte';
	import EmptyState from '$lib/ui/EmptyState.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Pagination from '$lib/ui/Pagination.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';
	import BuildingCard from './BuildingCard.svelte';

	let { data }: { data: BuildingsListData } = $props();

	// follow the address, so a link, back or forward shows the filters of the list shown (#159); only the address:
	// the store also reports other changes, and these reset a term typed meanwhile (O-41)
	const query = $derived($page.url.search);
	const param = (key: string) => new URLSearchParams(query).get(key) || '';
	let searchTerm = $derived(param('search'));
	let cityFilter = $derived(param('city'));
	const filtered = $derived(['search', 'city'].some((key) => param(key)));

	function handleSearch(event: SubmitEvent) {
		event.preventDefault();
		goto(listSearchUrl('/buildings', { search: searchTerm, city: cityFilter }));
	}

	function clearFilters() {
		searchTerm = '';
		cityFilter = '';
		goto('/buildings');
	}
</script>

<svelte:head>
	<title>{m.nav_buildings()} - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8" data-testid="buildings-page">
	<PageHeader title={m.nav_buildings()} purpose={m.buildings_purpose()}>
		{#snippet action()}
			<Button href="/buildings/new" variant="primary" icon="add" testid="building-new-button"
				>{m.buildings_add()}</Button
			>
		{/snippet}
	</PageHeader>

	<form
		role="search"
		onsubmit={handleSearch}
		class="flex flex-col gap-4 rounded-panel border border-line bg-surface p-6"
	>
		<div class="grid gap-4 md:grid-cols-2">
			<TextInput
				id="search"
				label={m.buildings_search()}
				bind:value={searchTerm}
				placeholder={m.buildings_search_placeholder()}
				optional
				testid="building-search-input"
			/>
			<TextInput
				id="city"
				label={m.buildings_city()}
				bind:value={cityFilter}
				placeholder={m.buildings_city_placeholder()}
				optional
				testid="building-city-filter"
			/>
		</div>
		<div class="flex flex-wrap gap-4">
			<Button type="submit" icon="search" testid="building-search-submit"
				>{m.buildings_search_submit()}</Button
			>
			{#if searchTerm || cityFilter}
				<Button variant="ghost" icon="close" onclick={clearFilters}
					>{m.buildings_reset_filters()}</Button
				>
			{/if}
		</div>
	</form>

	{#if data.buildings.length === 0}
		<section class="rounded-panel border border-line bg-surface">
			{#if filtered}
				<EmptyState
					title={m.buildings_none_found()}
					text={m.buildings_none_found_text()}
					illustration="no-results"
					actionLabel={m.buildings_reset_filters()}
					actionHref="/buildings"
					testid="buildings-empty"
				/>
			{:else}
				<EmptyState
					title={m.buildings_none_yet()}
					text={m.buildings_none_yet_text()}
					illustration="building"
					actionLabel={m.buildings_add()}
					actionHref="/buildings/new"
					testid="buildings-empty"
				/>
			{/if}
		</section>
	{:else}
		<section aria-labelledby="buildings-count" class="flex flex-col gap-4">
			<h2 id="buildings-count" tabindex="-1" data-results class="text-xl font-bold text-ink">
				{(data.total === 1 ? m.buildings_count_one : m.buildings_count_many)({ count: data.total })}
			</h2>
			<ul class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{#each data.buildings as building (building.id)}
					<BuildingCard {building} />
				{/each}
			</ul>
		</section>
		<Pagination url={$page.url} page={data.page} pageSize={data.pageSize} total={data.total} />
	{/if}
</div>
