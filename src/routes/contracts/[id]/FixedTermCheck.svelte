<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { enhance } from '$app/forms';
	import type { RefusedStatement } from '$lib/contract-status';
	import { addToast } from '$lib/stores';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import { dialogSubmit } from '$lib/ui/dialog-submit';
	import { formatDate } from '$lib/utils/format';
	import RefusedStatements from '../RefusedStatements.svelte';

	// An agreed end has passed: if the tenant stayed with the landlord's consent, the contract continues open-ended
	// (Art. 266 Abs. 2 OR, A-6); TODO(fachlich prüfen, #308): wording of the question and the objection
	let {
		shown,
		endDate,
		name,
		form
	}: {
		shown: boolean;
		endDate?: string | null;
		name: string;
		form: Record<string, unknown> | null; // the page's action answer
	} = $props();
	const error = $derived(form?.fixedTermError as string | undefined);
	const refused = $derived((form?.fixedTermRefused ?? []) as RefusedStatement[]);

	let busy = $state('');
	// a toast says what was saved; the reloaded page no longer asks
	const submit = (action: string, done: () => string) =>
		dialogSubmit(
			() => ({}),
			(on) => (busy = on ? action : ''),
			(result) => result.type === 'success' && addToast('success', done()),
			() => addToast('success', done())
		);
</script>

{#if shown && endDate}
	<Panel title={m.contracts_fixed_term_title()} testid="contract-fixed-term-check">
		<p class="text-ink">{m.contracts_fixed_term_question({ name, date: formatDate(endDate) })}</p>
		<p class="text-ink-muted">{m.contracts_fixed_term_objection()}</p>
		<div class="flex flex-wrap gap-4">
			<form
				method="POST"
				action="?/continueOpenEnded"
				use:enhance={submit('continue', () => m.contracts_continued_toast({ name }))}
			>
				<Button
					type="submit"
					icon="contract"
					busy={busy === 'continue'}
					testid="contract-continue-open-ended">{m.contracts_continue_open_ended()}</Button
				>
			</form>
			<form
				method="POST"
				action="?/movedOut"
				use:enhance={submit('movedOut', () => m.contracts_moved_out_toast({ name }))}
			>
				<Button
					type="submit"
					icon="calendar-busy"
					busy={busy === 'movedOut'}
					testid="contract-moved-out">{m.contracts_moved_out()}</Button
				>
			</form>
		</div>
		{#if error}
			<Alert tone="critical" title={m.contracts_not_saved()} testid="form-error">
				<p>{error}</p>
			</Alert>
			<RefusedStatements statements={refused}>
				{#snippet action(draft, consequence)}
					<form
						method="POST"
						action="?/continueDeletingDraft"
						use:enhance={submit('draft', () =>
							m.contracts_draft_deleted_continued_toast({ number: draft.statementNumber, name })
						)}
					>
						<input type="hidden" name="statementId" value={draft.id} />
						<Button
							type="submit"
							variant="danger"
							icon="delete"
							busy={busy === 'draft'}
							describedby={consequence}
							testid="delete-draft-and-continue">{m.contracts_delete_draft_and_continue()}</Button
						>
					</form>
				{/snippet}
			</RefusedStatements>
		{/if}
	</Panel>
{/if}
