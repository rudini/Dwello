<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { ChangedStatement } from '$lib/statement-wizard';
	import ChangedStatements from './ChangedStatements.svelte';
	// No contract to bill in the period: either none at all, or every contract already has a statement
	let {
		billed,
		error
	}: {
		billed: {
			buildingId: string;
			name: string;
			partlyBilled: number;
			changed: ChangedStatement[];
		}[];
		error?: string;
	} = $props();
	// days a statement leaves open: deleting a draft to create it anew in this period would leave the days it billed
	// without a statement (code review C-1, persona Dr. Weber P-1)
	const open = $derived(billed.some((row) => row.partlyBilled > 0));
	// the run creates nothing: only drafts missing invoices matter, not settings of new statements (#132)
	const outdated = (changed: ChangedStatement[]) =>
		changed
			.filter((s) => s.outdated)
			.map((s) => ({ ...s, profile: null, profileEdited: null, fee: null }));
</script>

<p class="text-ink-muted" data-testid="preview-empty">{m.statements_preview_empty()}</p>
<!-- all contracts already billed (e.g. after a late invoice): how to recalculate, and where the statements are -->
{#if billed.length}
	<p class="text-ink" data-testid="preview-all-billed">
		{m.statements_all_billed_lead()}
		{open ? m.statements_building_billed_open() : m.statements_building_recalculate()}
	</p>
	<ul class="flex flex-col">
		{#each billed as row (row.buildingId)}
			<li class="flex flex-col gap-2">
				<a
					href="/statements?building={row.buildingId}"
					class="inline-flex min-h-12 items-center text-accent underline underline-offset-4"
					>{m.statements_view_of({ name: row.name })}</a
				>
				<ChangedStatements buildingId={row.buildingId} statements={outdated(row.changed)} />
			</li>
		{/each}
	</ul>
{/if}
{#if error}
	<p class="font-semibold text-critical" role="alert" data-testid="form-error">
		{error}
	</p>
{/if}
