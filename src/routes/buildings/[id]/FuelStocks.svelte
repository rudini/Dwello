<script lang="ts">
	import { enhance } from '$app/forms';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import MoneyInput from '$lib/ui/MoneyInput.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import Select from '$lib/ui/Select.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';
	import type { FuelStock } from './+page.server';
	import FuelStockList from './FuelStockList.svelte';

	// Heating oil or pellets in the tank (Tankbestand): statements take the consumption, not the purchases
	let {
		stocks,
		categories,
		errors = {},
		saved = false
	}: {
		stocks: FuelStock[] | null; // null: could not be loaded
		categories: { id: string; name: string }[];
		errors?: Record<string, string>;
		saved?: boolean;
	} = $props();
</script>

<!-- TODO(fachlich prüfen): "Tankbestand", "Stichtag" and the valuation are not in the glossary -->
<Panel title="Heizöl oder Pellets im Tank" testid="fuel-stocks">
	<p class="text-ink-muted">
		Nur für Gebäude mit Öl- oder Pellettank. Abgerechnet wird, was verbraucht wurde: Anfangsbestand
		+ Einkauf − Endbestand. Erfassen Sie dafür am letzten Tag jeder Abrechnungsperiode, zum Beispiel
		am 31.12., den Wert im Tank in Franken. Der Wert vom 31.12.2024 ist der Endbestand 2024 und der
		Anfangsbestand 2025. Den Wert berechnen Sie so: Liter im Tank mal Preis pro Liter der letzten
		Lieferung.
	</p>

	{#if stocks === null}
		<Alert tone="critical" title="Nicht geladen" testid="fuel-stock-load-error">
			<p>Die Tankbestände konnten nicht geladen werden. Laden Sie die Seite neu.</p>
		</Alert>
	{:else if stocks.length}
		<FuelStockList {stocks} {categories} />
	{/if}

	<form method="POST" action="?/addFuelStock" use:enhance class="flex flex-col gap-4">
		<div class="grid gap-4 sm:grid-cols-2">
			<TextInput
				id="fuelStockDate"
				name="readingDate"
				type="date"
				label="Stichtag"
				error={errors.readingDate}
				testid="fuel-stock-date-input"
			/>
			<MoneyInput
				id="fuelStockAmount"
				name="amount"
				label="Wert in Franken"
				example="2650.00"
				error={errors.amount}
				testid="fuel-stock-amount-input"
			/>
		</div>
		<Select
			id="fuelStockCategory"
			name="categoryId"
			label="Kategorie"
			help="In dieser Kategorie wird der Verbrauch abgerechnet."
			options={categories.map((c) => ({ value: c.id, label: c.name }))}
			value={categories[0]?.id ?? ''}
			testid="fuel-stock-category-select"
		/>
		{#if errors.form}
			<Alert tone="critical" title="Nicht gespeichert" testid="fuel-stock-error">
				<p>{errors.form}</p>
			</Alert>
		{/if}
		<p role="status" class="text-ink" data-testid="fuel-stock-status">
			{saved ? 'Bestand gespeichert.' : ''}
		</p>
		<div>
			<Button type="submit" icon="add" testid="fuel-stock-save-button">Bestand speichern</Button>
		</div>
	</form>
</Panel>
