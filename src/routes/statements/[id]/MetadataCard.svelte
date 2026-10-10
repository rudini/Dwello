<script lang="ts">
	import Panel from '$lib/ui/Panel.svelte';

	// When the statement and its PDF were made
	let { createdAt, pdfGeneratedAt }: { createdAt?: string | null; pdfGeneratedAt?: string | null } =
		$props();

	const dates = $derived(
		[
			{ label: 'Erstellt', date: createdAt },
			{ label: 'PDF erstellt', date: pdfGeneratedAt }
		].filter((row) => row.date)
	);
</script>

{#if dates.length}
	<Panel title="Verlauf" level={2}>
		<dl class="flex flex-col gap-2">
			{#each dates as row (row.label)}
				<div class="flex justify-between gap-4">
					<dt class="text-ink-muted">{row.label}</dt>
					<dd class="text-ink">{new Date(row.date!).toLocaleString('de-CH')}</dd>
				</div>
			{/each}
		</dl>
	</Panel>
{/if}
