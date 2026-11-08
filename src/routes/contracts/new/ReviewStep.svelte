<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { chosenApartmentName, contractSummary } from '$lib/contract-wizard';
	import type { ContractFormValues, Overlap } from '$lib/contract-form';
	import ContractsUnknown from './ContractsUnknown.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Alert from '$lib/ui/Alert.svelte';
	import OverlapLink from '../OverlapLink.svelte';

	// Step 5: the whole contract in words before it is saved; each fact leads back to its step
	let {
		values,
		tenants,
		apartments,
		categories,
		unknown = false,
		overlap = null,
		onretry,
		onedit
	}: {
		values: ContractFormValues;
		tenants: { id: string; name: string }[];
		apartments: { id: string; unit: string; building: string }[];
		categories: { id: string; name: string }[];
		unknown?: boolean; // the apartment's contracts could not be loaded: whether it is free is not checked
		overlap?: Overlap | null; // found once they are loaded again (#669, Helga H-1)
		onretry: () => void; // loads them again
		onedit: (step: number, field: string) => void;
	} = $props();
</script>

<p class="text-ink-muted">{m.contracts_review_intro()}</p>

{#if unknown}
	<ContractsUnknown {onretry} testid="review-contracts-unknown" />
{:else if overlap}
	<Alert tone="caution" title={m.contracts_overlap_title()} testid="overlap-warning">
		<p>{overlap.text}</p>
		<p>
			{m.contracts_overlap_review_where({
				period: 3,
				periodStep: m.contracts_period(),
				apartment: 2,
				apartmentStep: m.tenants_apartment()
			})}
		</p>
		<OverlapLink
			contract={overlap.contract}
			apartment={chosenApartmentName(apartments, values.apartmentId)}
		/>
	</Alert>
{/if}

<dl class="flex flex-col divide-y divide-line rounded-panel border border-line bg-surface">
	{#each contractSummary(values, tenants, apartments, categories) as item (item.label)}
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
						ariaLabel={m.contracts_change_aria({ label: item.label })}
						>{m.contracts_change()}</Button
					>
				</dd>
			{/if}
		</div>
	{/each}
</dl>
