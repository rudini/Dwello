<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { Proposal } from '$lib/types';
	import Alert from '$lib/ui/Alert.svelte';

	// The KI's answer to «Von der KI prüfen lassen»: its choice with the reasoning, or why there is none
	// `applied`: the proposal became the choice; otherwise `choice` is the one the Liegenschaftsverwalter made
	let { proposal, applied, choice }: { proposal: Proposal; applied: boolean; choice: string } =
		$props();

	const named = (allowed: boolean) =>
		allowed ? m.glossary_allocable_term() : m.invoices_not_allocable();
	// #678 (Helga P-9, P-10): whether the KI sees it as the Liegenschaftsverwalter does; the choice stays
	const kept = $derived({ choice: named(choice === 'true') });
	const answer = $derived(
		'error' in proposal
			? proposal.unsure && choice
				? m.categories_proposal_unsure_kept(kept)
				: proposal.error
			: applied
				? m.categories_proposal_applied()
				: choice === String(proposal.isAllowedUtilityCost)
					? m.categories_proposal_agrees(kept)
					: m.categories_proposal_differs(kept)
	);
</script>

{#if 'error' in proposal}
	<Alert tone="caution" title={m.categories_proposal_none()} testid="category-proposal">
		<p>{answer}</p>
	</Alert>
{:else}
	<Alert
		title={m.categories_proposal({ choice: named(proposal.isAllowedUtilityCost) })}
		testid="category-proposal"
	>
		<p>{proposal.reasoning}</p>
		<p>{answer}</p>
	</Alert>
{/if}
