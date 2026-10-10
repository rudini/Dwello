<script lang="ts">
	import type { InvoiceWithDetails } from '$lib/types';
	import Panel from '$lib/ui/Panel.svelte';
	import KiAssessment from '../../KiAssessment.svelte';

	// How the KI categorized the invoice, shown while editing it
	let { invoice }: { invoice: InvoiceWithDetails } = $props();
</script>

<Panel title="Ursprünglicher Vorschlag der KI">
	{#if invoice.llmCategory}
		<p class="text-ink">Kategorie: <strong>{invoice.llmCategory.name}</strong></p>
	{/if}
	<KiAssessment confidence={invoice.llmConfidence ?? 0} />
</Panel>
