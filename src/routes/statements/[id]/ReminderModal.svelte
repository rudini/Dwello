<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { StatementWithDetails } from '$lib/types';
	import Dialog from '$lib/ui/Dialog.svelte';
	import { openAmount } from '$lib/statement';
	import { formatCurrency } from '$lib/utils/format';
	import FormDialog from './FormDialog.svelte';

	// Before a Mahnung: which one comes next, how it reaches the tenant, and the amount still open
	let {
		open = $bindable(),
		statement,
		sentReminders
	}: { open: boolean; statement: StatementWithDetails; sentReminders: number } = $props();

	const TITLES = [m.documents_reminder_1(), m.documents_reminder_2(), m.documents_reminder_3()];
	const LANGUAGES = {
		de: m.statements_language_de,
		fr: m.statements_language_fr,
		it: m.statements_language_it,
		en: m.statements_language_en
	};
	const next = $derived(TITLES[sentReminders]);
	// the language Dwello writes the reminder in, named in the UI's language (#449, decided in #404, point 4)
	const language = $derived(LANGUAGES[statement.tenantLanguage ?? 'de']());
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
			{#if byEmail && statement.tenantEmail}
				{m.statements_reminder_by_email({ next, language, email: statement.tenantEmail })}
			{:else if byEmail}
				<!-- the channel says e-mail, but there is no address: the letter waits under «Dokumente» (#283) -->
				{m.statements_reminder_no_email({ tenant: statement.tenantName, next, language })}
			{:else}
				{m.statements_reminder_by_letter({ next, language })}
			{/if}
		</p>
		<p class="rounded-panel bg-sunken p-4 text-ink" data-testid="reminder-owed">
			{m.statements_owes({ tenant: statement.tenantName })}
			<!-- after a part payment the rest (#959) -->
			<strong class="tabular-nums">{formatCurrency(openAmount(statement))}</strong>.
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
