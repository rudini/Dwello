<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { InvoiceWithDetails } from '$lib/types';
	import Alert from '$lib/ui/Alert.svelte';
	import Badge from '$lib/ui/Badge.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { focusFirstError } from '$lib/ui/focus-error';
	import Panel from '$lib/ui/Panel.svelte';
	import KiAssessment from '../KiAssessment.svelte';
	import CategoryReason, { reasonCategory } from '../../config/categories/CategoryReason.svelte';

	// How the invoice is distributed: category, distribution key, whether tenants pay it, and what the KI said
	let {
		invoice,
		busy,
		error,
		onrecategorize
	}: {
		invoice: InvoiceWithDetails;
		busy: boolean;
		error: string;
		onrecategorize: () => void;
	} = $props();

	// Not distributed at all: no «Keiner – … pro Wohnung verteilt» next to the reason (#292, Helga P-1)
	const showsKey = $derived(!!invoice.distributionKey || invoice.isValidUtilityCost);

	// The KI may take half a minute: its failure shows at the button and takes the focus, so it is in view
	let feedback: HTMLElement | undefined = $state();
	$effect(() => {
		if (error) focusFirstError(feedback);
	});
</script>

<Panel title={m.invoices_categorisation()}>
	<dl class="grid gap-4 sm:grid-cols-2">
		<div class="flex flex-col gap-1">
			<dt class="text-ink-muted">{m.buildings_category()}</dt>
			{#if invoice.category}
				<dd class="font-semibold text-ink" data-testid="invoice-category">
					{invoice.category.name}
				</dd>
			{:else}
				<dd class="text-ink-muted">{m.invoices_not_categorised()}</dd>
			{/if}
		</div>
		{#if showsKey}
			<div class="flex flex-col gap-1">
				<dt class="text-ink-muted">{m.glossary_key_term()}</dt>
				{#if invoice.distributionKey}
					<dd class="font-semibold text-ink" data-testid="invoice-distribution-key">
						{invoice.distributionKey.name}
					</dd>
				{:else}
					<dd class="text-ink-muted">{m.invoices_no_key()}</dd>
				{/if}
			</div>
		{/if}
		<div class="flex flex-col gap-1">
			<dt class="text-ink-muted">{m.invoices_allocability()}</dt>
			<dd data-testid="invoice-utility-cost">
				<Badge
					tone={invoice.isValidUtilityCost ? 'positive' : 'caution'}
					label={invoice.isValidUtilityCost
						? m.glossary_allocable_term()
						: m.invoices_not_allocable()}
				/>
			</dd>
		</div>
	</dl>
	<!-- Why the category is umlagefähig or not, in place of the general note (#292) -->
	<CategoryReason category={reasonCategory(invoice)} />

	{#if invoice.llmConfidence}
		<section class="flex flex-col gap-2 rounded-panel bg-sunken p-4">
			<h3 class="font-semibold text-ink">{m.invoices_ki_suggestion()}</h3>
			<KiAssessment confidence={invoice.llmConfidence} />
		</section>
	{/if}

	{#if invoice.manualOverrideReason}
		<section class="flex flex-col gap-2 rounded-panel bg-sunken p-4">
			<h3 class="font-semibold text-ink">{m.invoices_override_reason()}</h3>
			<p class="text-ink" data-testid="invoice-override-reason">{invoice.manualOverrideReason}</p>
		</section>
	{/if}

	<div class="flex flex-col items-start gap-4" bind:this={feedback}>
		<Button
			icon="ai-suggestion"
			onclick={onrecategorize}
			{busy}
			busyLabel={m.invoices_categorising()}
			testid="invoice-recategorize-button">{m.invoices_recategorise()}</Button
		>
		{#if error}
			<Alert tone="critical" title={m.invoices_categorisation_failed()}>
				<p data-testid="invoice-recategorize-error">{error}</p>
			</Alert>
		{/if}
	</div>
</Panel>
