<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';
	import MoneyInput from '$lib/ui/MoneyInput.svelte';
	import Select from '$lib/ui/Select.svelte';
	import Textarea from '$lib/ui/Textarea.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';
	import DateInput from '$lib/ui/DateInput.svelte';
	import { formatDate } from '$lib/utils/format';

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
		onblur
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
	} = $props();

	// ISO dates compare as text; a Leistungszeitraum decides over the Rechnungsdatum
	const byServicePeriod = $derived(!!servicePeriodStart && !!servicePeriodEnd);
	const outside = $derived(
		!!period &&
			(byServicePeriod
				? servicePeriodEnd < period.start || servicePeriodStart > period.end
				: !!invoiceDate && (invoiceDate < period.start || invoiceDate > period.end))
	);
</script>

<Select
	id="building"
	label={m.apartments_building()}
	placeholder={m.invoices_choose_building()}
	options={buildings.map((b) => ({ value: b.id, label: `${b.name} – ${b.address}` }))}
	bind:value={buildingId}
	error={errors.buildingId}
	testid="invoice-building-select"
/>

<DateInput
	id="invoiceDate"
	label={m.invoices_date()}
	help={m.invoices_date_help()}
	bind:value={invoiceDate}
	error={errors.invoiceDate}
	testid="invoice-date-input"
/>

<!-- TODO(fachlich prüfen): "Leistungszeitraum" is not in the glossary -->
<fieldset class="flex flex-col gap-4">
	<legend class="font-semibold text-ink">
		{m.invoices_service_period()} <span class="font-normal text-ink-muted">{m.ui_optional()}</span>
	</legend>
	<p class="text-ink-muted">{m.invoices_service_period_help()}</p>
	<div class="grid gap-4 sm:grid-cols-2">
		<DateInput
			id="servicePeriodStart"
			label={m.invoices_start()}
			optional
			bind:value={servicePeriodStart}
			error={errors.servicePeriodStart}
			testid="invoice-service-start-input"
		/>
		<DateInput
			id="servicePeriodEnd"
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
	id="amount"
	label={m.invoices_amount()}
	example="450.00"
	bind:value={amount}
	error={errors.amount}
	testid="invoice-amount-input"
/>

<TextInput
	id="billingEntity"
	label={m.invoices_billing_entity()}
	help={m.invoices_billing_entity_help()}
	example={m.invoices_example_supplier()}
	bind:value={billingEntity}
	{onblur}
	error={errors.billingEntity}
	testid="invoice-billing-entity-input"
/>

<Textarea
	id="description"
	label={m.invoices_description()}
	help={m.invoices_description_help()}
	example={m.invoices_description_example()}
	rows={3}
	bind:value={description}
	{onblur}
	error={errors.description}
	testid="invoice-description-input"
/>
