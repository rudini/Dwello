<script lang="ts">
	import type { Reconciliation } from '$lib/cost-reconciliation';
	import { m } from '$lib/paraglide/messages';
	import { formatCurrency } from '$lib/utils/format';

	// #1138 (PO 06.11.2026, Fachreview 1138-1): under the table, why a position differs from its invoices (the change
	// of the Tankbestand) and which apartments had Leerstand, each with its days, joined by commas
	let { reconciliation }: { reconciliation: Reconciliation } = $props();

	const vacancies = $derived(
		reconciliation.vacancies
			.map(({ apartmentNumber: number, days }) =>
				(days === 1
					? m.reconciliation_vacancy_apartment_one
					: m.reconciliation_vacancy_apartment_many)({ number, days })
			)
			.join(', ')
	);
</script>

{#each reconciliation.fuelStocks as stock (stock.position)}
	<p class="text-ink-muted" data-testid="cost-reconciliation-fuel-stock">
		{m.reconciliation_fuel_stock({
			position: stock.position,
			opening: formatCurrency(stock.opening),
			closing: formatCurrency(stock.closing)
		})}
	</p>
{/each}
{#if vacancies}
	<p class="text-ink-muted" data-testid="cost-reconciliation-vacancy">
		{m.reconciliation_vacancy({ apartments: vacancies })}
	</p>
{/if}
