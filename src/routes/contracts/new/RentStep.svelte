<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { advancePaymentNotice, normalizeAmounts } from '$lib/contract-wizard';
	import type { ContractFormValues } from '$lib/contract-form';
	import Alert from '$lib/ui/Alert.svelte';
	import MoneyInput from '$lib/ui/MoneyInput.svelte';
	import RadioGroup from '$lib/ui/RadioGroup.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';
	import { formatCurrency, parsePercent, USUAL_MAXIMUM } from '$lib/utils/format';

	// Step 4: the monthly amounts, each explained with the glossary's words, and their total
	let {
		values = $bindable(),
		errors
	}: { values: ContractFormValues; errors: Record<string, string> } = $props();

	const total = $derived.by(() => {
		const plain = normalizeAmounts(values); // "1'450" as typed
		return [plain.baseRent, plain.advancePayment, plain.additionalRent].reduce(
			(sum, amount) => sum + (parseFloat(amount) || 0),
			0
		);
	});
	const notice = $derived(advancePaymentNotice(values));
	// «Verwaltungspauschale vereinbart» (#89); TODO(fachlich prüfen, #286): «eigener Satz», «Satz des Abrechnungslaufs»
	const feeChoices = $derived([
		{ value: 'run', label: m.contracts_fee_run() },
		{ value: 'own', label: m.contracts_fee_own() },
		{ value: 'none', label: m.contracts_fee_none() }
	]);
</script>

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

<RadioGroup
	name="managementFee"
	legend={m.contracts_fee_label()}
	help={m.contracts_fee_help()}
	options={feeChoices}
	bind:value={values.managementFee}
	error={errors.managementFee}
	testid="contract-fee-choice"
/>

{#if values.managementFee === 'own'}
	<TextInput
		id="managementFeeRate"
		label={m.contracts_fee_rate_label()}
		inputmode="decimal"
		bind:value={values.managementFeeRate}
		error={errors.managementFeeRate}
		testid="contract-fee-rate-input"
	/>
	<!-- the guideline holds for an agreed rate too (Art. 4 Abs. 3 VMWG, fach-review M-2) -->
	<div role="status">
		{#if parsePercent(values.managementFeeRate) > USUAL_MAXIMUM}
			<Alert tone="caution" title={m.statements_fee_above_title()} testid="contract-fee-rate-hint">
				<p>{m.statements_fee_above_text({ max: USUAL_MAXIMUM })}</p>
			</Alert>
		{/if}
	</div>
{/if}

<p class="flex items-baseline justify-between gap-4 border-t border-line pt-4 text-lg">
	<span class="font-semibold text-ink">{m.common_monthly_total()}</span>
	<span class="font-bold tabular-nums text-ink" data-testid="contract-monthly-total"
		>{formatCurrency(total)}</span
	>
</p>
