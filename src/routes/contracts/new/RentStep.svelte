<script lang="ts">
	import { advancePaymentNotice } from '$lib/contract-wizard';
	import type { ContractFormValues } from '$lib/contract-form';
	import Alert from '$lib/ui/Alert.svelte';
	import MoneyInput from '$lib/ui/MoneyInput.svelte';
	import { formatCurrency } from '$lib/utils/format';

	// Step 4: the monthly amounts, each explained with the glossary's words, and their total
	let {
		values = $bindable(),
		errors
	}: { values: ContractFormValues; errors: Record<string, string> } = $props();

	const total = $derived(
		[values.baseRent, values.advancePayment, values.additionalRent].reduce(
			(sum, amount) => sum + (parseFloat(amount) || 0),
			0
		)
	);
	const notice = $derived(advancePaymentNotice(values));
</script>

<MoneyInput
	id="baseRent"
	label="Nettomiete pro Monat"
	help="Monatliche Grundmiete ohne Nebenkosten."
	example="1500.00"
	bind:value={values.baseRent}
	error={errors.baseRent}
	testid="contract-base-rent-input"
/>

<MoneyInput
	id="advancePayment"
	label="Akonto pro Monat"
	help="Monatlicher Vorschuss des Mieters für Nebenkosten (Heizung, Wasser usw.). Wird mit der Nebenkostenabrechnung verrechnet."
	example="180.00"
	optional
	bind:value={values.advancePayment}
	error={errors.advancePayment}
	testid="contract-advance-payment-input"
/>

{#if notice}
	<Alert title="Kein Akonto" testid="advance-payment-notice"><p>{notice}</p></Alert>
{/if}

<MoneyInput
	id="additionalRent"
	label="Zusatzmiete pro Monat"
	help="Zusätzliche monatliche Kosten, zum Beispiel für Garage, Parkplatz oder Keller."
	optional
	bind:value={values.additionalRent}
	error={errors.additionalRent}
	testid="contract-additional-rent-input"
/>

<p class="flex items-baseline justify-between gap-4 border-t border-line pt-4 text-lg">
	<!-- TODO(fachlich prüfen): no glossary term for the monthly total, see docs/design/offene-punkte.md -->
	<span class="font-semibold text-ink">Monatlich total</span>
	<span class="font-bold tabular-nums text-ink" data-testid="contract-monthly-total"
		>{formatCurrency(total)}</span
	>
</p>
