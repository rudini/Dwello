<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { advancePaymentNotice, normalizeAmounts } from '$lib/contract-wizard';
	import type { ContractFormValues } from '$lib/contract-form';
	import Alert from '$lib/ui/Alert.svelte';
	import MoneyInput from '$lib/ui/MoneyInput.svelte';
	import { formatCurrency } from '$lib/utils/format';

	// Step 4: the monthly amounts, each explained with the glossary's words, and their total
	let {
		values = $bindable(),
		errors,
		takenFrom = null
	}: {
		values: ContractFormValues;
		errors: Record<string, string>;
		takenFrom?: string | null; // the period of the contract whose amounts are filled in (#144)
	} = $props();

	const total = $derived.by(() => {
		const plain = normalizeAmounts(values); // "1'450" as typed
		return [plain.baseRent, plain.advancePayment, plain.additionalRent].reduce(
			(sum, amount) => sum + (parseFloat(amount) || 0),
			0
		);
	});
	const notice = $derived(advancePaymentNotice(values));
</script>

{#if takenFrom}
	<Alert title={m.contracts_rent_taken_over_title()} testid="contract-rent-taken-over">
		<p>{m.contracts_rent_taken_over_text({ period: takenFrom })}</p>
		{#if values.additionalRent}<p>{m.contracts_rent_taken_over_additional()}</p>{/if}
	</Alert>
{/if}

<MoneyInput
	id="baseRent"
	label={m.contracts_base_rent_label()}
	help={m.contracts_base_rent_help()}
	example="1500.00"
	bind:value={values.baseRent}
	error={errors.baseRent}
	testid="contract-base-rent-input"
/>

<!-- TODO(fachlich prüfen, #66): the examples "Heizung, Wasser usw." go beyond the glossary definition -->
<MoneyInput
	id="advancePayment"
	label={m.contracts_advance_label()}
	help={m.contracts_advance_help()}
	example="180.00"
	optional
	bind:value={values.advancePayment}
	error={errors.advancePayment}
	testid="contract-advance-payment-input"
/>

{#if notice}
	<Alert title={m.contracts_no_advance()} testid="advance-payment-notice"><p>{notice}</p></Alert>
{/if}

<MoneyInput
	id="additionalRent"
	label={m.contracts_additional_label()}
	help={m.contracts_additional_help()}
	optional
	bind:value={values.additionalRent}
	error={errors.additionalRent}
	testid="contract-additional-rent-input"
/>

<p class="flex items-baseline justify-between gap-4 border-t border-line pt-4 text-lg">
	<span class="font-semibold text-ink">{m.common_monthly_total()}</span>
	<span class="font-bold tabular-nums text-ink" data-testid="contract-monthly-total"
		>{formatCurrency(total)}</span
	>
</p>
