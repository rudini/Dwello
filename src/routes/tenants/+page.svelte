<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { page } from '$app/stores';
	import type { TenantsListData } from '$lib/types';
	import Button from '$lib/ui/Button.svelte';
	import EmptyState from '$lib/ui/EmptyState.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import ResultList from '$lib/ui/ResultList.svelte';
	import TenantFilters from './TenantFilters.svelte';
	import TenantRow from './TenantRow.svelte';

	let { data }: { data: TenantsListData } = $props();

	const filters = $derived({
		search: $page.url.searchParams.get('search') ?? '',
		status: $page.url.searchParams.get('status') ?? ''
	});
	const filtered = $derived(!!(filters.search || filters.status));
</script>

<svelte:head>
	<title>{m.nav_tenants()} - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8" data-testid="tenants-page">
	<PageHeader title={m.nav_tenants()} purpose={m.tenants_purpose()}>
		{#snippet action()}
			<Button href="/tenants/new" variant="primary" icon="user-add" testid="tenants-new-button"
				>{m.dashboard_add_tenant()}</Button
			>
		{/snippet}
	</PageHeader>

	<TenantFilters {filters} />

	{#if data.tenants.length === 0}
		<div class="rounded-panel border border-line bg-surface">
			{#if filtered}
				<EmptyState
					title={m.tenants_none_found()}
					text={m.tenants_none_found_text()}
					illustration="no-results"
					actionLabel={m.buildings_reset_filters()}
					actionHref="/tenants"
					testid="tenants-empty"
				/>
			{:else}
				<EmptyState
					title={m.tenants_none_yet()}
					text={m.tenants_none_yet_text()}
					illustration="apartment"
					actionLabel={m.dashboard_add_tenant()}
					actionHref="/tenants/new"
					testid="tenants-empty"
				/>
			{/if}
		</div>
	{:else}
		<ResultList
			id="tenants-count"
			heading={(data.total === 1 ? m.tenants_count_one : m.tenants_count_many)({
				count: data.total
			})}
			url={$page.url}
			page={data.page}
			pageSize={data.pageSize}
			total={data.total}
		>
			{#each data.tenants as tenant (tenant.id)}
				<TenantRow {tenant} />
			{/each}
		</ResultList>
	{/if}
</div>
