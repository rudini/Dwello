<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	// No contract to bill in the period: either none at all, or every contract already has a statement
	let { billed, error }: { billed: { buildingId: string; name: string }[]; error?: string } =
		$props();
</script>

<p class="text-ink-muted" data-testid="preview-empty">{m.statements_preview_empty()}</p>
<!-- all contracts already billed (e.g. after a late invoice): how to recalculate, and where the statements are -->
{#if billed.length}
	<p class="text-ink" data-testid="preview-all-billed">{m.statements_all_billed()}</p>
	<ul class="flex flex-col">
		{#each billed as row (row.buildingId)}
			<li>
				<a
					href="/statements?building={row.buildingId}"
					class="inline-flex min-h-12 items-center text-accent underline underline-offset-4"
					>{m.statements_view_of({ name: row.name })}</a
				>
			</li>
		{/each}
	</ul>
{/if}
{#if error}
	<p class="font-semibold text-critical" role="alert" data-testid="form-error">
		{error}
	</p>
{/if}
