<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { enhance } from '$app/forms';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import MoneyInput from '$lib/ui/MoneyInput.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import Select from '$lib/ui/Select.svelte';
	import DateInput from '$lib/ui/DateInput.svelte';
	import type { FuelStock } from './+page.server';
	import FuelStockList from './FuelStockList.svelte';

	// Heating oil or pellets in the tank (Tankbestand): statements take the consumption, not the purchases
	let {
		stocks,
		categories,
		errors = {},
		saved = false,
		deleteError
	}: {
		stocks: FuelStock[] | null; // null: could not be loaded
		categories: { id: string; name: string }[] | null; // null: could not be loaded
		errors?: Record<string, string>;
		saved?: boolean;
		deleteError?: string;
	} = $props();

	// one tank per building: new readings go to the category of the earlier ones
	const choice = $derived(categories ?? []);
	const category = $derived(stocks?.at(-1)?.categoryId ?? choice[0]?.id ?? '');
</script>

<!-- TODO(fachlich prüfen, #61): valuation of the Tankbestand (price of the last delivery) -->
<Panel title={m.buildings_fuel_title()} testid="fuel-stocks">
	<p class="text-ink-muted">
		{m.buildings_fuel_intro()}
	</p>

	{#if stocks === null}
		<Alert tone="critical" title={m.buildings_not_loaded()} testid="fuel-stock-load-error">
			<p>{m.buildings_fuel_load_failed()}</p>
		</Alert>
	{:else if stocks.length}
		<FuelStockList {stocks} {deleteError} />
	{/if}

	<form method="POST" action="?/addFuelStock" use:enhance class="flex flex-col gap-4">
		<div class="grid gap-4 sm:grid-cols-2">
			<DateInput
				id="fuelStockDate"
				name="readingDate"
				label={m.buildings_fuel_date()}
				error={errors.readingDate}
				testid="fuel-stock-date-input"
			/>
			<MoneyInput
				id="fuelStockAmount"
				name="amount"
				label={m.buildings_fuel_amount()}
				example="2650.00"
				error={errors.amount}
				testid="fuel-stock-amount-input"
			/>
		</div>
		{#if categories === null}
			<Alert tone="critical" title={m.buildings_not_loaded()} testid="fuel-stock-categories-error">
				<p>{m.buildings_categories_load_failed()}</p>
			</Alert>
		{:else if categories.length === 0}
			<Alert tone="caution" title={m.buildings_no_category()} testid="fuel-stock-no-category">
				<p>
					{m.buildings_no_category_text()}
					<a
						href="/config/categories"
						class="inline-flex min-h-12 items-center font-semibold text-accent underline underline-offset-4"
						data-testid="fuel-stock-categories-link">{m.buildings_view_categories()}</a
					>
				</p>
			</Alert>
		{/if}
		<Select
			id="fuelStockCategory"
			name="categoryId"
			label={m.buildings_category()}
			help={m.buildings_fuel_category_help()}
			options={choice.map((c) => ({ value: c.id, label: c.name }))}
			value={category}
			testid="fuel-stock-category-select"
		/>
		{#if errors.form}
			<Alert tone="critical" title={m.buildings_not_saved()} testid="fuel-stock-error">
				<p>{errors.form}</p>
			</Alert>
		{/if}
		<p role="status" class="text-ink" data-testid="fuel-stock-status">
			{saved ? m.buildings_fuel_saved() : ''}
		</p>
		<div>
			<Button type="submit" icon="add" testid="fuel-stock-save-button"
				>{m.buildings_fuel_save()}</Button
			>
		</div>
	</form>
</Panel>
