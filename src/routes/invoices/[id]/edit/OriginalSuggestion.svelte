<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { InvoiceWithDetails } from '$lib/types';
	import Panel from '$lib/ui/Panel.svelte';
	import KiAssessment from '../../KiAssessment.svelte';

	// How the KI categorized the invoice, shown while editing it
	let { invoice }: { invoice: InvoiceWithDetails } = $props();
</script>

<Panel title={m.invoices_ki_original()}>
	{#if invoice.llmCategory}
		<p class="text-ink">
			{m.invoices_category_label()} <strong>{invoice.llmCategory.name}</strong>
		</p>
	{/if}
	<KiAssessment confidence={invoice.llmConfidence ?? 0} />
</Panel>
