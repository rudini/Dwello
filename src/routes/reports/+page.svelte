<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import EmptyState from '$lib/ui/EmptyState.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{m.reports_title()} - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8">
	<PageHeader title={m.reports_title()} purpose={m.reports_purpose()} />
	{#if data.periods.length === 0}
		<EmptyState
			testid="reports-empty"
			illustration="statement"
			title={m.reports_empty_title()}
			text={m.reports_empty_text()}
			actionLabel={m.dashboard_create_statements()}
			actionHref="/statements/generate"
		/>
	{:else}
		<section aria-labelledby="reports-heading" class="flex flex-col gap-4">
			<h2 id="reports-heading" class="text-xl font-bold text-ink">{m.reports_list_title()}</h2>
			<!-- each row is one link, named by its building and period -->
			<ul class="flex flex-col divide-y divide-line rounded-panel border border-line bg-surface">
				{#each data.periods as period (period.key)}
					<li class="relative flex min-h-12 items-center px-4 py-4">
						<a
							href={period.href}
							class="font-semibold text-accent underline underline-offset-4 after:absolute after:inset-0 hover:text-accent-strong"
							data-testid="report-period-{period.key}">{period.name}</a
						>
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</div>
