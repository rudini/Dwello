<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { StatementsListData } from '$lib/types';
	import { statusLabels } from '$lib/statement';
	import Icon from '$lib/ui/Icon.svelte';

	// How many statements are in each status; a status is a filter that a second click switches off. Above it, which
	// statements the list shows, the way to all of them and back to the contract it is filtered by (#673)
	let {
		scope = '',
		contract = '',
		counts,
		active,
		href
	}: {
		scope?: string;
		contract?: string;
		counts: StatementsListData['statusCounts'];
		active: string;
		href: (status: string) => string;
	} = $props();

	// #1162 (Marco M-2, Helga H-1): a tile keeps the focus and the page stays put, so the chosen filter stays in view on a
	// phone and at 150 %; WebKit does not focus a link on a click, so the click does
	// a replaced statement has no tab of its own: «Alle» lists it (#120)
	const statuses: (keyof StatementsListData['statusCounts'])[] = [
		'draft',
		'sent',
		'paid',
		'settled',
		'overdue'
	];
</script>

{#if scope}
	<p class="text-ink" data-testid="statements-scope">
		{scope}
		<a
			href="/statements"
			class="inline-flex min-h-12 items-center text-accent underline underline-offset-4 hover:text-accent-strong"
			>{m.statements_scope_all()}</a
		>
		{#if contract}
			<a
				href="/contracts/{encodeURIComponent(contract)}"
				class="inline-flex min-h-12 items-center text-accent underline underline-offset-4 hover:text-accent-strong"
				data-testid="statements-scope-contract-link">{m.statements_scope_contract_link()}</a
			>
		{/if}
	</p>
{/if}

<nav aria-label={m.statements_filter_status()}>
	<ul class="grid grid-cols-2 gap-4 @lg:grid-cols-5">
		{#each statuses as status (status)}
			<li>
				<a
					href={href(active === status ? '' : status)}
					aria-current={active === status ? 'true' : undefined}
					data-sveltekit-keepfocus
					data-sveltekit-noscroll
					onclick={(event) => event.currentTarget.focus()}
					class="flex min-h-12 flex-col rounded-panel border-2 p-4 {active === status
						? 'border-accent bg-accent-soft'
						: 'border-line bg-surface hover:border-line-strong'}"
					data-testid="filter-{status}"
				>
					<span class="text-2xl font-bold tabular-nums text-ink" data-testid="filter-count"
						>{counts[status]}</span
					>
					<span class="text-ink">{statusLabels[status]}</span>
					<!-- #673 (Marco P-7): chosen not by colour alone, and what a second tap does -->
					{#if active === status}
						<span class="flex items-center gap-2 text-ink-muted"
							><Icon name="check" />{m.statements_filter_clear()}</span
						>
					{/if}
				</a>
			</li>
		{/each}
	</ul>
</nav>
