<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';
	import MoneyInput from '$lib/ui/MoneyInput.svelte';
	import Select from '$lib/ui/Select.svelte';
	import Textarea from '$lib/ui/Textarea.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';
	import DateInput from '$lib/ui/DateInput.svelte';
	import { formatDate } from '$lib/utils/format';
	import { fieldNote } from '$lib/invoice-upload';
	import DeductedHint from './DeductedHint.svelte';

	// What the invoice says: building, date, amount, supplier and service; shared by "Neue Rechnung" and "Rechnung bearbeiten"
	let {
		buildingId = $bindable(),
		invoiceDate = $bindable(),
		servicePeriodStart = $bindable(),
		servicePeriodEnd = $bindable(),
		amount = $bindable(),
		billingEntity = $bindable(),
		description = $bindable(),
		buildings,
		errors,
		period,
		onblur,
		idPrefix = '',
		chooseBuilding = true,
		fuel = false,
		read = { unsure: [], missing: [] },
		deducted
	}: {
		buildingId: string;
		invoiceDate: string;
		servicePeriodStart: string;
		servicePeriodEnd: string;
		amount: string;
		billingEntity: string;
		description: string;
		buildings: { id: string; name: string; address: string }[];
		errors: Record<string, string>;
		period?: { start: string; end: string } | null; // opened from the statement wizard
		onblur?: () => void;
		idPrefix?: string; // several invoices on one page (the upload dialog) need their own ids
		chooseBuilding?: boolean; // false where the building is chosen once for all (the upload dialog)
		fuel?: boolean; // a delivery into the building's tank: it counts in the period of its delivery day (#451, M-1)
		read?: { unsure: string[]; missing: string[] }; // fields the KI read without being sure, or did not find
		deducted?: string | null; // Akontorechnungen deducted on the saved Beleg, said at the Betrag (#455)
	} = $props();

	// the year of the date fields' examples (DateInput), so the help names one year (#250)
	const year = new Date().getFullYear();
	// ISO dates compare as text; a Leistungszeitraum decides over the Rechnungsdatum
	const byServicePeriod = $derived(!!servicePeriodStart && !!servicePeriodEnd);
	const outside = $derived(
		!!period &&
			(byServicePeriod
				? servicePeriodEnd < period.start || servicePeriodStart > period.end
				: !!invoiceDate && (invoiceDate < period.start || invoiceDate > period.end))
	);
</script>

{#if chooseBuilding}
	<Select
		id="{idPrefix}building"
		label={m.apartments_building()}
		placeholder={m.invoices_choose_building()}
		options={buildings.map((b) => ({ value: b.id, label: `${b.name} – ${b.address}` }))}
		bind:value={buildingId}
		error={errors.buildingId}
		testid="invoice-building-select"
	/>
{/if}

<DateInput
	id="{idPrefix}invoiceDate"
	label={m.invoices_date()}
	help={m.invoices_date_help()}
	bind:value={invoiceDate}
	error={errors.invoiceDate}
	note={fieldNote(read, 'invoiceDate')}
	testid="invoice-date-input"
/>

<fieldset class="flex flex-col gap-4">
	<legend class="font-semibold text-ink">
		{m.invoices_service_period()} <span class="font-normal text-ink-muted">{m.ui_optional()}</span>
	</legend>
	<div class="flex flex-col gap-2 text-ink-muted" data-testid="invoice-service-period-help">
		{#if fuel}<p>{m.invoices_service_period_fuel()}</p>{/if}
		<p>{m.invoices_service_period_help({ year })}</p>
		<p>{m.invoices_service_period_years({ year, end: year + 5 })}</p>
		<p>{m.invoices_service_period_boiler()}</p>
	</div>
	<div class="grid gap-4 sm:grid-cols-2">
		<DateInput
			id="{idPrefix}servicePeriodStart"
			label={m.invoices_start()}
			optional
			bind:value={servicePeriodStart}
			error={errors.servicePeriodStart}
			note={fieldNote(read, 'servicePeriodStart')}
			testid="invoice-service-start-input"
		/>
		<DateInput
			id="{idPrefix}servicePeriodEnd"
			label={m.invoices_end()}
			optional
			bind:value={servicePeriodEnd}
			error={errors.servicePeriodEnd}
			testid="invoice-service-end-input"
		/>
	</div>
</fieldset>

{#if outside && period}
	<Alert tone="caution" title={m.invoices_outside_period()} testid="invoice-period-warning">
		<p>
			{(byServicePeriod ? m.invoices_outside_by_period : m.invoices_outside_by_date)({
				start: formatDate(period.start),
				end: formatDate(period.end)
			})}
		</p>
	</Alert>
{/if}

<MoneyInput
	id="{idPrefix}amount"
	label={m.invoices_amount()}
	example="450.00"
	bind:value={amount}
	error={errors.amount}
	note={fieldNote(read, 'amount')}
	testid="invoice-amount-input"
/>
{#if deducted}<DeductedHint amount={deducted} />{/if}

<TextInput
	id="{idPrefix}billingEntity"
	label={m.invoices_billing_entity()}
	help={m.invoices_billing_entity_help()}
	example={m.invoices_example_supplier()}
	bind:value={billingEntity}
	{onblur}
	error={errors.billingEntity}
	note={fieldNote(read, 'billingEntityName')}
	testid="invoice-billing-entity-input"
/>

<Textarea
	id="{idPrefix}description"
	label={m.invoices_description()}
	help={m.invoices_description_help()}
	example={m.invoices_description_example()}
	rows={3}
	bind:value={description}
	{onblur}
	error={errors.description}
	note={fieldNote(read, 'description')}
	testid="invoice-description-input"
/>
