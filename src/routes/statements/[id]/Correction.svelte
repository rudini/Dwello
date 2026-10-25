<script lang="ts">
	import { enhance } from '$app/forms';
	import { m } from '$lib/paraglide/messages';
	import type { StatementWithDetails } from '$lib/types';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import MoneyInput from '$lib/ui/MoneyInput.svelte';
	import { FRANCS } from '$lib/contract-form';
	import { formatCurrency, formatDate } from '$lib/utils/format';
	import FormDialog from './FormDialog.svelte';

	// #120: a replaced statement names its berichtigte Abrechnung or leads to it, a berichtigte one names the replaced
	// one; the confirmation before replacing
	let { statement, open = $bindable() }: { statement: StatementWithDetails; open: boolean } =
		$props();

	// in a chain (second text), part of it was paid on the statements this one replaced, on other days; net, paid or
	// refunded (#447)
	const offsetText = {
		paid: [m.statements_correct_paid, m.statements_correct_paid_chain],
		refunded: [m.statements_correct_refunded, m.statements_correct_refunded_chain]
	};
	// what the berichtigte Abrechnung will offset: the payment recorded and what this one offset itself, or nothing
	// yet; a refund is paid by the landlord (Fachreview W2e V-1, V-6, V-12, V-13)
	// a settled one, or a refund settled under #94, whose Saldo may be carried over already (#448, Fachreview 448-3 V-25)
	// a Saldo of 0.00 is never carried over (448-4 V-32); the backend says it (#815)
	const carried = $derived(statement.carried);
	// not paid: a sent or overdue one, or one whose Saldo is carried over
	const unpaidConsequence = (number: string) =>
		carried
			? m.statements_correct_open_settled({ number })
			: statement.status === 'settled' // a Saldo of 0.00: nothing open, nothing carried (448-review-3 C-18)
				? m.statements_correct_settled({ number })
				: statement.balance < 0
					? m.statements_correct_open_refund({ number })
					: m.statements_correct_open({ number });
	const consequence = $derived.by(() => {
		const number = statement.statementNumber;
		if (carried || statement.status !== 'paid' || !statement.paidDate) return unpaidConsequence(number);
		const offset = (statement.paidAmount ?? 0) + (statement.priorPayments ?? 0);
		if (Math.abs(offset) < 0.005) return m.statements_correct_settled({ number });
		const paid = {
			number,
			amount: formatCurrency(Math.abs(offset)),
			date: formatDate(statement.paidDate)
		};
		return offsetText[offset < 0 ? 'refunded' : 'paid'][statement.priorPayments ? 1 : 0](paid);
	});
	// #448 (5): what was already paid on a sent or overdue statement, also a part; on a refund by the landlord
	const askPaid = $derived(statement.status === 'sent' || statement.status === 'overdue');
	let paidAmount = $state('0.00');
	let paidError = $state('');
	function checkPaid() {
		const valid = !askPaid || FRANCS.test(paidAmount.trim());
		paidError = valid ? '' : m.backend_statement_paid_amount_invalid({ amount: paidAmount });
		return valid;
	}
	let creating = $state(false); // a second click would create a second berichtigte Abrechnung
	// #464 (domain review F-4, decision A): the Akonto comes from the contract; a different one is checked before sending
	const advanceBefore = $derived(Number(statement.replaces?.totalAdvancePayments));
	const advanceDiffers = $derived(statement.advanceChanged);
	const replaces = $derived(
		statement.replaces &&
			m.statements_replaces({
				number: statement.replaces.statementNumber,
				date: formatDate(statement.replaces.statementDate)
			})
	);
</script>

{#if statement.superseded}
	<!-- the statement stays as sent; its berichtigte Abrechnung, or what to do before creating it -->
	<Alert tone="info" title={m.statements_replaced_title()} testid="statement-replaced">
		{#if statement.replacedBy}
			<p>
				<a
					class="inline-flex min-h-12 items-center font-semibold text-ink underline"
					href="/statements/{statement.replacedBy.id}"
					data-testid="statement-replaced-by-link"
					>{m.statements_replaced_by({ number: statement.replacedBy.statementNumber })}</a
				>
			</p>
		{:else}
			<p>{m.statements_replaced_todo()}</p>
			<p>
				<a
					class="inline-flex min-h-12 items-center font-semibold text-ink underline"
					href="/contracts/{statement.contractId}"
					data-testid="statement-replaced-contract-link">{m.statements_replaced_contract()}</a
				>
			</p>
			<form
				method="POST"
				action="?/correct"
				use:enhance={() => {
					creating = true;
					return async ({ update }) => {
						await update();
						creating = false;
					};
				}}
			>
				<Button
					type="submit"
					variant="primary"
					icon="statement"
					busy={creating}
					testid="statement-create-correction-button">{m.statements_create_correction()}</Button
				>
			</form>
		{/if}
	</Alert>
{/if}
{#if statement.replaces}
	<p class="text-ink" data-testid="statement-replaces">
		<a
			class="inline-flex min-h-12 items-center font-semibold underline"
			href="/statements/{statement.replaces.id}"
			data-testid="statement-replaces-link">{replaces}</a
		>
	</p>
	{#if advanceDiffers}
		<Alert tone="caution" title={m.statements_advance_differs_title()} testid="statement-advance-differs">
			<p>
				{m.statements_advance_differs({
					now: formatCurrency(statement.totalAdvancePayments),
					number: statement.replaces.statementNumber,
					before: formatCurrency(advanceBefore)
				})}
			</p>
		</Alert>
	{/if}
{/if}

<FormDialog
	bind:open
	action="?/replace"
	title={m.statements_correct()}
	confirmLabel={m.statements_correct()}
	confirmTestid="statement-correct-confirm"
	fields={askPaid ? { paidAmount } : {}}
	check={checkPaid}
	success={m.statements_replaced_done()}
	danger
>
	<!-- the real consequence, what is offset, and the limitation -->
	<p>{consequence}</p>
	{#if askPaid}
		<MoneyInput
			id="paidAmount"
			label={statement.balance < 0
				? m.statements_correct_refunded_amount()
				: m.statements_correct_paid_amount()}
			help={statement.balance < 0
				? m.statements_correct_refunded_help()
				: m.statements_correct_paid_help()}
			error={paidError}
			bind:value={paidAmount}
			testid="statement-correct-paid-amount"
		/>
	{/if}
	<p>{m.statements_correct_next()}</p>
	<p class="font-semibold">{m.statements_correct_final()}</p>
	<p>{m.statements_correct_limit()}</p>
</FormDialog>
