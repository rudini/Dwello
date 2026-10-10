<script lang="ts">
	import { contractSummary } from '$lib/contract-wizard';
	import type { ContractFormValues } from '$lib/contract-form';
	import Button from '$lib/ui/Button.svelte';

	// Step 5: the whole contract in words before it is saved; each fact leads back to its step
	let {
		values,
		tenants,
		apartments,
		onedit
	}: {
		values: ContractFormValues;
		tenants: { id: string; name: string }[];
		apartments: { id: string; unit: string; building: string }[];
		onedit: (step: number, field: string) => void;
	} = $props();
</script>

<p class="text-ink-muted">
	Prüfen Sie die Angaben. Mit «Mietvertrag speichern» wird der Mietvertrag erstellt.
</p>

<dl class="flex flex-col divide-y divide-line rounded-panel border border-line bg-surface">
	{#each contractSummary(values, tenants, apartments) as item (item.label)}
		<!-- phones: label above value, "Ändern" beside; from sm one line -->
		<div
			class="grid grid-cols-value-action items-center gap-x-4 px-4 py-2 sm:grid-cols-label-value-action"
			data-testid="contract-review-item"
		>
			<dt class="text-ink-muted">{item.label}</dt>
			<dd class="col-start-1 font-semibold tabular-nums text-ink sm:col-auto sm:row-auto">
				{item.value}
			</dd>
			{#if item.step}
				{@const step = item.step}
				<dd class="col-start-2 row-span-2 row-start-1 sm:col-auto sm:row-auto">
					<Button
						variant="ghost"
						onclick={() => onedit(step, item.field)}
						ariaLabel="{item.label} ändern">Ändern</Button
					>
				</dd>
			{/if}
		</div>
	{/each}
</dl>
