<script lang="ts">
	import { enhance } from '$app/forms';
	import { m } from '$lib/paraglide/messages';
	import type { StatementWithDetails } from '$lib/types';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { formatCurrency, formatDate } from '$lib/utils/format';
	import FormDialog from './FormDialog.svelte';

	// #120: a replaced statement names its berichtigte Abrechnung or leads to it, a berichtigte one names the replaced
	// one; the confirmation before replacing
	let { statement, open = $bindable() }: { statement: StatementWithDetails; open: boolean } =
		$props();

	// what the berichtigte Abrechnung will offset: the payment recorded and what this one offset itself, or nothing
	// yet; a refund is paid by the landlord (Fachreview W2e V-1, V-6, V-12, V-13)
	const consequence = $derived.by(() => {
		const number = statement.statementNumber;
		if (statement.status !== 'paid' || !statement.paidDate)
			return statement.balance < 0
				? m.statements_correct_open_refund({ number })
				: m.statements_correct_open({ number });
		const offset = (statement.paidAmount ?? 0) + (statement.priorPayments ?? 0);
		if (Math.abs(offset) < 0.005) return m.statements_correct_settled({ number });
		const paid = {
			number,
			amount: formatCurrency(Math.abs(offset)),
			date: formatDate(statement.paidDate)
		};
		// in a chain, part of it was paid on the statements this one replaced, on other days
		if (statement.priorPayments) return m.statements_correct_paid_chain(paid);
		return offset < 0 ? m.statements_correct_refunded(paid) : m.statements_correct_paid(paid);
	});
	let creating = $state(false); // a second click would create a second berichtigte Abrechnung
	const replaces = $derived(
		statement.replaces &&
			m.statements_replaces({
				number: statement.replaces.statementNumber,
				date: formatDate(statement.replaces.statementDate)
			})
	);
</script>

{#if statement.status === 'replaced'}
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
{/if}

<FormDialog
	bind:open
	action="?/replace"
	title={m.statements_correct()}
	confirmLabel={m.statements_correct()}
	confirmTestid="statement-correct-confirm"
	success={m.statements_replaced_done()}
	danger
>
	<!-- the real consequence, what is offset, and the limitation -->
	<p>{consequence}</p>
	<p>{m.statements_correct_next()}</p>
	<p class="font-semibold">{m.statements_correct_final()}</p>
	<p>{m.statements_correct_limit()}</p>
</FormDialog>
