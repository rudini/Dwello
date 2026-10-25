<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { StatementsListData } from '$lib/types';
	import { statusLabels } from '$lib/statement';

	// How many statements are in each status; a status is a filter that a second click switches off
	let {
		counts,
		active,
		href
	}: {
		counts: StatementsListData['statusCounts'];
		active: string;
		href: (status: string) => string;
	} = $props();

	// a replaced statement has no tab of its own: «Alle» lists it (#120)
	const statuses: (keyof StatementsListData['statusCounts'])[] = [
		'draft',
		'sent',
		'paid',
		'settled',
		'overdue'
	];
</script>

<nav aria-label={m.statements_filter_status()}>
	<ul class="grid grid-cols-2 gap-4 md:grid-cols-5">
		{#each statuses as status (status)}
			<li>
				<a
					href={href(active === status ? '' : status)}
					aria-current={active === status ? 'true' : undefined}
					class="flex min-h-12 flex-col rounded-panel border-2 p-4 {active === status
						? 'border-accent bg-accent-soft'
						: 'border-line bg-surface hover:border-line-strong'}"
					data-testid="filter-{status}"
				>
					<span class="text-2xl font-bold tabular-nums text-ink" data-testid="filter-count"
						>{counts[status]}</span
					>
					<span class="text-ink">{statusLabels[status]}</span>
				</a>
			</li>
		{/each}
	</ul>
</nav>
