<script lang="ts">
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

<!-- TODO(fachlich prüfen): "Tankbestand", "Stichtag" and the valuation are not in the glossary -->
<Panel title="Heizöl oder Pellets im Tank" testid="fuel-stocks">
	<p class="text-ink-muted">
		Nur für Gebäude mit Öl- oder Pellettank. Abgerechnet wird, was verbraucht wurde: Anfangsbestand
		+ Einkauf − Endbestand. Erfassen Sie dafür am letzten Tag jeder Abrechnungsperiode, zum Beispiel
		am 31.12., den Wert im Tank in Franken. Der Wert vom 31.12.2024 ist der Endbestand 2024 und der
		Anfangsbestand 2025. Den Wert berechnen Sie so: Liter im Tank mal Preis pro Liter der letzten
		Lieferung. Ist mehr im Tank als die letzte Lieferung, rechnen Sie den Rest zum Preis der
		Lieferung davor. Lesen Sie erst Anfang Januar ab, erfassen Sie den Wert trotzdem per 31.12.
	</p>

	{#if stocks === null}
		<Alert tone="critical" title="Nicht geladen" testid="fuel-stock-load-error">
			<p>Die Tankbestände konnten nicht geladen werden. Laden Sie die Seite neu.</p>
		</Alert>
	{:else if stocks.length}
		<FuelStockList {stocks} categories={choice} {deleteError} />
	{/if}

	<form method="POST" action="?/addFuelStock" use:enhance class="flex flex-col gap-4">
		<div class="grid gap-4 sm:grid-cols-2">
			<DateInput
				id="fuelStockDate"
				name="readingDate"
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
		{#if categories === null}
			<Alert tone="critical" title="Nicht geladen" testid="fuel-stock-categories-error">
				<p>Die Kategorien konnten nicht geladen werden. Laden Sie die Seite neu.</p>
			</Alert>
		{:else if categories.length === 0}
			<Alert tone="caution" title="Keine Kategorie" testid="fuel-stock-no-category">
				<p>
					Es gibt keine Kategorie, die Heizkosten nach dem Heizprofil verteilt.
					<a
						href="/config/categories"
						class="inline-flex min-h-12 items-center font-semibold text-accent underline underline-offset-4"
						data-testid="fuel-stock-categories-link">Kategorien ansehen</a
					>
				</p>
			</Alert>
		{/if}
		<Select
			id="fuelStockCategory"
			name="categoryId"
			label="Kategorie"
			help="In dieser Kategorie wird der Verbrauch abgerechnet."
			options={choice.map((c) => ({ value: c.id, label: c.name }))}
			value={category}
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
