<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { StatementWithDetails } from '$lib/types';
	import { laterText } from '$lib/overview';
	import { francs, keyFailuresText, recalculatedText, type Recalculated } from '$lib/statement';
	import type { HintedInvoice } from '$lib/statement-wizard';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { formatDate } from '$lib/utils/format';
	import FormDialog from './FormDialog.svelte';
	import HintedInvoices from '$lib/statement-wizard/HintedInvoices.svelte';

	// #1309: a key of its invoices that cannot be calculated for the building, with the invoices
	type KeyFailure = {
		key: string;
		reason: string;
		apartment: string | null;
		invoices: (HintedInvoice & { fuelStock: boolean })[];
	};

	// What changed since the statement was created (#96, #454): a draft is recalculated (#338), a sent one corrected
	// by a berichtigte Abrechnung, unless that changes nothing for the tenant or the landlord chose not to (V-17 A);
	// «Nicht berichtigen» only where it would raise the Saldo (Fachreview 454-2 M-3 B)
	let {
		statement,
		later,
		oncorrect
	}: {
		statement: StatementWithDetails;
		oncorrect: () => void; // «Abrechnung berichtigen», where the hint says so (persona Anna 454 P-1)
		later: {
			invoices: number;
			fuelStock: boolean;
			correctionDue: boolean;
			correctionDeclinable: boolean;
			correctionLowers: boolean;
			recalculated?: Recalculated | null; // #546
			// #1309: keys of its invoices that cannot be calculated for the building; recalculating waits for them
			uncalculableKeys?: KeyFailure[];
			carryOver?: boolean; // #506 C: said in the send dialog, not here
		};
	} = $props();

	let declining = $state(false);
	// #546: the Saldo the recalculation gives, and what «Nicht berichtigen» costs the landlord
	const recalculated = $derived(
		later.correctionDue && later.recalculated && !later.uncalculableKeys?.length
			? recalculatedText(statement.tenantName, Number(statement.balance), later.recalculated)
			: null
	);
	const declineCosts = $derived(later.recalculated?.declineCosts && francs(Number(later.recalculated.declineCosts)));
	const changed = $derived(laterText(later.invoices, later.fuelStock));
	const keys = $derived(later.uncalculableKeys ?? []);
	// persona Anna 1309 P-1: the invoices to change
	const keyInvoices = $derived(
		keys.flatMap((key) =>
			key.invoices.map((invoice) => ({
				...invoice,
				note: invoice.fuelStock ? m.statements_key_not_calculable_fuel_stock() : undefined
			}))
		)
	);
	const failures = $derived(
		keyFailuresText(keys.map((key) => ({ ...key, building: statement.buildingName })))
	);
	const title = $derived(
		keys.length
			? m.statements_key_not_calculable_title()
			: !later.fuelStock
				? m.statements_later_title()
				: later.invoices
					? m.statements_later_title_both()
					: m.statements_later_title_fuel_stock()
	);
	const declined = $derived(statement.correctionDeclined);
	// a warning only while something is to do (persona Anna 454 P-7)
	const tone = $derived(statement.status === 'draft' || later.correctionDue ? 'caution' : 'info');
	// #1309 (Fachreview 1309-1): first what holds the recalculation; a draft adds what changed since, a sent one
	// not, as its correcting waits for the key
	const keyText = (text: (params: { failures: string }) => string) =>
		keys.length ? text({ failures }) : '';
	const changedText = (text: string) => (later.invoices || later.fuelStock ? text : '');
	const parts = $derived(
		statement.status === 'draft'
			? [
					keyText(m.statements_later_key_draft),
					changedText(m.statements_later_draft({ later: changed }))
				]
			: keys.length
				? [keyText(m.statements_later_key_sent)]
				: later.correctionDue
					? [m.statements_later_sent({ later: changed })]
					: declined
						? [m.statements_later_sent_declined({ later: changed, date: formatDate(declined.on) })]
						: [m.statements_later_sent_none({ later: changed, tenant: statement.tenantName })]
	);
	const text = $derived(parts.filter(Boolean).join(' '));
	const shown = $derived(
		statement.editable && (later.invoices || later.fuelStock || keys.length > 0)
	);
	// «Abrechnung berichtigen» waits for a key that cannot be calculated (Fachreview 1309-1 V-1)
	const correctable = $derived(statement.correctable && later.correctionDue && !keys.length);
</script>

{#if shown}
	<Alert {tone} {title} testid="statement-later-invoices">
		<p>{text}</p>
		{#if keyInvoices.length}
			<HintedInvoices
				invoices={keyInvoices}
				back="/statements/{statement.id}"
				testid="statement-later-key-invoice"
			/>
		{/if}
		{#if recalculated}<p data-testid="statement-later-recalculated">{recalculated}</p>{/if}
		{#if later.correctionLowers}<p>
				{m.statements_later_lowers({ tenant: statement.tenantName })}
			</p>{/if}
		{#if correctable}
			<div class="flex flex-wrap gap-4">
				<Button icon="edit" onclick={oncorrect} testid="statement-later-correct-button"
					>{m.statements_correct()}</Button
				>
				{#if later.correctionDeclinable}
					<Button
						variant="ghost"
						onclick={() => (declining = true)}
						testid="statement-decline-correction-button">{m.statements_decline_correction()}</Button
					>
				{/if}
			</div>
		{/if}
	</Alert>
	<FormDialog
		bind:open={declining}
		action="?/declineCorrection"
		title={m.statements_decline_correction_title()}
		confirmLabel={m.statements_decline_correction()}
		confirmTestid="statement-decline-correction-confirm"
	>
		{#if declineCosts}<p>{m.statements_decline_correction_difference({ amount: declineCosts })}</p>{/if}
		<p>{m.statements_decline_correction_text({ number: statement.statementNumber })}</p>
	</FormDialog>
{/if}
