<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { invoiceRows } from '$lib/statement-wizard';
	import CategoryFindingItem from './CategoryFindingItem.svelte';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { formatDate } from '$lib/utils/format';

	// Categories that may lack invoices, per building, against the same dates one year earlier
	let {
		checked,
		comparedWith,
		confirm,
		newInvoice
	}: {
		checked: ReturnType<typeof invoiceRows>;
		comparedWith: { start: string; end: string } | null | undefined;
		confirm: boolean; // missing invoices (not only a deviation) need the confirmation below
		newInvoice: string;
	} = $props();

	const invoicesMissing = $derived(
		checked.some((row) => row.findings.some((f) => f.kind === 'missing' || f.kind === 'gap'))
	);

	const comparedText = $derived(
		comparedWith ? ` (${formatDate(comparedWith.start)} – ${formatDate(comparedWith.end)})` : ''
	);
</script>

<!-- TODO(fachlich prüfen, #65, #130): a hint against the year before; a supplier may bill differently -->
<Alert
	tone="caution"
	title={confirm ? m.statements_maybe_missing_title() : m.statements_compared_title()}
	testid="category-check"
>
	<div id="category-check-text" class="flex flex-col gap-2">
		<p>{m.statements_compared_text({ compared: comparedText })}</p>
		{#each checked as row (row.buildingId)}
			<p class="font-semibold" aria-hidden="true">{row.name}</p>
			<ul class="flex list-disc flex-col gap-2 pl-6" aria-label={row.name}>
				{#each row.findings as finding (`${finding.kind}-${finding.categoryId ?? finding.categoryName}`)}
					<CategoryFindingItem {finding} buildingId={row.buildingId} />
				{/each}
			</ul>
		{/each}
		{#if confirm && invoicesMissing}
			<p>
				<!-- TODO(fachlich prüfen, #70, #120): whether a paid statement can be corrected later is not settled -->
				{m.statements_missing_consequence()}
			</p>
			<p>{m.statements_add_missing()}</p>
		{:else if confirm}
			<p>{m.statements_check_stocks_text()}</p>
		{/if}
	</div>
	{#snippet action()}
		{#if confirm && invoicesMissing}
			<Button href={newInvoice} icon="invoice">{m.dashboard_add_invoice()}</Button>
		{/if}
	{/snippet}
</Alert>
