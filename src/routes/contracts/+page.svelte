<script lang="ts">
	import { page } from '$app/stores';
	import type { ContractsListData } from '$lib/types';
	import Button from '$lib/ui/Button.svelte';
	import EmptyState from '$lib/ui/EmptyState.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Pagination from '$lib/ui/Pagination.svelte';
	import ContractFilters from './ContractFilters.svelte';
	import ContractRow from './ContractRow.svelte';

	let { data }: { data: ContractsListData } = $props();

	const filters = $derived({
		search: $page.url.searchParams.get('search') ?? '',
		building: $page.url.searchParams.get('building') ?? '',
		status: $page.url.searchParams.get('status') ?? ''
	});
	const filtered = $derived(Object.values(filters).some(Boolean));
</script>

<svelte:head>
	<title>Mietverträge - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8" data-testid="contracts-page">
	<PageHeader
		title="Mietverträge"
		purpose="Wer mietet welche Wohnung, seit wann und zu welcher Miete."
	>
		{#snippet action()}
			<Button href="/contracts/new" variant="primary" icon="contract" testid="contract-new-button"
				>Mietvertrag erfassen</Button
			>
		{/snippet}
	</PageHeader>

	<ContractFilters {filters} buildings={data.buildings} />

	{#if data.contracts.length === 0}
		<div class="rounded-panel border border-line bg-surface">
			{#if filtered}
				<EmptyState
					title="Keine Mietverträge gefunden"
					text="Kein Mietvertrag passt zur Suche und zu den Filtern."
					illustration="no-results"
					actionLabel="Filter zurücksetzen"
					actionHref="/contracts"
					testid="contracts-empty"
				/>
			{:else}
				<EmptyState
					title="Noch keine Mietverträge"
					text="Ein Mietvertrag verbindet einen Mieter mit einer Wohnung, ab einem Vertragsbeginn und zu einer Miete."
					illustration="contract"
					actionLabel="Mietvertrag erfassen"
					actionHref="/contracts/new"
					testid="contracts-empty"
				/>
			{/if}
		</div>
	{:else}
		<section aria-labelledby="contracts-count" class="flex flex-col gap-4">
			<h2 id="contracts-count" class="text-xl font-bold text-ink">
				{data.total}
				{data.total === 1 ? 'Mietvertrag' : 'Mietverträge'}
			</h2>
			<ul class="flex flex-col divide-y divide-line rounded-panel border border-line bg-surface">
				{#each data.contracts as contract (contract.id)}
					<ContractRow {contract} today={data.today} />
				{/each}
			</ul>
		</section>
		<Pagination url={$page.url} page={data.page} pageSize={data.pageSize} total={data.total} />
	{/if}
</div>
