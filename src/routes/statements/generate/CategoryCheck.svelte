<script lang="ts">
	import { findingText, type invoiceRows } from '$lib/statement-wizard';
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

	const comparedText = $derived(
		comparedWith ? ` (${formatDate(comparedWith.start)} – ${formatDate(comparedWith.end)})` : ''
	);
</script>

<!-- TODO(fachlich prüfen): a hint against the year before; a supplier may bill differently -->
<Alert
	tone="caution"
	title={confirm ? 'Möglicherweise fehlen Rechnungen' : 'Kosten im Vergleich zum Vorjahr'}
	testid="category-check"
>
	<div id="category-check-text" class="flex flex-col gap-2">
		<p>
			Dwello vergleicht jede Kategorie mit dem gleichen Zeitraum im Vorjahr{comparedText}. Ein
			Hinweis heisst nicht, dass etwas falsch ist: Vielleicht kommt die Rechnung später, oder der
			Lieferant rechnet anders ab.
		</p>
		{#each checked as row (row.buildingId)}
			<p class="font-semibold" aria-hidden="true">{row.name}</p>
			<ul class="flex list-disc flex-col gap-2 pl-6" aria-label={row.name}>
				{#each row.findings as finding (finding.categoryId ?? finding.categoryName)}
					<li data-testid="category-finding">
						<span class="font-semibold">{finding.categoryName}:</span>
						{findingText(finding)}
					</li>
				{/each}
			</ul>
		{/each}
		{#if confirm}
			<p>
				Fehlt eine Rechnung, fehlen ihre Kosten in jeder Abrechnung des Gebäudes. Später können Sie
				sie nur mit einer berichtigten Abrechnung nachverlangen.
			</p>
			<p>Erfassen Sie fehlende Rechnungen – oder bestätigen Sie unten, dass alles stimmt.</p>
		{/if}
	</div>
	{#snippet action()}
		{#if confirm}<Button href={newInvoice} icon="invoice">Rechnung erfassen</Button>{/if}
	{/snippet}
</Alert>
