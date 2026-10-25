<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { page } from '$app/stores';
	import type { ContractsListData } from '$lib/types';
	import Button from '$lib/ui/Button.svelte';
	import EmptyState from '$lib/ui/EmptyState.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import ResultList from '$lib/ui/ResultList.svelte';
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
	<title>{m.nav_contracts()} - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8" data-testid="contracts-page">
	<PageHeader title={m.nav_contracts()} purpose={m.contracts_list_purpose()}>
		{#snippet action()}
			<Button href="/contracts/new" variant="primary" icon="contract" testid="contract-new-button"
				>{m.dashboard_add_contract()}</Button
			>
		{/snippet}
	</PageHeader>

	<ContractFilters {filters} buildings={data.buildings} />

	{#if data.contracts.length === 0}
		<div class="rounded-panel border border-line bg-surface">
			{#if filtered}
				<EmptyState
					title={m.contracts_none_found()}
					text={m.contracts_none_found_text()}
					illustration="no-results"
					actionLabel={m.buildings_reset_filters()}
					actionHref="/contracts"
					testid="contracts-empty"
				/>
			{:else}
				<EmptyState
					title={m.contracts_none_yet()}
					text={m.contracts_none_yet_text()}
					illustration="contract"
					actionLabel={m.dashboard_add_contract()}
					actionHref="/contracts/new"
					testid="contracts-empty"
				/>
			{/if}
		</div>
	{:else}
		<ResultList
			id="contracts-count"
			heading={data.total === 1
				? m.contracts_count_one({ count: data.total })
				: m.contracts_count({ count: data.total })}
			url={$page.url}
			page={data.page}
			pageSize={data.pageSize}
			total={data.total}
		>
			{#each data.contracts as contract (contract.id)}
				<ContractRow {contract} />
			{/each}
		</ResultList>
	{/if}
</div>
