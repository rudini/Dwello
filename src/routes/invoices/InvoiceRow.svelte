<script lang="ts">
	import type { InvoiceWithDetails } from '$lib/types';
	import Badge from '$lib/components/Badge.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { formatCurrency, formatDate } from '$lib/utils/format';

	let { invoice }: { invoice: InvoiceWithDetails } = $props();

	const statusBadges = {
		'auto-categorized': { variant: 'success', label: 'Auto' },
		manual: { variant: 'info', label: 'Manuell' },
		pending: { variant: 'warning', label: 'Ausstehend' }
	} as const satisfies Record<
		InvoiceWithDetails['categorizationStatus'],
		{ variant: string; label: string }
	>;
	const status = $derived(statusBadges[invoice.categorizationStatus]);
</script>

<tr class="hover:bg-gray-50 transition-colors" data-testid="invoice-row-{invoice.id}">
	<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
		{formatDate(invoice.invoiceDate)}
	</td>
	<td class="px-6 py-4">
		<div class="text-sm font-medium text-gray-900">{invoice.billingEntity}</div>
		<div class="text-sm text-ink-muted truncate max-w-xs">{invoice.description}</div>
		<div class="text-xs text-ink-muted mt-1">{invoice.buildingName}</div>
	</td>
	<td class="px-6 py-4 whitespace-nowrap">
		{#if invoice.category}
			<span
				class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
				data-testid="invoice-category"
			>
				{invoice.category.name}
			</span>
		{:else}
			<span class="text-sm text-ink-muted">-</span>
		{/if}
	</td>
	<td
		class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right"
		data-testid="invoice-amount"
	>
		{formatCurrency(invoice.amount)}
	</td>
	<td class="px-6 py-4 whitespace-nowrap text-center">
		{#if invoice.isValidUtilityCost}
			<Badge variant="success">Umlagefähig</Badge>
		{:else}
			<Badge variant="danger">Nicht umlagefähig</Badge>
		{/if}
	</td>
	<td class="px-6 py-4 whitespace-nowrap text-center" data-testid="invoice-status">
		<Badge variant={status.variant}>{status.label}</Badge>
	</td>
	<td class="px-6 py-4 whitespace-nowrap text-right text-sm">
		<div class="flex items-center justify-end gap-2">
			<a
				href="/invoices/{invoice.id}"
				class="p-1.5 text-ink-muted hover:text-accent hover:bg-blue-50 rounded-lg transition-colors"
				title="Ansehen"
				data-testid="invoice-view-button"
			>
				<Icon name="visibility" size={18} />
			</a>
			<a
				href="/invoices/{invoice.id}/edit"
				class="p-1.5 text-ink-muted hover:text-accent hover:bg-blue-50 rounded-lg transition-colors"
				title="Bearbeiten"
				data-testid="invoice-edit-button"
			>
				<Icon name="edit" size={18} />
			</a>
		</div>
	</td>
</tr>
