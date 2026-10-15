<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { Proposal } from '$lib/server/category';
	import Alert from '$lib/ui/Alert.svelte';

	// The KI's answer to «Von der KI prüfen lassen»: its choice with the reasoning, or why there is none
	let { proposal }: { proposal: Proposal } = $props();
</script>

<div role="status">
	{#if 'error' in proposal}
		<Alert tone="caution" title={m.categories_proposal_none()} testid="category-proposal">
			<p>{proposal.error}</p>
		</Alert>
	{:else}
		<Alert
			title={m.categories_proposal({
				choice: proposal.isAllowedUtilityCost
					? m.glossary_allocable_term()
					: m.invoices_not_allocable()
			})}
			testid="category-proposal"
		>
			<p>{proposal.reasoning}</p>
		</Alert>
	{/if}
</div>
