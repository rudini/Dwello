<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { StatementWithDetails } from '$lib/types';
	import Button from '$lib/ui/Button.svelte';
	import Panel from '$lib/ui/Panel.svelte';

	// Edit, correct (#120) or delete, as far as the status allows; a replaced statement stays as it was: no card
	let {
		statement,
		oncorrect,
		ondelete
	}: { statement: StatementWithDetails; oncorrect: () => void; ondelete: () => void } = $props();
</script>

{#if statement.status !== 'replaced'}
	<Panel title={m.statements_more_actions()}>
		<div class="flex flex-col gap-4">
			<Button href="/statements/{statement.id}/edit" icon="edit" testid="statement-edit-button"
				>{m.statements_edit_button()}</Button
			>
			{#if statement.status !== 'draft'}
				<Button icon="edit" onclick={oncorrect} testid="statement-correct-button"
					>{m.statements_correct()}</Button
				>
			{:else}
				<!-- Only a draft can be deleted; once sent, the statement stays as the tenant received it -->
				<Button
					variant="danger-ghost"
					icon="delete"
					onclick={ondelete}
					testid="statement-delete-button">{m.statements_delete()}</Button
				>
			{/if}
		</div>
	</Panel>
{/if}
