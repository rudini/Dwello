<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { Suggestion } from '$lib/invoice';
	import type { Category } from '$lib/types';
	import Button from '$lib/ui/Button.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import KiAssessment from '../KiAssessment.svelte';

	// The KI categorizing a new invoice (no suggestion yet), then its suggestion to take over
	let {
		suggestion,
		categories,
		onaccept
	}: { suggestion: Suggestion | null; categories: Category[]; onaccept: () => void } = $props();

	const category = $derived(suggestion?.category);
	// The KI names the category by its key: the offered categories name it in the UI language
	const shown = $derived(categories.find((c) => c.id === category?.id)?.name ?? category?.name);
	const name = $derived(
		!category
			? m.invoices_no_matching_category()
			: suggestion!.isAllowedUtilityCost
				? shown
				: m.invoices_suggested_not_allocable({ name: shown! })
	);
</script>

<Panel title={m.invoices_ki_suggestion()}>
	<div role="status" class="flex flex-col gap-4">
		{#if suggestion}
			<p class="text-ink">{m.invoices_suggested_category()} <strong>{name}</strong></p>
			<KiAssessment confidence={suggestion.confidence} reasoning={suggestion.reasoning} />
		{:else}
			<p class="text-ink">{m.invoices_ki_reading()}</p>
		{/if}
	</div>
	{#if category}
		<div><Button icon="check" onclick={onaccept}>{m.invoices_accept()}</Button></div>
	{/if}
</Panel>
