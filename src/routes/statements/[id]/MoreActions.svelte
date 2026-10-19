<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { StatementWithDetails } from '$lib/types';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Panel from '$lib/ui/Panel.svelte';

	// Edit, recalculate (#338), correct (#120) or delete, as far as the status allows; a replaced statement stays as it was: no card
	let {
		statement,
		recalculated = false,
		oncorrect,
		ondelete
	}: {
		statement: StatementWithDetails;
		recalculated?: boolean; // «Neu berechnen» was just done (#338)
		oncorrect: () => void;
		ondelete: () => void;
	} = $props();
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
				<!-- #338: a draft is calculated again from the invoices as they are now, with the same number -->
				<form method="POST" action="?/recalculate" class="flex flex-col">
					<Button type="submit" icon="refresh" testid="statement-recalculate-button"
						>{m.statements_recalculate()}</Button
					>
				</form>
				{#if recalculated}
					<Alert tone="positive" title={m.statements_recalculate()} testid="statement-recalculated">
						<p>{m.statements_recalculated()}</p>
					</Alert>
				{/if}
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
