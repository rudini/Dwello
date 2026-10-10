<script lang="ts">
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

	let searchTerm = $state($page.url.searchParams.get('search') || '');
	let cityFilter = $state($page.url.searchParams.get('city') || '');
	const filtered = $derived(['search', 'city'].some((key) => $page.url.searchParams.get(key)));

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
	<title>Gebäude - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8" data-testid="buildings-page">
	<PageHeader title="Gebäude" purpose="{data.total} Gebäude in Ihrer Verwaltung">
		{#snippet action()}
			<Button href="/buildings/new" variant="primary" icon="add" testid="building-new-button"
				>Gebäude erfassen</Button
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
				label="Suche"
				bind:value={searchTerm}
				placeholder="Name oder Adresse"
				optional
				testid="building-search-input"
			/>
			<TextInput
				id="city"
				label="Ort"
				bind:value={cityFilter}
				placeholder="Zürich"
				optional
				testid="building-city-filter"
			/>
		</div>
		<div class="flex flex-wrap gap-4">
			<Button type="submit" icon="search" testid="building-search-submit">Suchen</Button>
			{#if searchTerm || cityFilter}
				<Button variant="ghost" icon="close" onclick={clearFilters}>Filter zurücksetzen</Button>
			{/if}
		</div>
	</form>

	{#if data.buildings.length === 0}
		<section class="rounded-panel border border-line bg-surface">
			{#if filtered}
				<EmptyState
					title="Keine Gebäude gefunden"
					text="Kein Gebäude passt zu Ihrer Suche. Prüfen Sie die Schreibweise oder zeigen Sie alle Gebäude."
					illustration="no-results"
					actionLabel="Filter zurücksetzen"
					actionHref="/buildings"
					testid="buildings-empty"
				/>
			{:else}
				<EmptyState
					title="Noch keine Gebäude"
					text="Erfassen Sie zuerst ein Gebäude. Danach legen Sie seine Wohnungen und Mietverträge an."
					illustration="building"
					actionLabel="Gebäude erfassen"
					actionHref="/buildings/new"
					testid="buildings-empty"
				/>
			{/if}
		</section>
	{:else}
		<section aria-labelledby="buildings-count" class="flex flex-col gap-4">
			<h2 id="buildings-count" tabindex="-1" data-results class="text-xl font-bold text-ink">
				{data.total} Gebäude
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
