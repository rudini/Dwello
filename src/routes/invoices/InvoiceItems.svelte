<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { InvoiceWithDetails } from '$lib/types';
	import InvoiceRow from './InvoiceRow.svelte';

	// The rows of the list; with the filter «Abrechnungsperiode» by allocability, the allocable ones being those a
	// statement of the period takes (#454, Fachreview 454-1 E-1)
	let { invoices, grouped }: { invoices: InvoiceWithDetails[]; grouped: boolean } = $props();

	const groups = $derived(
		[
			{
				key: 'allocable',
				title: m.invoices_group_allocable(),
				list: invoices.filter((i) => i.isValidUtilityCost)
			},
			{
				key: 'not-allocable',
				title: m.invoices_group_not_allocable(),
				list: invoices.filter((i) => !i.isValidUtilityCost)
			}
		].filter((group) => group.list.length)
	);
</script>

{#if !grouped}
	{#each invoices as invoice (invoice.id)}
		<InvoiceRow {invoice} />
	{/each}
{/if}
{#each grouped ? groups : [] as group (group.key)}
	<li data-testid="invoice-group-{group.key}">
		<h3 class="p-4 font-semibold text-ink" data-testid="invoice-group-title">{group.title}</h3>
		<ul class="divide-y divide-line border-t border-line">
			{#each group.list as invoice (invoice.id)}
				<InvoiceRow {invoice} />
			{/each}
		</ul>
	</li>
{/each}
