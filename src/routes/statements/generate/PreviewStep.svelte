<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { formatCurrency } from '$lib/utils/format';
	import type { PreviewRow } from './preview';

	let { previewRows, periodLabel }: { previewRows: PreviewRow[]; periodLabel: string } = $props();

	const previewTotal = $derived(previewRows.reduce((sum, row) => sum + row.totalCosts, 0));
	const headerClass = 'px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider';
</script>

<div class="space-y-6">
	<div>
		<h2 class="text-lg font-semibold text-gray-900 mb-4">Vorschau</h2>
		<p class="text-gray-500 mb-6">
			Überprüfen Sie die Zusammenfassung vor dem Erstellen der Abrechnungen.
		</p>
	</div>

	<!-- Summary Cards -->
	<div class="grid gap-4 sm:grid-cols-3">
		<div class="bg-gray-50 rounded-lg p-4">
			<p class="text-sm text-gray-500">Abrechnungsperiode</p>
			<p class="text-lg font-semibold text-gray-900 mt-1">{periodLabel}</p>
		</div>
		<div class="bg-gray-50 rounded-lg p-4">
			<p class="text-sm text-gray-500">Anzahl Abrechnungen</p>
			<p class="text-lg font-semibold text-gray-900 mt-1" data-testid="preview-count">
				{previewRows.length}
			</p>
		</div>
		<div class="bg-gray-50 rounded-lg p-4">
			<p class="text-sm text-gray-500">Gesamtkosten</p>
			<p class="text-lg font-semibold text-gray-900 mt-1">{formatCurrency(previewTotal)}</p>
		</div>
	</div>

	<!-- Breakdown per rental contract -->
	<div>
		<h3 class="text-sm font-medium text-gray-700 mb-3">Aufschlüsselung nach Mietvertrag</h3>
		{#if previewRows.length === 0}
			<p class="text-gray-500" data-testid="preview-empty">
				In dieser Periode gibt es keine Mietverträge.
			</p>
		{:else}
			<div class="border border-gray-200 rounded-lg overflow-hidden">
				<table class="w-full">
					<thead class="bg-gray-50">
						<tr>
							<th class="{headerClass} text-left">Mieter</th>
							<th class="{headerClass} text-left">Wohnung</th>
							<th class="{headerClass} text-right">Kosten</th>
							<th class="{headerClass} text-right">Saldo</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 text-sm text-gray-900">
						{#each previewRows as row (row.contractId)}
							<tr data-testid="preview-row">
								<td class="px-4 py-3">{row.tenantName}</td>
								<td class="px-4 py-3">{row.apartmentNumber}</td>
								<td class="px-4 py-3 text-right">{formatCurrency(row.totalCosts)}</td>
								<td class="px-4 py-3 text-right">{formatCurrency(row.balance)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>

	<!-- Configuration Summary -->
	<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
		<div class="flex items-start gap-3">
			<Icon name="warning" size={24} class="text-yellow-600 flex-shrink-0" />
			<div>
				<p class="font-medium text-yellow-800">Vor dem Erstellen beachten</p>
				<ul class="mt-2 text-sm text-yellow-700 space-y-1">
					<li>• Alle Rechnungen für die Periode sollten erfasst sein</li>
					<li>• Mieterwechsel sollten korrekt eingetragen sein</li>
					<li>• Verteilschlüssel müssen konfiguriert sein</li>
				</ul>
			</div>
		</div>
	</div>
</div>
