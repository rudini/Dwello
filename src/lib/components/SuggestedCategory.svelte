<script lang="ts">
	import type { Suggestion } from '$lib/invoice';
	import Badge from './Badge.svelte';
	import Button from './Button.svelte';
	import Icon from './Icon.svelte';
	import KiAssessment from './KiAssessment.svelte';

	// The KI's category for an invoice, with its confidence and reasoning
	let { suggestion, onaccept }: { suggestion: Suggestion; onaccept: () => void } = $props();

</script>

<div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
	<div class="flex items-start justify-between gap-4">
		<div class="flex-1">
			<div class="flex items-center gap-2 mb-2">
				<span class="font-medium text-gray-900">Vorgeschlagene Kategorie:</span>
				<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
					{suggestion.category?.name ?? 'Keine Kategorie gefunden'}
				</span>
				<span hidden={!suggestion.category || suggestion.isAllowedUtilityCost}><Badge variant="danger">Nicht umlagefähig</Badge></span>
			</div>
			<KiAssessment confidence={suggestion.confidence} reasoning={suggestion.reasoning} />
		</div>
		<span hidden={!suggestion.category}>
			<Button type="button" variant="primary" size="sm" onclick={onaccept}>
				<Icon name="check" size={16} />
				Übernehmen
			</Button>
		</span>
	</div>
</div>
