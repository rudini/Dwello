<script lang="ts">
	import Panel from '$lib/ui/Panel.svelte';
	import { formatDate, formatDateTime } from '$lib/utils/format';

	// When the statement and its PDF were made, sent (its date, from which the deadline runs) and paid
	let {
		createdAt,
		pdfGeneratedAt,
		sentOn,
		paidOn
	}: {
		createdAt?: string | null;
		pdfGeneratedAt?: string | null;
		sentOn?: string | null;
		paidOn?: string | null;
	} = $props();

	const dates = $derived(
		[
			{ label: 'Erstellt', date: createdAt && formatDateTime(createdAt) },
			{ label: 'PDF erstellt', date: pdfGeneratedAt && formatDateTime(pdfGeneratedAt) },
			{ label: 'Versendet', date: sentOn && formatDate(sentOn) },
			{ label: 'Bezahlt', date: paidOn && formatDate(paidOn) }
		].filter((row) => row.date)
	);
</script>

{#if dates.length}
	<Panel title="Verlauf" level={2}>
		<dl class="flex flex-col gap-2">
			{#each dates as row (row.label)}
				<div class="flex justify-between gap-4">
					<dt class="text-ink-muted">{row.label}</dt>
					<dd class="text-ink">{row.date}</dd>
				</div>
			{/each}
		</dl>
	</Panel>
{/if}
