<script lang="ts">
	import { page } from '$app/stores';
	import { listPageUrl } from '$lib/list-url';
	import type { TenantsListData } from '$lib/types';
	import Button from '$lib/ui/Button.svelte';
	import EmptyState from '$lib/ui/EmptyState.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Pager from '$lib/ui/Pager.svelte';
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
	<title>Mieter - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8" data-testid="tenants-page">
	<PageHeader
		title="Mieter"
		purpose="Die Personen, die Ihre Wohnungen mieten oder gemietet haben, mit Kontaktdaten und Wohnung."
	>
		{#snippet action()}
			<Button href="/tenants/new" variant="primary" icon="user-add" testid="tenants-new-button"
				>Mieter erfassen</Button
			>
		{/snippet}
	</PageHeader>

	<TenantFilters {filters} />

	{#if data.tenants.length === 0}
		<div class="rounded-panel border border-line bg-surface">
			{#if filtered}
				<EmptyState
					title="Keine Mieter gefunden"
					text="Kein Mieter passt zur Suche und zum Filter."
					illustration="no-results"
					actionLabel="Filter zurücksetzen"
					actionHref="/tenants"
					testid="tenants-empty"
				/>
			{:else}
				<EmptyState
					title="Noch keine Mieter"
					text="Erfassen Sie zuerst die Mieter mit ihren Kontaktdaten. Danach verbinden Sie sie mit einem Mietvertrag mit ihrer Wohnung."
					illustration="apartment"
					actionLabel="Mieter erfassen"
					actionHref="/tenants/new"
					testid="tenants-empty"
				/>
			{/if}
		</div>
	{:else}
		<section aria-labelledby="tenants-count" class="flex flex-col gap-4">
			<h2 id="tenants-count" class="text-xl font-bold text-ink">{data.total} Mieter</h2>
			<ul class="flex flex-col divide-y divide-line rounded-panel border border-line bg-surface">
				{#each data.tenants as tenant (tenant.id)}
					<TenantRow {tenant} />
				{/each}
			</ul>
		</section>
		<Pager
			page={data.page}
			pageSize={data.pageSize}
			total={data.total}
			href={(to) => listPageUrl($page.url, to)}
		/>
	{/if}
</div>
