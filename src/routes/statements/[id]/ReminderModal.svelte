<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { StatementWithDetails } from '$lib/types';
	import Dialog from '$lib/ui/Dialog.svelte';
	import { formatCurrency } from '$lib/utils/format';
	import FormDialog from './FormDialog.svelte';

	// Before a Mahnung: which one comes next, how it reaches the tenant, and the amount still open
	let {
		open = $bindable(),
		statement,
		sentReminders
	}: { open: boolean; statement: StatementWithDetails; sentReminders: number } = $props();

	const TITLES = [m.documents_reminder_1(), m.documents_reminder_2(), m.documents_reminder_3()];
	const next = $derived(TITLES[sentReminders]);
	const byEmail = $derived(statement.tenantCorrespondenceChannel === 'email');
</script>

{#if next}
	<FormDialog
		bind:open
		action="?/remind"
		title={m.statements_send_reminder()}
		confirmLabel={m.statements_send_next({ next })}
		confirmTestid="statement-reminder-confirm"
	>
		<p data-testid="reminder-delivery-info">
			{#if byEmail}
				{m.statements_reminder_by_email({ next, email: statement.tenantEmail ?? '' })}
			{:else}
				{m.statements_reminder_by_letter({ next })}
			{/if}
		</p>
		<p class="rounded-panel bg-sunken p-4 text-ink">
			{m.statements_owes({ tenant: statement.tenantName })}
			<strong class="tabular-nums">{formatCurrency(Math.abs(statement.balance))}</strong>.
		</p>
	</FormDialog>
{:else}
	<Dialog
		bind:open
		title={m.statements_no_more_reminders_title()}
		confirmLabel={m.statements_understood()}
		confirmTestid="statement-reminder-confirm"
		onconfirm={() => (open = false)}
	>
		<p>{m.statements_no_more_reminders_text()}</p>
		<p>{m.statements_reminder_257d()}</p>
	</Dialog>
{/if}
