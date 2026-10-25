<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { enhance } from '$app/forms';
	import type { StatementWithDetails } from '$lib/types';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { focusFirstError } from '$lib/ui/focus-error';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import Textarea from '$lib/ui/Textarea.svelte';
	import DateInput from '$lib/ui/DateInput.svelte';
	import CostTable from '../CostTable.svelte';
	import type { ActionData } from './$types';

	// Only the deadline and the notes can change; the costs come from the generation run
	let { data, form }: { data: { statement: StatementWithDetails }; form: ActionData } = $props();

	const statement = $derived(data.statement);
	const refund = $derived(statement.balance < 0);
	const deadlineField = $derived(
		refund
			? { label: m.statements_refund_by(), help: m.statements_refund_by_help() }
			: { label: m.glossary_deadline_term(), help: m.statements_deadline_help() }
	);
	let saving = $state(false);
	// Shown in words below the field: the browser may show the date in a foreign format
	let deadline = $derived(statement.paymentDeadline);
</script>

<svelte:head>
	<title>{m.statements_edit_title()} - {statement.statementNumber} - Dwello</title>
</svelte:head>

<form
	method="POST"
	use:enhance={() => {
		saving = true;
		return async ({ update, formElement }) => {
			await update();
			saving = false;
			focusFirstError(formElement);
		};
	}}
	class="mx-auto flex max-w-3xl flex-col gap-8"
	novalidate
>
	<PageHeader
		title={m.statements_edit_title()}
		purpose={m.statements_edit_purpose({
			number: statement.statementNumber,
			tenant: statement.tenantName,
			building: statement.buildingName,
			apartment: m.buildings_apartment_number({ number: statement.apartmentUnit })
		})}
		trail={[
			{ href: '/statements', label: m.nav_statements() },
			{
				href: `/statements/${statement.id}`,
				label: m.statements_title({ number: statement.statementNumber })
			}
		]}
	/>

	{#if form?.errors?.form}
		<Alert tone="critical" title={m.buildings_not_saved()}>
			<p data-testid="form-error">{form.errors.form}</p>
		</Alert>
	{/if}

	<Panel title={m.statements_deadline_notes()}>
		<!-- no payment, no Frist: a Saldo of 0 or one carried over; a Schlussabrechnung claims every Saldo (#448) -->
		{#if !statement.unpaid}
			<DateInput
				id="paymentDeadline"
				name="paymentDeadline"
				label={deadlineField.label}
				help={deadlineField.help}
				bind:value={deadline}
				error={form?.errors?.paymentDeadline}
				testid="payment-deadline-input"
			/>
		{/if}
		<Textarea
			id="notes"
			name="notes"
			label={m.statements_notes()}
			help={statement.replaces ? m.statements_notes_help_correction() : m.statements_notes_help()}
			optional
			value={statement.notes ?? ''}
			testid="statement-notes-input"
		/>
	</Panel>

	<Panel title={m.statements_cost_breakdown()}>
		<p class="text-ink-muted" data-testid="statement-recalculate-hint">
			{m.statements_recalculate_hint()}
		</p>
		<CostTable {statement} />
	</Panel>

	<div class="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
		<Button href="/statements/{statement.id}" testid="form-cancel">{m.ui_cancel()}</Button>
		<Button
			type="submit"
			variant="primary"
			icon="save"
			busy={saving}
			busyLabel={m.ui_saving()}
			testid="statement-save-button">{m.buildings_save_changes()}</Button
		>
	</div>
</form>
