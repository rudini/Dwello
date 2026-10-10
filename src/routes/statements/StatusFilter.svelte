<script lang="ts">
	import type { StatementStatus, StatementsListData } from '$lib/types';
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

	const statuses: StatementStatus[] = ['draft', 'sent', 'paid', 'overdue'];
</script>

<nav aria-label="Nach Status filtern">
	<ul class="grid grid-cols-2 gap-4 md:grid-cols-4">
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
					<span class="text-2xl font-bold tabular-nums text-ink">{counts[status]}</span>
					<span class="text-ink">{statusLabels[status]}</span>
				</a>
			</li>
		{/each}
	</ul>
</nav>
