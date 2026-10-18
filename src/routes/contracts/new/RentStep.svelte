<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { advancePaymentNotice, flatRateNotice, normalizeAmounts } from '$lib/contract-wizard';
	import type { ContractFormValues } from '$lib/contract-form';
	import { plainAmount } from '$lib/invoice';
	import Alert from '$lib/ui/Alert.svelte';
	import MoneyInput from '$lib/ui/MoneyInput.svelte';
	import RadioGroup from '$lib/ui/RadioGroup.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';
	import AgreedCategories from '../AgreedCategories.svelte';
	import { formatCurrency, isFeeRate, parsePercent, USUAL_MAXIMUM } from '$lib/utils/format';

	// Step 4: the monthly amounts, each explained with the glossary's words, and their total
	let {
		values = $bindable(),
		errors,
		takenFrom = null,
		categories,
		agreedHelp = m.contracts_agreed_costs_help()
	}: {
		values: ContractFormValues;
		errors: Record<string, string>;
		takenFrom?: string | null; // the period of the contract whose amounts are filled in (#144)
		categories: { id: string; name: string }[]; // the umlagefähige ones it can agree (#91)
		agreedHelp?: string; // editing: existing statements stay, new Nebenkosten need the form
	} = $props();

	const total = $derived.by(() => {
		const plain = normalizeAmounts(values); // "1'450" as typed
		return [
			plain.baseRent,
			plain.advancePayment,
			plain.flatRateUtilityCharge ?? '',
			plain.additionalRent
		].reduce((sum, amount) => sum + (parseFloat(amount) || 0), 0);
	});
	const notice = $derived(advancePaymentNotice(values));
	const flatRateWarning = $derived(flatRateNotice(values, categories)); // #429
	const ownRate = $derived(parsePercent(values.managementFeeRate));
	// «Verwaltungspauschale vereinbart» (#89); TODO(fachlich prüfen, #286): «eigener Satz», «Satz des Abrechnungslaufs»
	const feeChoices = $derived([
		{ value: 'run', label: m.contracts_fee_run() },
		{ value: 'own', label: m.contracts_fee_own() },
		{ value: 'none', label: m.contracts_fee_none() }
	]);
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

<!-- #429: a fixed monthly amount, in «Monatlich total», never billed -->
<MoneyInput
	id="flatRateUtilityCharge"
	label={m.contracts_flat_rate_label()}
	help={m.contracts_flat_rate_help()}
	optional
	bind:value={values.flatRateUtilityCharge}
	error={errors.flatRateUtilityCharge}
	testid="contract-flat-rate-input"
/>

<div role="status">
	{#if flatRateWarning}
		<Alert
			tone="caution"
			title={m.contracts_flat_rate_warning_title()}
			testid="contract-flat-rate-warning"
		>
			<p>{flatRateWarning}</p>
		</Alert>
	{/if}
</div>

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
		{#if ownRate > USUAL_MAXIMUM && isFeeRate(ownRate)}
			<Alert tone="caution" title={m.statements_fee_above_title()} testid="contract-fee-rate-hint">
				<p>{m.statements_fee_above_text({ max: USUAL_MAXIMUM })}</p>
			</Alert>
		{/if}
	</div>
{/if}

<AgreedCategories
	{categories}
	bind:agreed={values.agreedCategoryIds}
	help={agreedHelp}
	flatRate={parseFloat(plainAmount(values.flatRateUtilityCharge ?? '')) > 0}
/>

<p class="flex items-baseline justify-between gap-4 border-t border-line pt-4 text-lg">
	<span class="font-semibold text-ink">{m.common_monthly_total()}</span>
	<span class="font-bold tabular-nums text-ink" data-testid="contract-monthly-total"
		>{formatCurrency(total)}</span
	>
</p>
