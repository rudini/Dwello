<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { StatementWithDetails } from '$lib/types';
	import { laterText } from '$lib/overview';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { formatDate } from '$lib/utils/format';
	import FormDialog from './FormDialog.svelte';

	// What changed since the statement was created (#96, #454): a draft is recalculated (#338), a sent one corrected
	// by a berichtigte Abrechnung, unless that changes nothing for the tenant or the landlord chose not to (V-17 A);
	// «Nicht berichtigen» only where it would raise the Saldo (Fachreview 454-2 M-3 B)
	let {
		statement,
		later
	}: {
		statement: StatementWithDetails;
		later: {
			invoices: number;
			fuelStock: boolean;
			correctionDue: boolean;
			correctionDeclinable: boolean;
		};
	} = $props();

	let declining = $state(false);
	const changed = $derived(laterText(later.invoices, later.fuelStock));
	const title = $derived(
		!later.fuelStock
			? m.statements_later_title()
			: later.invoices
				? m.statements_later_title_both()
				: m.statements_later_title_fuel_stock()
	);
	const declined = $derived(statement.correctionDeclined);
	const text = $derived(
		statement.status === 'draft'
			? m.statements_later_draft({ later: changed })
			: later.correctionDue
				? m.statements_later_sent({ later: changed })
				: declined
					? m.statements_later_sent_declined({ later: changed, date: formatDate(declined.on) })
					: m.statements_later_sent_none({ later: changed, tenant: statement.tenantName })
	);
</script>

{#if statement.status !== 'replaced' && (later.invoices || later.fuelStock)}
	<Alert tone="caution" {title} testid="statement-later-invoices">
		<p>{text}</p>
		{#if later.correctionDeclinable}
			<Button onclick={() => (declining = true)} testid="statement-decline-correction-button"
				>{m.statements_decline_correction()}</Button
			>
		{/if}
	</Alert>
	<FormDialog
		bind:open={declining}
		action="?/declineCorrection"
		title={m.statements_decline_correction_title()}
		confirmLabel={m.statements_decline_correction()}
		confirmTestid="statement-decline-correction-confirm"
	>
		<p>{m.statements_decline_correction_text({ number: statement.statementNumber })}</p>
	</FormDialog>
{/if}
