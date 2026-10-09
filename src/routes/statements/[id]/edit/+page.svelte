<script lang="ts">
	import { enhance } from '$app/forms';
	import type { StatementWithDetails } from '$lib/types';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';
	import FieldError from '$lib/components/FieldError.svelte';
	import { formatCurrency, formatDate } from '$lib/utils/format';
	import type { ActionData } from './$types';

	let { data, form }: { data: { statement: StatementWithDetails }; form: ActionData } = $props();

	const statement = $derived(data.statement);
	const subtotal = $derived(statement.totalCosts - statement.managementFee);
	const inputClass =
		'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
</script>

<svelte:head>
	<title>Abrechnung bearbeiten - {statement.statementNumber} - Dwello</title>
</svelte:head>

<form method="POST" use:enhance class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">{statement.statementNumber}</h1>
			<p class="text-ink-muted mt-1">
				{statement.tenantName} · {statement.buildingName} · Wohnung {statement.apartmentUnit}
			</p>
		</div>
		<div class="flex items-center gap-3">
			<Button href="/statements/{statement.id}" variant="secondary" testid="form-cancel">
				Abbrechen
			</Button>
			<Button type="submit" variant="primary" testid="statement-save-button">
				<Icon name="save" size={20} />
				Speichern
			</Button>
		</div>
	</div>
	<FieldError message={form?.errors?.form} />

	<div class="grid gap-6 lg:grid-cols-3">
		<div class="lg:col-span-2 space-y-6">
			<Card>
				<h2 class="text-lg font-semibold text-gray-900 mb-4">Zahlung und Bemerkungen</h2>
				<div class="space-y-4">
					<div>
						<label for="paymentDeadline" class="block text-sm font-medium text-gray-700 mb-2">
							Zahlungsfrist
						</label>
						<input
							id="paymentDeadline"
							name="paymentDeadline"
							type="date"
							value={statement.paymentDeadline}
							data-testid="payment-deadline-input"
							class={inputClass}
						/>
					</div>
					<div>
						<label for="notes" class="block text-sm font-medium text-gray-700 mb-2"
							>Bemerkungen</label
						>
						<textarea
							id="notes"
							name="notes"
							rows="4"
							value={statement.notes ?? ''}
							data-testid="statement-notes-input"
							class={inputClass}
						></textarea>
					</div>
				</div>
			</Card>

			<!-- Calculated costs are read-only: they follow from the invoices and the generation run -->
			<Card>
				<h2 class="text-lg font-semibold text-gray-900 mb-4">Kostenpositionen</h2>
				<table class="w-full text-sm">
					<thead class="border-b border-gray-200 text-ink-muted">
						<tr>
							<th class="pb-3 text-left font-medium">Kategorie</th>
							<th class="pb-3 text-right font-medium">Gesamtkosten</th>
							<th class="pb-3 text-right font-medium">Anteil</th>
							<th class="pb-3 text-right font-medium">Mieteranteil</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-100 text-gray-900">
						{#each statement.lineItems as item (item.id)}
							<tr>
								<td class="py-3">{item.categoryName}</td>
								<td class="py-3 text-right">{formatCurrency(item.totalAmount)}</td>
								<td class="py-3 text-right">{item.percentage}%</td>
								<td class="py-3 text-right font-medium">{formatCurrency(item.tenantShare)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
				<p class="mt-4 text-sm text-ink-muted" data-testid="statement-recalculate-hint">
					Kosten und Verwaltungspauschale werden beim Erstellen der Abrechnungen berechnet. Für eine
					Korrektur den Entwurf löschen und die Abrechnungen der Liegenschaft neu erstellen.
				</p>
			</Card>
		</div>

		<!-- Sidebar -->
		<div class="space-y-6">
			<Card>
				<h3 class="text-sm font-medium text-ink-muted mb-3">Abrechnungsperiode</h3>
				<p class="font-medium text-gray-900">
					{formatDate(statement.periodStart)} - {formatDate(statement.periodEnd)}
				</p>
				<p class="text-sm text-ink-muted mt-1">{statement.rentalDays} Tage</p>
			</Card>

			<Card>
				<h3 class="text-sm font-medium text-ink-muted mb-4">Kostenübersicht</h3>
				<dl class="space-y-3 text-sm">
					<div class="flex justify-between">
						<dt class="text-gray-600">Nebenkosten</dt>
						<dd class="font-medium text-gray-900">{formatCurrency(subtotal)}</dd>
					</div>
					<div class="flex justify-between">
						<dt class="text-gray-600">Verwaltungspauschale ({statement.managementFeePercent}%)</dt>
						<dd class="font-medium text-gray-900" data-testid="statement-management-fee">
							{formatCurrency(statement.managementFee)}
						</dd>
					</div>
					<div class="border-t border-gray-200 pt-3 flex justify-between">
						<dt class="text-gray-600">Gesamtkosten</dt>
						<dd class="font-semibold text-gray-900">{formatCurrency(statement.totalCosts)}</dd>
					</div>
					<div class="flex justify-between">
						<dt class="text-gray-600">Akontobeiträge</dt>
						<dd class="font-medium text-gray-900">
							- {formatCurrency(statement.totalAdvancePayments)}
						</dd>
					</div>
					<div class="border-t border-gray-200 pt-3 flex justify-between">
						<dt class="font-semibold text-gray-900">Saldo</dt>
						<dd class="font-bold text-gray-900">{formatCurrency(statement.balance)}</dd>
					</div>
				</dl>
			</Card>
		</div>
	</div>
</form>
