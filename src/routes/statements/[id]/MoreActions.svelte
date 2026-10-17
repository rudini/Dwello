<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { StatementWithDetails } from '$lib/types';
	import Button from '$lib/ui/Button.svelte';

	// Edit, correct (#120) or delete, as far as the status allows
	let {
		statement,
		oncorrect,
		ondelete
	}: { statement: StatementWithDetails; oncorrect: () => void; ondelete: () => void } = $props();
</script>

<div class="flex flex-col gap-4">
	<!-- a replaced statement stays as it was (#120) -->
	{#if statement.status !== 'replaced'}
		<Button href="/statements/{statement.id}/edit" icon="edit" testid="statement-edit-button"
			>{m.statements_edit_button()}</Button
		>
	{/if}
	{#if ['sent', 'overdue', 'paid'].includes(statement.status)}
		<Button icon="edit" onclick={oncorrect} testid="statement-correct-button"
			>{m.statements_correct()}</Button
		>
	{/if}
	<!-- Only a draft can be deleted; once sent, the statement stays as the tenant received it -->
	{#if statement.status === 'draft'}
		<Button variant="danger-ghost" icon="delete" onclick={ondelete} testid="statement-delete-button"
			>{m.statements_delete()}</Button
		>
	{/if}
</div>
