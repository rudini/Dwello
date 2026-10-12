<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { Snippet } from 'svelte';
	import type { RefusedStatement } from '$lib/contract-status';

	// The statements that refused new contract dates, each a link (A-10); the only one, a draft, can be deleted first
	let {
		statements,
		action
	}: { statements: RefusedStatement[]; action?: Snippet<[RefusedStatement]> } = $props();

	const draft = $derived(
		statements.length === 1 && statements[0].status === 'draft' ? statements[0] : null
	);
	const link = 'font-semibold text-accent underline underline-offset-4 hover:text-accent-strong';
</script>

{#if statements.length}
	<div class="flex flex-col gap-4" data-testid="refused-statements">
		<ul class="flex flex-col gap-2">
			{#each statements as statement (statement.id)}
				<li>
					<a href="/statements/{statement.id}" class={link} data-testid="refused-statement-link"
						>{m.contracts_refused_open({ number: statement.statementNumber })}</a
					>
				</li>
			{/each}
		</ul>
		{#if draft && action}
			<p class="text-ink">
				{m.contracts_delete_draft_consequence({ number: draft.statementNumber })}
			</p>
			{@render action(draft)}
		{/if}
	</div>
{/if}
