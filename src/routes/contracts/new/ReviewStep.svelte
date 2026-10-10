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
		onedit: (step: number) => void;
	} = $props();
</script>

<p class="text-ink-muted">
	Prüfen Sie die Angaben. Mit «Mietvertrag speichern» wird der Mietvertrag erstellt.
</p>

<dl class="flex flex-col divide-y divide-line rounded-panel border border-line bg-surface">
	{#each contractSummary(values, tenants, apartments) as item (item.label)}
		<div
			class="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2 sm:flex-nowrap"
			data-testid="contract-review-item"
		>
			<dt class="w-40 shrink-0 text-ink-muted">{item.label}</dt>
			<dd class="flex-1 font-semibold tabular-nums text-ink">{item.value}</dd>
			{#if item.step}
				{@const step = item.step}
				<dd>
					<Button variant="ghost" onclick={() => onedit(step)} ariaLabel="{item.label} ändern"
						>Ändern</Button
					>
				</dd>
			{/if}
		</div>
	{/each}
</dl>
