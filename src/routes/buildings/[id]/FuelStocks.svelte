<script lang="ts">
	import { enhance } from '$app/forms';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import MoneyInput from '$lib/ui/MoneyInput.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';
	import { formatCurrency, formatDate } from '$lib/utils/format';
	import type { FuelStock } from './+page.server';

	// Heating oil in the tank (Tankbestand): statements take the consumption, not the purchases of the period
	let {
		stocks,
		errors = {}
	}: { stocks: FuelStock[]; errors?: Record<string, string> } = $props();
</script>

<!-- TODO(fachlich prüfen): "Tankbestand" and "Stichtag" are not in the glossary -->
<Panel title="Heizöl im Tank" testid="fuel-stocks">
	<p class="text-ink-muted">
		Nur für Gebäude mit Öl- oder Pellettank. Abgerechnet wird, was verbraucht wurde:
		Anfangsbestand + Einkauf − Endbestand. Erfassen Sie dafür am letzten Tag jeder
		Abrechnungsperiode, zum Beispiel am 31.12., den Wert des Heizöls im Tank in Franken. Der Wert vom
		31.12.2024 ist der Endbestand 2024 und der Anfangsbestand 2025.
	</p>

	{#if stocks.length}
		<ul class="flex flex-col divide-y divide-line">
			{#each stocks as stock (stock.id)}
				<li
					class="flex flex-wrap items-center justify-between gap-4 py-2"
					data-testid="fuel-stock-{stock.id}"
				>
					<span class="text-ink">{formatDate(stock.readingDate)}</span>
					<span class="tabular-nums text-ink">{formatCurrency(stock.amount)}</span>
					<form method="POST" action="?/deleteFuelStock" use:enhance>
						<input type="hidden" name="stockId" value={stock.id} />
						<Button
							type="submit"
							variant="danger-ghost"
							icon="delete"
							ariaLabel="Bestand vom {formatDate(stock.readingDate)} löschen"
							testid="fuel-stock-delete-{stock.id}">Löschen</Button
						>
					</form>
				</li>
			{/each}
		</ul>
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
		{#if errors.form}
			<Alert tone="critical" title="Nicht gespeichert" testid="fuel-stock-error">
				<p>{errors.form}</p>
			</Alert>
		{/if}
		<div><Button type="submit" icon="add" testid="fuel-stock-save-button">Bestand speichern</Button></div>
	</form>
</Panel>
