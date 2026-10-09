<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { ApartmentsListData } from '$lib/types';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import ApartmentCard from './ApartmentCard.svelte';
	import ApartmentFilters from './ApartmentFilters.svelte';

	let { data }: { data: ApartmentsListData } = $props();

	const filtered = $derived(
		['search', 'building', 'status'].some((key) => $page.url.searchParams.get(key))
	);

	function changePage(newPage: number) {
		const params = new URLSearchParams($page.url.searchParams);
		params.set('page', newPage.toString());
		goto(`/apartments?${params}`);
	}
</script>

<svelte:head>
	<title>Wohnungen - Dwello</title>
</svelte:head>

<div class="space-y-6" data-testid="apartments-page">
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Wohnungen</h1>
			<p class="text-ink-muted mt-1">{data.total} Wohnungen insgesamt</p>
		</div>
		<Button href="/apartments/new" variant="primary" testid="apartments-new-button">
			<Icon name="add" size={20} />
			Neue Wohnung
		</Button>
	</div>

	<ApartmentFilters buildings={data.buildings} />

	{#if data.apartments.length === 0}
		<Card>
			<div class="text-center py-12">
				<Icon name="door_front" size={48} class="mx-auto text-gray-300 mb-4" />
				<h3 class="text-lg font-medium text-gray-900 mb-2">Keine Wohnungen gefunden</h3>
				<p class="text-ink-muted mb-6">
					{filtered
						? 'Versuchen Sie es mit anderen Suchbegriffen oder Filtern.'
						: 'Erstellen Sie Ihre erste Wohnung, um loszulegen.'}
				</p>
				<Button href="/apartments/new" variant="primary">
					<Icon name="add" size={20} />
					Wohnung erstellen
				</Button>
			</div>
		</Card>
	{:else}
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each data.apartments as apartment (apartment.id)}
				<ApartmentCard {apartment} />
			{/each}
		</div>
		<Pagination
			page={data.page}
			pageSize={data.pageSize}
			total={data.total}
			onchange={changePage}
		/>
	{/if}
</div>
