<script lang="ts">
	import type { Reconciliation } from '$lib/cost-reconciliation';
	import { m } from '$lib/paraglide/messages';

	// #1126: why «davon tragen Sie» may look larger on «Berichte»: contracts without a statement, drafts, and the
	// statements not up to date, each named with a link
	let { reconciliation }: { reconciliation: Reconciliation } = $props();

	const count = (n: number, one: () => string, many: (p: { count: number }) => string) =>
		n === 1 ? one() : many({ count: n });
	const notes = $derived(
		[
			reconciliation.withoutStatement &&
				count(
					reconciliation.withoutStatement,
					m.reports_note_no_statement_one,
					m.reports_note_no_statement_many
				),
			reconciliation.drafts &&
				count(reconciliation.drafts, m.reports_note_drafts_one, m.reports_note_drafts_many)
		].filter((note): note is string => !!note)
	);
	// «Öffnen Sie sie …: {statements}.»: the tenants' names become links to their statements
	const notCurrent = $derived.by(() => {
		const n = reconciliation.notUpToDate.length;
		const text =
			n === 1
				? m.reports_note_not_current_one({ statements: '\u0000' })
				: m.reports_note_not_current_many({ count: n, statements: '\u0000' });
		const [before, after] = text.split('\u0000');
		return { before, after };
	});
</script>

{#if notes.length || reconciliation.notUpToDate.length}
	<ul class="flex flex-col gap-2 text-ink">
		{#each notes as note (note)}
			<li data-testid="cost-reconciliation-note">{note}</li>
		{/each}
		{#if reconciliation.notUpToDate.length}
			<li data-testid="cost-reconciliation-note">
				{notCurrent.before}{#each reconciliation.notUpToDate as statement, i (statement.id)}{i
						? ', '
						: ''}<a
						class="font-semibold text-accent underline underline-offset-4 hover:text-accent-strong"
						href="/statements/{statement.id}">{statement.tenantName}</a
					>{/each}{notCurrent.after}
			</li>
		{/if}
	</ul>
{/if}
