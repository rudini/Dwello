<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { addToast } from '$lib/stores';
	import ActionDialog from '$lib/ui/ActionDialog.svelte';
	import Checkbox from '$lib/ui/Checkbox.svelte';
	import { focusFirstError } from '$lib/ui/focus-error';
	import { formatDate } from '$lib/utils/format';

	// A contract that has started is deleted only when confirmed as entered by mistake; one a statement bills never
	// (A-7, #116); its statements are linked, an ended one says when it has none (A-8, #117)
	let {
		open = $bindable(),
		name,
		startDate,
		endDate,
		future,
		ended,
		billedBy,
		missingStatements,
		error
	}: {
		open: boolean;
		name: string;
		startDate: string;
		endDate?: string | null;
		future: boolean;
		ended: boolean;
		billedBy: { id: string; statementNumber: string; status: string }[] | null;
		missingStatements: boolean;
		error?: string;
	} = $props();

	const billed = $derived(!!billedBy?.length);
	// each with its status label: a draft can be deleted, a sent or paid one stays (Fachreview V-3)
	const labels: Record<string, () => string> = {
		draft: m.statements_status_draft,
		paid: m.contracts_billed_paid,
		replaced: m.contracts_billed_replaced
	};
	const statusOf = (status: string) => (labels[status] ?? m.contracts_billed_sent)();
	const locked = $derived(!!billedBy?.some((s) => s.status !== 'draft'));
	// what a started contract's deletion means: with an end there is no «Beenden» (Fachreview V-11); an ended one says
	// when it has no statement, unknown is not none (A-8, review C-1)
	const startedNotes = $derived([
		m.contracts_delete_started_text({ name, date: formatDate(startDate) }),
		endDate
			? m.contracts_delete_real_tenancy_ended({ name, date: formatDate(endDate) })
			: m.contracts_delete_real_tenancy({ name }),
		...(ended && billedBy ? [m.contracts_delete_no_statements()] : []),
		...(missingStatements ? [m.contracts_delete_missing_statements()] : [])
	]);
	let mistakeConfirmed = $state(false);
	let mistakeError = $state('');
	// each opening asks again
	$effect(() => {
		if (!open) return;
		mistakeConfirmed = false;
		mistakeError = '';
	});
	function checkMistake() {
		mistakeError = !future && !mistakeConfirmed ? m.contracts_delete_mistake_unconfirmed() : '';
		if (mistakeError) focusFirstError(document.querySelector('[role="dialog"]'));
		return !mistakeError;
	}
</script>

<ActionDialog
	bind:open
	action="?/delete"
	title={m.contracts_delete_title()}
	confirmLabel={m.contracts_delete_confirm()}
	danger
	disabled={billed}
	confirmTestid="contract-delete-confirm"
	{error}
	fields={{ mistakeConfirmed: mistakeConfirmed ? 'on' : '' }}
	check={checkMistake}
	onsuccess={() => addToast('success', m.contracts_deleted_toast({ name }))}
>
	{#if billed}
		<p>{m.contracts_delete_billed()}</p>
		<ul class="flex flex-col gap-2">
			{#each billedBy ?? [] as statement (statement.id)}
				<li>
					<a
						href="/statements/{statement.id}"
						class="inline-flex min-h-12 items-center font-semibold text-accent underline underline-offset-4 hover:text-accent-strong"
						data-testid="contract-delete-statement-{statement.id}"
						>{statement.statementNumber} ({statusOf(statement.status)})</a
					>
				</li>
			{/each}
		</ul>
		<p>{locked ? m.contracts_delete_billed_locked() : m.contracts_delete_billed_drafts()}</p>
	{:else if future}
		<p>{m.contracts_delete_future_text({ name })}</p>
	{:else}
		{#each startedNotes as note (note)}<p>{note}</p>{/each}
		<Checkbox
			id="mistakeConfirmed"
			label={m.contracts_delete_mistake_label()}
			help={m.contracts_delete_mistake_help()}
			error={mistakeError}
			bind:checked={mistakeConfirmed}
			testid="contract-delete-mistake-confirm"
		/>
	{/if}
</ActionDialog>
