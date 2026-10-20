<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';
	import { statusLabels } from '$lib/statement';
	import type { BilledStatement } from '$lib/types';
	import { formatDate } from '$lib/utils/format';
	import type { Snippet } from 'svelte';

	// The periods whose statements took this invoice: changing or deleting it makes them wrong
	let {
		periods,
		statements = [],
		children
	}: {
		periods: { start: string; end: string }[];
		statements?: BilledStatement[];
		children: Snippet;
	} = $props();
</script>

<Alert tone="caution" title={m.invoices_billed_title()} testid="invoice-billed-warning">
	{#each periods as period (`${period.start}-${period.end}`)}
		<p>
			{m.invoices_billed_period({ start: formatDate(period.start), end: formatDate(period.end) })}
		</p>
	{/each}
	{#if statements.length}
		<p>{m.invoices_billed_in()}</p>
		<ul class="flex flex-col gap-1">
			{#each statements as statement (statement.id)}
				<li>
					{m.invoices_billed_in_entry({
						number: statement.statementNumber,
						status: statusLabels[statement.status]
					})}
				</li>
			{/each}
		</ul>
	{/if}
	{@render children()}
</Alert>
