<script lang="ts">
	import Card from './Card.svelte';
	import Icon from './Icon.svelte';
	import type { Suggestion } from '$lib/invoice';
	import SuggestedCategory from './SuggestedCategory.svelte';

	// The KI categorizing a new invoice, then its suggestion
	let {
		categorizing,
		suggestion,
		onaccept
	}: { categorizing: boolean; suggestion: Suggestion | null; onaccept: () => void } = $props();
</script>

<Card>
	<h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
		<Icon name="auto_awesome" size={20} class="text-blue-500" />
		KI-Kategorisierung
	</h2>

	{#if categorizing}
		<div class="flex items-center gap-3 text-gray-600">
			<div class="animate-spin">
				<Icon name="progress_activity" size={24} />
			</div>
			<span>Analysiere Rechnung mit KI...</span>
		</div>
	{:else if suggestion}
		<SuggestedCategory {suggestion} {onaccept} />
	{/if}
</Card>
