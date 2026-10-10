<script lang="ts">
	import type { InvoiceWithDetails } from '$lib/types';
	import type { Tone } from '$lib/ui/tone';
	import Badge from '$lib/ui/Badge.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { formatCurrency, formatDate } from '$lib/utils/format';

	// One invoice: the whole row opens it, named by its supplier; "Bearbeiten" stays a button of its own
	let { invoice }: { invoice: InvoiceWithDetails } = $props();

	const statusBadges = {
		'auto-categorized': { tone: 'info', label: 'Automatisch' },
		manual: { tone: 'neutral', label: 'Manuell' },
		pending: { tone: 'caution', label: 'Ausstehend' }
	} as const satisfies Record<
		InvoiceWithDetails['categorizationStatus'],
		{ tone: Tone; label: string }
	>;
	const status = $derived(statusBadges[invoice.categorizationStatus]);
</script>

<li
	class="relative flex flex-col gap-2 p-4 hover:bg-sunken md:grid md:grid-cols-12 md:items-center md:gap-4"
	data-testid="invoice-row-{invoice.id}"
>
	<a
		href="/invoices/{invoice.id}"
		class="flex min-w-0 flex-col after:absolute after:inset-0 md:col-span-4"
		data-testid="invoice-view-button"
	>
		<span class="font-semibold text-accent underline underline-offset-4"
			>{invoice.billingEntity}</span
		>
		<span class="truncate text-ink">{invoice.description}</span>
		<span class="text-ink-muted">{invoice.buildingName}, {formatDate(invoice.invoiceDate)}</span>
	</a>
	<p class="text-ink md:col-span-2">
		<span class="sr-only">Kategorie:</span>
		{#if invoice.category}
			<span data-testid="invoice-category">{invoice.category.name}</span>
		{:else}
			<span class="text-ink-muted">Ohne Kategorie</span>
		{/if}
	</p>
	<p class="font-semibold tabular-nums text-ink md:col-span-2 md:text-right">
		<span data-testid="invoice-amount">{formatCurrency(invoice.amount)}</span>
	</p>
	<div class="flex flex-wrap gap-2 md:col-span-3">
		<Badge
			tone={invoice.isValidUtilityCost ? 'positive' : 'caution'}
			label={invoice.isValidUtilityCost ? 'Umlagefähig' : 'Nicht umlagefähig'}
		/>
		<Badge tone={status.tone} label={status.label} testid="invoice-status" />
	</div>
	<!-- Above the row link, so it stays a button of its own -->
	<div class="relative md:col-span-1">
		<Button
			href="/invoices/{invoice.id}/edit"
			variant="ghost"
			icon="edit"
			ariaLabel="Bearbeiten: Rechnung von {invoice.billingEntity}"
			testid="invoice-edit-button">Bearbeiten</Button
		>
	</div>
</li>
