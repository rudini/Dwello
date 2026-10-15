<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { Proposal } from '$lib/server/category';
	import Alert from '$lib/ui/Alert.svelte';

	// The KI's answer to «Von der KI prüfen lassen»: its choice with the reasoning, or why there is none
	// `applied`: the proposal became the choice; otherwise the Liegenschaftsverwalter had chosen before
	let { proposal, applied }: { proposal: Proposal; applied: boolean } = $props();
</script>

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
		<p>{applied ? m.categories_proposal_applied() : m.categories_proposal_kept()}</p>
	</Alert>
{/if}
