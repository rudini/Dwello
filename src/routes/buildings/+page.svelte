<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { showAppliedFilter } from '$lib/utils/list-filter';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { BuildingsListData } from '$lib/types';
	import Button from '$lib/ui/Button.svelte';
	import EmptyState from '$lib/ui/EmptyState.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import ResultList from '$lib/ui/ResultList.svelte';
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

	function clearFilters() {
		searchTerm = '';
		cityFilter = '';
		goto('/buildings');
	}

	let form = $state<HTMLFormElement>();
	showAppliedFilter(() => form);
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

	<!-- a plain GET form: the browser sends a search made before the app reacts, the router one made after (#754) -->
	<form
		bind:this={form}
		method="GET"
		action="/buildings"
		role="search"
		aria-label={m.list_search_label()}
		class="flex flex-col gap-4 rounded-panel border border-line bg-surface p-6"
	>
		<div class="grid gap-4 md:grid-cols-2">
			<TextInput
				id="search"
				name="search"
				label={m.buildings_search()}
				bind:value={searchTerm}
				help={m.buildings_search_help()}
				required={false}
				testid="building-search-input"
			/>
			<TextInput
				id="city"
				name="city"
				label={m.buildings_city()}
				bind:value={cityFilter}
				required={false}
				testid="building-city-filter"
			/>
		</div>
		<div class="flex flex-wrap gap-4">
			<Button type="submit" icon="search" testid="building-search-submit"
				>{m.buildings_search_submit()}</Button
			>
			<!-- #682: only for a filter of the address; an empty list offers it in its hint -->
			{#if filtered && data.buildings.length}
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
		<ResultList
			id="buildings-count"
			counts={{
				one: m.buildings_count_one,
				many: m.buildings_count_many,
				pageOne: m.buildings_count_page_one,
				pageMany: m.buildings_count_page_many
			}}
			shown={data.buildings.length}
			listClass="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
			url={$page.url}
			page={data.page}
			pageSize={data.pageSize}
			total={data.total}
		>
			{#each data.buildings as building (building.id)}
				<BuildingCard {building} />
			{/each}
		</ResultList>
	{/if}
</div>
