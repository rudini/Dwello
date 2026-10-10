<script lang="ts">
	import type { Suggestion } from '$lib/invoice';
	import Button from '$lib/ui/Button.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import KiAssessment from '../KiAssessment.svelte';

	// The KI categorizing a new invoice (no suggestion yet), then its suggestion to take over
	let { suggestion, onaccept }: { suggestion: Suggestion | null; onaccept: () => void } = $props();

	const category = $derived(suggestion?.category);
	const name = $derived(
		!category
			? 'Keine passende Kategorie gefunden'
			: suggestion!.isAllowedUtilityCost
				? category.name
				: `${category.name} (nicht umlagefähig)`
	);
</script>

<Panel title="Vorschlag der KI">
	<div role="status" class="flex flex-col gap-4">
		{#if suggestion}
			<p class="text-ink">Vorgeschlagene Kategorie: <strong>{name}</strong></p>
			<KiAssessment confidence={suggestion.confidence} reasoning={suggestion.reasoning} />
		{:else}
			<p class="text-ink">Die KI liest die Rechnung …</p>
		{/if}
	</div>
	{#if category}
		<div><Button icon="check" onclick={onaccept}>Übernehmen</Button></div>
	{/if}
</Panel>
