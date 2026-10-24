<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { StatementWithDetails } from '$lib/types';
	import Button from '$lib/ui/Button.svelte';
	import FormDialog from './FormDialog.svelte';
	import Panel from '$lib/ui/Panel.svelte';

	// Edit, recalculate (#338), correct (#120) or delete, as far as the status allows; a replaced statement stays as it was: no card
	let {
		statement,
		oncorrect,
		ondelete,
		recalculating = $bindable(false) // also opened from the send dialog of a draft that is not current (#547)
	}: {
		statement: StatementWithDetails;
		oncorrect: () => void;
		ondelete: () => void;
		recalculating?: boolean;
	} = $props();
</script>

<!-- what the statement allows the backend decides (#788) -->
{#if statement.editable}
	<Panel title={m.statements_more_actions()}>
		<div class="flex flex-col gap-4">
			<Button href="/statements/{statement.id}/edit" icon="edit" testid="statement-edit-button"
				>{m.statements_edit_button()}</Button
			>
			{#if statement.correctable}
				<Button icon="edit" onclick={oncorrect} testid="statement-correct-button"
					>{m.statements_correct()}</Button
				>
			{:else}
				<!-- #338: a draft is calculated again from the invoices as they are now, with the same number -->
				<Button
					icon="refresh"
					onclick={() => (recalculating = true)}
					testid="statement-recalculate-button">{m.statements_recalculate()}</Button
				>
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

<!-- Helga 338 P-1, P-2: the confirmation names what stays and what changes; the result is said at the top -->
<FormDialog
	bind:open={recalculating}
	action="?/recalculate"
	title={m.statements_recalculate_title()}
	confirmLabel={m.statements_recalculate()}
	confirmTestid="statement-recalculate-confirm"
	success={m.statements_recalculated()}
>
	<p>{m.statements_recalculate_text({ number: statement.statementNumber })}</p>
</FormDialog>
