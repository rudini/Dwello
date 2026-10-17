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

	// what the berichtigte Abrechnung will offset: the payment recorded, or nothing yet (Fachreview W2e V-1, V-6)
	const consequence = $derived.by(() => {
		const number = statement.statementNumber;
		if (statement.status !== 'paid' || !statement.paidDate)
			return m.statements_correct_open({ number });
		const paid = {
			number,
			amount: formatCurrency(Math.abs(statement.balance)),
			date: formatDate(statement.paidDate)
		};
		return statement.balance < 0
			? m.statements_correct_refunded(paid)
			: m.statements_correct_paid(paid);
	});
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
					class="font-semibold text-ink underline"
					href="/statements/{statement.replacedBy.id}"
					data-testid="statement-replaced-by-link"
					>{m.statements_replaced_by({ number: statement.replacedBy.statementNumber })}</a
				>
			</p>
		{:else}
			<p>{m.statements_replaced_todo()}</p>
			<form method="POST" action="?/correct" use:enhance>
				<Button
					type="submit"
					variant="primary"
					icon="statement"
					testid="statement-create-correction-button">{m.statements_create_correction()}</Button
				>
			</form>
		{/if}
	</Alert>
{/if}
{#if statement.replaces}
	<p class="text-ink" data-testid="statement-replaces">
		<a
			class="font-semibold underline"
			href="/statements/{statement.replaces.id}"
			data-testid="statement-replaces-link">{replaces}</a
		>
	</p>
{/if}

<FormDialog
	bind:open
	action="?/replace"
	title={m.statements_correct()}
	confirmLabel={m.statements_correct_confirm()}
	confirmTestid="statement-correct-confirm"
	danger
>
	<!-- the real consequence, what is offset, and the limitation -->
	<p>{consequence}</p>
	<p>{m.statements_correct_next()}</p>
	<p>{m.statements_correct_limit()}</p>
	<p class="font-semibold">{m.statements_correct_final()}</p>
</FormDialog>
