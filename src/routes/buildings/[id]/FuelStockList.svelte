<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/ui/Button.svelte';
	import Dialog from '$lib/ui/Dialog.svelte';
	import { formatCurrency, formatDate } from '$lib/utils/format';
	import type { FuelStock } from './+page.server';

	// The Tankbestand readings of a building; deleting one asks first, it changes how heating costs are billed
	let { stocks, categories }: { stocks: FuelStock[]; categories: { id: string; name: string }[] } =
		$props();

	const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? '';

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
			<span class="text-ink-muted">{categoryName(stock.categoryId)}</span>
			<span class="tabular-nums text-ink">{formatCurrency(stock.amount)}</span>
			<Button
				variant="danger-ghost"
				icon="delete"
				ariaLabel="Bestand vom {formatDate(stock.readingDate)} löschen"
				onclick={() => (deleting = stock)}
				testid="fuel-stock-delete-{stock.id}">Löschen</Button
			>
		</li>
	{/each}
</ul>

<form bind:this={deleteForm} method="POST" action="?/deleteFuelStock" use:enhance>
	<input type="hidden" name="stockId" value={deleting?.id ?? ''} />
</form>

<Dialog
	open={!!deleting}
	title="Bestand vom {deleting ? formatDate(deleting.readingDate) : ''} löschen?"
	confirmLabel="Bestand löschen"
	danger
	confirmTestid="fuel-stock-delete-confirm"
	onconfirm={() => {
		deleteForm?.requestSubmit();
		deleting = null;
	}}
	onclose={() => (deleting = null)}
>
	<p>
		Abrechnungen, die mit diesem Stichtag beginnen oder enden, rechnen dann den Einkauf ab, nicht
		den Verbrauch. Bestehende Abrechnungen ändern sich nicht.
	</p>
</Dialog>
