<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { addToast } from '$lib/stores';
	import ActionDialog from '$lib/ui/ActionDialog.svelte';
	import Checkbox from '$lib/ui/Checkbox.svelte';
	import { focusFirstError } from '$lib/ui/focus-error';
	import { formatDate } from '$lib/utils/format';

	// A contract that has started is deleted only when confirmed as entered by mistake; one a statement bills never
	// (A-7, #116)
	let {
		open = $bindable(),
		name,
		startDate,
		endDate,
		future,
		billedBy,
		missingStatements,
		error
	}: {
		open: boolean;
		name: string;
		startDate: string;
		endDate?: string | null;
		future: boolean;
		billedBy: { statementNumber: string; status: string }[];
		missingStatements: boolean;
		error?: string;
	} = $props();

	const billed = $derived(billedBy.length > 0);
	// each with its status: a draft can be deleted, a sent or paid one stays (Fachreview V-3)
	const statusOf = (status: string) =>
		status === 'draft'
			? m.statements_status_draft()
			: status === 'paid'
				? m.contracts_billed_paid()
				: m.contracts_billed_sent();
	const numbers = $derived(
		billedBy.map((s) => `${s.statementNumber} (${statusOf(s.status)})`).join(', ')
	);
	const locked = $derived(billedBy.some((s) => s.status !== 'draft'));
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
		<p>{m.contracts_delete_billed({ numbers })}</p>
		<p>{locked ? m.contracts_delete_billed_locked() : m.contracts_delete_billed_drafts()}</p>
	{:else if future}
		<p>{m.contracts_delete_future_text({ name })}</p>
	{:else}
		<p>{m.contracts_delete_started_text({ name, date: formatDate(startDate) })}</p>
		<!-- with an end there is no «Beenden» (Fachreview V-11) -->
		<p>
			{endDate
				? m.contracts_delete_real_tenancy_ended({ name, date: formatDate(endDate) })
				: m.contracts_delete_real_tenancy({ name })}
		</p>
		{#if missingStatements}
			<p>{m.contracts_delete_missing_statements()}</p>
		{/if}
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
