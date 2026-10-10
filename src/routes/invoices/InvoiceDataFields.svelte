<script lang="ts">
	import MoneyInput from '$lib/ui/MoneyInput.svelte';
	import Select from '$lib/ui/Select.svelte';
	import Textarea from '$lib/ui/Textarea.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';
	import { formatDateLong } from '$lib/utils/format';

	// What the invoice says: building, date, amount, supplier and service; shared by "Neue Rechnung" and "Rechnung bearbeiten"
	let {
		buildingId = $bindable(),
		invoiceDate = $bindable(),
		amount = $bindable(),
		billingEntity = $bindable(),
		description = $bindable(),
		buildings,
		errors,
		onblur
	}: {
		buildingId: string;
		invoiceDate: string;
		amount: string;
		billingEntity: string;
		description: string;
		buildings: { id: string; name: string; address: string }[];
		errors: Record<string, string>;
		onblur?: () => void;
	} = $props();
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

<div class="flex flex-col gap-2">
	<TextInput
		id="invoiceDate"
		type="date"
		label="Rechnungsdatum"
		help="Das Rechnungsdatum bestimmt, in welche Abrechnungsperiode die Rechnung fällt. Übernehmen Sie das Datum von der Rechnung, nicht das heutige."
		bind:value={invoiceDate}
		error={errors.invoiceDate}
		testid="invoice-date-input"
	/>
	{#if invoiceDate}<p class="font-semibold text-ink">{formatDateLong(invoiceDate)}</p>{/if}
</div>

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
