<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { enhance } from '$app/forms';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Dialog from '$lib/ui/Dialog.svelte';
	import { formatCurrency, formatDate } from '$lib/utils/format';
	import type { FuelStock } from './+page.server';

	// The Tankbestand readings of a building; deleting one asks first, it changes how heating costs are billed
	let { stocks, deleteError }: { stocks: FuelStock[]; deleteError?: string } = $props();

	let deleting = $state<FuelStock | null>(null);
	let deleteForm = $state<HTMLFormElement>();
</script>

<ul class="flex flex-col divide-y divide-line">
	{#each stocks as stock (stock.id)}
		<li
			class="flex flex-wrap items-center justify-between gap-4 py-2"
			data-testid="fuel-stock-{stock.id}"
		>
			<span class="text-ink">{formatDate(stock.readingDate)}</span>
			<span class="text-ink-muted">{stock.categoryName}</span>
			<span class="tabular-nums text-ink">{formatCurrency(stock.amount)}</span>
			<Button
				variant="danger-ghost"
				icon="delete"
				ariaLabel={m.buildings_fuel_delete_label({ date: formatDate(stock.readingDate) })}
				onclick={() => (deleting = stock)}
				testid="fuel-stock-delete-{stock.id}">{m.buildings_delete()}</Button
			>
		</li>
	{/each}
</ul>

{#if deleteError}
	<Alert tone="critical" title={m.buildings_not_deleted()} testid="fuel-stock-delete-error">
		<p>{deleteError}</p>
	</Alert>
{/if}

<form bind:this={deleteForm} method="POST" action="?/deleteFuelStock" use:enhance>
	<input type="hidden" name="stockId" value={deleting?.id ?? ''} />
</form>

<Dialog
	open={!!deleting}
	title={m.buildings_fuel_delete_title({
		date: deleting ? formatDate(deleting.readingDate) : ''
	})}
	confirmLabel={m.buildings_fuel_delete_confirm()}
	danger
	confirmTestid="fuel-stock-delete-confirm"
	onconfirm={() => {
		deleteForm?.requestSubmit();
		deleting = null;
	}}
	onclose={() => (deleting = null)}
>
	<p>
		{m.buildings_fuel_delete_text()}
	</p>
</Dialog>
