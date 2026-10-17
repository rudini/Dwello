<script lang="ts">
	import { changedNotes, type ChangedStatement } from '$lib/statement-wizard';
	// Outdated drafts and statements made with other settings of one building, each with its link (#132)
	let { buildingId, statements }: { buildingId: string; statements: ChangedStatement[] } = $props();
</script>

{#if statements.length}
	<ul class="flex flex-col gap-2" data-testid="existing-statements-changed-{buildingId}">
		{#each statements as statement (statement.id)}
			<li>
				<a
					href="/statements/{statement.id}"
					class="inline-flex min-h-12 items-center text-accent underline underline-offset-4"
					data-testid="existing-statement-{statement.id}"
					>{statement.statementNumber}, {statement.tenantName}</a
				>
				<span class="block" data-testid="existing-statement-notes-{statement.id}">
					{changedNotes(statement).join(' ')}
				</span>
			</li>
		{/each}
	</ul>
{/if}
