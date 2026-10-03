<script lang="ts">
	import type { StatementWithDetails } from '$lib/types';
	import { formatCurrency, formatDate } from '$lib/utils/format';
	import Icon from './Icon.svelte';

	interface Props {
		statement: StatementWithDetails;
		class?: string;
	}

	let { statement, class: className = '' }: Props = $props();

	const balance = $derived(statement.balance);
	const isRefund = $derived(balance < 0);
</script>

<div class="bg-white border border-gray-300 rounded-lg shadow-lg {className}">
	<!-- Document Header -->
	<div class="p-8 border-b border-gray-200">
		<div class="flex justify-between items-start">
			<div>
				<h1 class="text-2xl font-bold text-gray-900">Nebenkostenabrechnung</h1>
				<p class="text-gray-600 mt-1">Nr. {statement.statementNumber}</p>
			</div>
			<div class="text-right">
				<p class="text-sm text-gray-500">Datum</p>
				<p class="font-medium text-gray-900">{formatDate(statement.statementDate)}</p>
			</div>
		</div>
	</div>

	<!-- Addresses -->
	<div class="grid grid-cols-2 gap-8 p-8 border-b border-gray-200">
		<div>
			<p class="text-xs text-gray-500 uppercase tracking-wider mb-2">Vermieter</p>
			<p class="font-medium text-gray-900">Dwello Immobilien AG</p>
			<p class="text-gray-600">Bahnhofstrasse 1</p>
			<p class="text-gray-600">8000 Zürich</p>
		</div>
		<div>
			<p class="text-xs text-gray-500 uppercase tracking-wider mb-2">Mieter</p>
			<p class="font-medium text-gray-900">{statement.tenantName}</p>
			<p class="text-gray-600">{statement.buildingAddress}</p>
			<p class="text-gray-600">Wohnung {statement.apartmentUnit}</p>
		</div>
	</div>

	<!-- Period Info -->
	<div class="p-8 border-b border-gray-200 bg-gray-50">
		<div class="grid grid-cols-3 gap-4 text-center">
			<div>
				<p class="text-xs text-gray-500 uppercase tracking-wider">Abrechnungsperiode</p>
				<p class="font-medium text-gray-900 mt-1">
					{formatDate(statement.periodStart)} - {formatDate(statement.periodEnd)}
				</p>
			</div>
			<div>
				<p class="text-xs text-gray-500 uppercase tracking-wider">Mietdauer</p>
				<p class="font-medium text-gray-900 mt-1">{statement.rentalDays} Tage</p>
			</div>
			<div>
				<p class="text-xs text-gray-500 uppercase tracking-wider">Objekt</p>
				<p class="font-medium text-gray-900 mt-1">{statement.buildingName}</p>
			</div>
		</div>
	</div>

	<!-- Cost Breakdown -->
	<div class="p-8 border-b border-gray-200">
		<h2 class="text-lg font-semibold text-gray-900 mb-4">Kostenaufstellung</h2>

		<table class="w-full">
			<thead>
				<tr class="border-b border-gray-200">
					<th class="py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
						Kostenart
					</th>
					<th class="py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
						Gesamtkosten
					</th>
					<th class="py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
						Anteil
					</th>
					<th class="py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
						Ihr Anteil
					</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-100">
				{#each statement.lineItems as item}
					<tr>
						<td class="py-3 text-gray-900">{item.categoryName}</td>
						<td class="py-3 text-right text-gray-600">{formatCurrency(item.totalAmount)}</td>
						<td class="py-3 text-right text-gray-600">{item.percentage}%</td>
						<td class="py-3 text-right font-medium text-gray-900">{formatCurrency(item.tenantShare)}</td>
					</tr>
				{/each}
			</tbody>
			<tfoot>
				<tr class="border-t border-gray-200">
					<td colspan="3" class="py-3 font-medium text-gray-900">Zwischensumme Nebenkosten</td>
					<td class="py-3 text-right font-medium text-gray-900">
						{formatCurrency(statement.totalCosts)}
					</td>
				</tr>
				<tr>
					<td colspan="3" class="py-2 text-gray-600">Verwaltungspauschale</td>
					<td class="py-2 text-right text-gray-600">{formatCurrency(statement.managementFee)}</td>
				</tr>
				<tr class="border-t border-gray-200">
					<td colspan="3" class="py-3 font-semibold text-gray-900">Gesamtkosten</td>
					<td class="py-3 text-right font-semibold text-gray-900">
						{formatCurrency(statement.totalCosts + statement.managementFee)}
					</td>
				</tr>
			</tfoot>
		</table>
	</div>

	<!-- Summary -->
	<div class="p-8 border-b border-gray-200">
		<h2 class="text-lg font-semibold text-gray-900 mb-4">Zusammenfassung</h2>

		<div class="space-y-3">
			<div class="flex justify-between">
				<span class="text-gray-600">Gesamtkosten</span>
				<span class="font-medium text-gray-900">
					{formatCurrency(statement.totalCosts + statement.managementFee)}
				</span>
			</div>
			<div class="flex justify-between">
				<span class="text-gray-600">Geleistete Akontobeiträge</span>
				<span class="font-medium text-gray-900">
					- {formatCurrency(statement.totalAdvancePayments)}
				</span>
			</div>
			<div class="flex justify-between pt-3 border-t border-gray-200">
				<span class="font-semibold text-gray-900">
					{isRefund ? 'Rückerstattung' : 'Nachzahlung'}
				</span>
				<span class="font-bold text-xl {isRefund ? 'text-green-600' : 'text-red-600'}">
					{formatCurrency(Math.abs(balance))}
				</span>
			</div>
		</div>
	</div>

	<!-- Payment Info -->
	<div class="p-8 bg-gray-50">
		{#if isRefund}
			<div class="flex items-start gap-3">
				<Icon name="info" size={24} class="text-green-600 flex-shrink-0" />
				<div>
					<p class="font-medium text-gray-900">Rückerstattung</p>
					<p class="text-gray-600 text-sm mt-1">
						Der Betrag von {formatCurrency(Math.abs(balance))} wird Ihnen innerhalb von 30 Tagen
						auf Ihr Konto überwiesen.
					</p>
				</div>
			</div>
		{:else}
			<div class="flex items-start gap-3">
				<Icon name="payment" size={24} class="text-blue-600 flex-shrink-0" />
				<div>
					<p class="font-medium text-gray-900">Zahlungsinformationen</p>
					<p class="text-gray-600 text-sm mt-1">
						Bitte überweisen Sie den Betrag von {formatCurrency(Math.abs(balance))} bis zum
						<strong>{formatDate(statement.paymentDeadline)}</strong> auf folgendes Konto:
					</p>
					<div class="mt-3 bg-white rounded-lg p-4 border border-gray-200">
						<div class="grid grid-cols-2 gap-2 text-sm">
							<span class="text-gray-500">IBAN:</span>
							<span class="font-mono text-gray-900">CH93 0076 2011 6238 5295 7</span>
							<span class="text-gray-500">Empfänger:</span>
							<span class="text-gray-900">Dwello Immobilien AG</span>
							<span class="text-gray-500">Referenz:</span>
							<span class="font-mono text-gray-900">{statement.statementNumber}</span>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<!-- Footer -->
	<div class="p-4 bg-gray-100 text-center text-xs text-gray-500">
		Dieses Dokument wurde automatisch generiert. Bei Fragen wenden Sie sich bitte an Ihre Hausverwaltung.
	</div>
</div>
