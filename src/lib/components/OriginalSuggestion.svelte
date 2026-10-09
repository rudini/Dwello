<script lang="ts">
	import type { InvoiceWithDetails } from '$lib/types';
	import Card from './Card.svelte';
	import Icon from './Icon.svelte';
	import KiAssessment from './KiAssessment.svelte';

	// How the KI categorized the invoice, shown while editing it
	let { invoice }: { invoice: InvoiceWithDetails } = $props();
</script>

<Card>
	<h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
		<Icon name="auto_awesome" size={20} class="text-accent" />
		Ursprüngliche KI-Kategorisierung
	</h2>
	<div class="p-4 bg-gray-50 rounded-lg">
		<div class="flex items-center gap-2 mb-2" hidden={!invoice.llmCategory}>
			<span class="text-sm text-gray-600">Kategorie:</span>
			<span
				class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
			>
				{invoice.llmCategory?.name}
			</span>
		</div>
		<KiAssessment confidence={invoice.llmConfidence ?? 0} />
	</div>
</Card>
