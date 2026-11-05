<script lang="ts">
	import type { Reconciliation } from '$lib/cost-reconciliation';
	import { m } from '$lib/paraglide/messages';
	import LinkedNote from './LinkedNote.svelte';

	// #1126: why «davon tragen Sie» may look larger on «Berichte»: contracts without a statement, and the drafts and the
	// statements not up to date, each named with a link (PO 05.11.2026, persona Sven 1126 P-2)
	let { reconciliation }: { reconciliation: Reconciliation } = $props();

	const without = $derived(reconciliation.withoutStatement);
	const drafts = $derived(reconciliation.drafts);
	const outdated = $derived(reconciliation.notUpToDate);
	const draftsText = (statements: string) =>
		drafts.length === 1
			? m.reports_note_drafts_one({ statements })
			: m.reports_note_drafts_many({ count: drafts.length, statements });
	const outdatedText = (statements: string) =>
		outdated.length === 1
			? m.reports_note_not_current_one({ statements })
			: m.reports_note_not_current_many({ count: outdated.length, statements });
</script>

{#if without || drafts.length || outdated.length}
	<ul class="flex flex-col gap-2 text-ink">
		{#if without}
			<li data-testid="cost-reconciliation-note">
				{without === 1
					? m.reports_note_no_statement_one()
					: m.reports_note_no_statement_many({ count: without })}
			</li>
		{/if}
		{#if drafts.length}
			<LinkedNote text={draftsText} statements={drafts} testid="cost-reconciliation-drafts" />
		{/if}
		{#if outdated.length}
			<LinkedNote text={outdatedText} statements={outdated} />
		{/if}
	</ul>
{/if}
