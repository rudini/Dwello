<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { InvoiceWithDetails } from '$lib/types';
	import type { Tone } from '$lib/ui/tone';
	import Badge from '$lib/ui/Badge.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { formatCurrency, formatDate } from '$lib/utils/format';

	// One invoice: the whole row opens it, named by its supplier; "Bearbeiten" stays a button of its own
	let { invoice }: { invoice: InvoiceWithDetails } = $props();

	const statusBadges = {
		'auto-categorized': { tone: 'info', label: m.invoices_status_auto() },
		manual: { tone: 'neutral', label: m.invoices_status_manual() },
		pending: { tone: 'caution', label: m.invoices_status_pending() }
	} as const satisfies Record<
		InvoiceWithDetails['categorizationStatus'],
		{ tone: Tone; label: string }
	>;
	const status = $derived(statusBadges[invoice.categorizationStatus]);
</script>

<!-- Stacked up to xl; side by side only where all columns fit, "Bearbeiten" never shrinks -->
<li
	class="relative flex flex-col gap-2 p-4 hover:bg-sunken xl:flex-row xl:items-center xl:gap-4"
	data-testid="invoice-row-{invoice.id}"
>
	<a
		href="/invoices/{invoice.id}"
		class="flex min-w-0 flex-col break-words after:absolute after:inset-0 xl:flex-1"
		data-testid="invoice-view-button"
	>
		<span class="font-semibold text-accent underline underline-offset-4"
			>{invoice.billingEntity}</span
		>
		<span class="truncate text-ink">{invoice.description}</span>
		<span class="text-ink-muted">{invoice.buildingName}, {formatDate(invoice.invoiceDate)}</span>
	</a>
	<p class="break-words text-ink xl:w-40 xl:shrink-0">
		<span class="sr-only">{m.invoices_category_label()}</span>
		{#if invoice.category}
			<span data-testid="invoice-category">{invoice.category.name}</span>
		{:else}
			<span class="text-ink-muted">{m.invoices_no_category()}</span>
		{/if}
	</p>
	<p class="font-semibold tabular-nums text-ink xl:w-32 xl:shrink-0 xl:text-right">
		<span data-testid="invoice-amount">{formatCurrency(invoice.amount)}</span>
	</p>
	<div class="flex flex-wrap gap-2 xl:w-40 xl:shrink-0">
		<Badge
			tone={invoice.isValidUtilityCost ? 'positive' : 'caution'}
			label={invoice.isValidUtilityCost ? m.glossary_allocable_term() : m.invoices_not_allocable()}
		/>
		<Badge tone={status.tone} label={status.label} testid="invoice-status" />
	</div>
	<!-- Above the row link, so it stays a button of its own -->
	<div class="relative xl:shrink-0">
		<Button
			href="/invoices/{invoice.id}/edit"
			variant="ghost"
			icon="edit"
			ariaLabel={m.invoices_edit_aria({ name: invoice.billingEntity })}
			testid="invoice-edit-button">{m.buildings_edit()}</Button
		>
	</div>
</li>
