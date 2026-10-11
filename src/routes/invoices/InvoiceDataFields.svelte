<script lang="ts">
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
	label="Gebäude"
	placeholder="Gebäude auswählen"
	options={buildings.map((b) => ({ value: b.id, label: `${b.name} – ${b.address}` }))}
	bind:value={buildingId}
	error={errors.buildingId}
	testid="invoice-building-select"
/>

<DateInput
	id="invoiceDate"
	label="Rechnungsdatum"
	help="Übernehmen Sie das Datum von der Rechnung, nicht das heutige. Ohne Leistungszeitraum bestimmt es, in welche Abrechnungsperiode die Rechnung fällt."
	bind:value={invoiceDate}
	error={errors.invoiceDate}
	testid="invoice-date-input"
/>

<!-- TODO(fachlich prüfen): "Leistungszeitraum" is not in the glossary -->
<fieldset class="flex flex-col gap-4">
	<legend class="font-semibold text-ink">
		Leistungszeitraum <span class="font-normal text-ink-muted">(optional)</span>
	</legend>
	<p class="text-ink-muted">
		Für welche Zeit gilt die Rechnung? Geben Sie ihn bei Rechnungen für einen Zeitraum an, zum
		Beispiel ein Quartal oder ein Jahr. Für das 4. Quartal also 01.10.2024 bis 31.12.2024, auch wenn
		die Rechnung erst im Januar kommt. Dann zählen nur die Tage, die in die Abrechnungsperiode
		fallen. Nicht für Lieferungen von Heizöl, Flüssiggas, Pellets oder Holz: Deren Verbrauch zählt
		über den Tankbestand des Gebäudes.
	</p>
	<div class="grid gap-4 sm:grid-cols-2">
		<DateInput
			id="servicePeriodStart"
			label="Beginn"
			optional
			bind:value={servicePeriodStart}
			error={errors.servicePeriodStart}
			testid="invoice-service-start-input"
		/>
		<DateInput
			id="servicePeriodEnd"
			label="Ende"
			optional
			bind:value={servicePeriodEnd}
			error={errors.servicePeriodEnd}
			testid="invoice-service-end-input"
		/>
	</div>
</fieldset>

{#if outside && period}
	<Alert tone="caution" title="Ausserhalb der Abrechnungsperiode" testid="invoice-period-warning">
		<p>
			{byServicePeriod ? 'Der Leistungszeitraum' : 'Das Rechnungsdatum'} liegt nicht in der Abrechnungsperiode
			{formatDate(period.start)} – {formatDate(period.end)}. Die Rechnung fliesst dann nicht in
			diese Nebenkostenabrechnungen ein. Prüfen Sie das Rechnungsdatum und den Leistungszeitraum.
		</p>
	</Alert>
{/if}

<MoneyInput
	id="amount"
	label="Betrag"
	example="450.00"
	bind:value={amount}
	error={errors.amount}
	testid="invoice-amount-input"
/>

<TextInput
	id="billingEntity"
	label="Rechnungssteller"
	help="Firma oder Person, die die Rechnung ausstellt."
	example="Energie Zürich AG"
	bind:value={billingEntity}
	{onblur}
	error={errors.billingEntity}
	testid="invoice-billing-entity-input"
/>

<Textarea
	id="description"
	label="Beschreibung"
	help="Welche Leistung die Rechnung verrechnet."
	example="Heizöllieferung 2025"
	rows={3}
	bind:value={description}
	{onblur}
	error={errors.description}
	testid="invoice-description-input"
/>
