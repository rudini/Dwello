<script lang="ts">
	import { formatCurrency } from '$lib/utils/format';
	import MoneyField from './MoneyField.svelte';

	// Rent of a contract; the gross rent is shown once any amount is filled in
	let {
		baseRent = $bindable(),
		additionalRent = $bindable(),
		advancePayment = $bindable(),
		errors
	}: {
		baseRent: string;
		additionalRent: string;
		advancePayment: string;
		errors: Record<string, string>;
	} = $props();

	const total = $derived(
		(parseFloat(baseRent) || 0) +
			(parseFloat(additionalRent) || 0) +
			(parseFloat(advancePayment) || 0)
	);
</script>

<div class="border-t border-gray-200 pt-6">
	<h3 class="text-sm font-medium text-gray-700 mb-4">Mietzins</h3>

	<div class="space-y-4">
		<MoneyField
			id="baseRent"
			label="Nettomiete"
			bind:value={baseRent}
			placeholder="2100.00"
			required
			error={errors.baseRent}
			testid="contract-base-rent-input"
		/>
		<MoneyField
			id="advancePayment"
			label="Akonto"
			bind:value={advancePayment}
			placeholder="180.00"
			error={errors.advancePayment}
		/>
		<MoneyField
			id="additionalRent"
			label="Zusatzmiete"
			bind:value={additionalRent}
			placeholder="120.00"
			error={errors.additionalRent}
		/>
	</div>

	{#if total > 0}
		<div class="mt-4 p-4 bg-gray-50 rounded-lg">
			<div class="flex justify-between items-center">
				<span class="font-medium text-gray-700">Total Bruttomiete</span>
				<span class="text-xl font-bold text-primary">{formatCurrency(total)}</span>
			</div>
		</div>
	{/if}
</div>
