<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Table from '$lib/ui/Table.svelte';
	import { formatCurrency } from '$lib/utils/format';

	// #1409: one part of the Jahresbericht, its help text, its notes (Fachreview 1409-2 V-14) and its rows with their amounts; a total in bold
	let {
		section
	}: {
		section: {
			key: string;
			heading: string;
			help: string;
			notes: string[];
			rows: { label: string; amount: number; total?: boolean }[];
		};
	} = $props();
	const weight = (total?: boolean) => (total ? 'font-semibold' : 'font-normal');
</script>

<div class="flex flex-col gap-4" data-testid="annual-report-{section.key}">
	<p class="text-ink-muted" data-testid="annual-report-help">{section.help}</p>
	{#each section.notes as note, i (i)}
		<p class="text-ink" data-testid="annual-report-note">{note}</p>
	{/each}
	<Table
		caption={section.heading}
		columns={[{ label: m.analytics_item() }, { label: m.invoices_amount(), numeric: true }]}
	>
		{#each section.rows as row, i (i)}
			<tr class={weight(row.total)}>
				<th scope="row" class="px-4 py-4 text-left text-ink {weight(row.total)}">{row.label}</th>
				<td class="text-right text-ink">{formatCurrency(row.amount)}</td>
			</tr>
		{/each}
	</Table>
</div>
