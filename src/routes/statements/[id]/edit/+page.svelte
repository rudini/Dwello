<script lang="ts">
	import { enhance } from '$app/forms';
	import type { StatementWithDetails } from '$lib/types';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { focusFirstError } from '$lib/ui/focus-error';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import Textarea from '$lib/ui/Textarea.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';
	import { formatDateLong } from '$lib/utils/format';
	import CostTable from '../CostTable.svelte';
	import type { ActionData } from './$types';

	// Only the deadline and the notes can change; the costs come from the generation run
	let { data, form }: { data: { statement: StatementWithDetails }; form: ActionData } = $props();

	const statement = $derived(data.statement);
	const refund = $derived(statement.balance < 0);
	let saving = $state(false);
	// Shown in words below the field: the browser may show the date in a foreign format
	let deadline = $derived(statement.paymentDeadline);
</script>

<svelte:head>
	<title>Abrechnung bearbeiten - {statement.statementNumber} - Dwello</title>
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
>
	<PageHeader
		title="Abrechnung bearbeiten"
		purpose="{statement.statementNumber}: {statement.tenantName}, {statement.buildingName}, Wohnung {statement.apartmentUnit}"
		trail={[
			{ href: '/statements', label: 'Nebenkostenabrechnungen' },
			{ href: `/statements/${statement.id}`, label: `Abrechnung ${statement.statementNumber}` }
		]}
	/>

	{#if form?.errors?.form}
		<Alert tone="critical" title="Nicht gespeichert">
			<p data-testid="form-error">{form.errors.form}</p>
		</Alert>
	{/if}

	<Panel title="Frist und Bemerkungen">
		<!-- TODO(fachlich prüfen): the glossary has no term for the date by which a refund is paid out -->
		<TextInput
			id="paymentDeadline"
			name="paymentDeadline"
			type="date"
			label={refund ? 'Rückerstattung bis' : 'Zahlungsfrist'}
			help={refund
				? 'Bis zu diesem Datum erstatten Sie dem Mieter den Betrag zurück.'
				: 'Bis zu diesem Datum bezahlt der Mieter die Nachzahlung.'}
			bind:value={deadline}
			testid="payment-deadline-input"
		/>
		{#if deadline}<p class="font-semibold text-ink">{formatDateLong(deadline)}</p>{/if}
		<Textarea
			id="notes"
			name="notes"
			label="Bemerkungen"
			help="Zum Beispiel eine Absprache mit dem Mieter."
			optional
			value={statement.notes ?? ''}
			testid="statement-notes-input"
		/>
	</Panel>

	<Panel title="Kostenaufstellung">
		<p class="text-ink-muted" data-testid="statement-recalculate-hint">
			Kosten und Verwaltungspauschale werden beim Erstellen der Abrechnungen berechnet und lassen
			sich hier nicht ändern. Für eine Korrektur löschen Sie den Entwurf und erstellen die
			Abrechnungen des Gebäudes neu.
		</p>
		<CostTable {statement} />
	</Panel>

	<div class="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
		<Button href="/statements/{statement.id}" testid="form-cancel">Abbrechen</Button>
		<Button
			type="submit"
			variant="primary"
			icon="save"
			busy={saving}
			busyLabel="Wird gespeichert …"
			testid="statement-save-button">Änderungen speichern</Button
		>
	</div>
</form>
