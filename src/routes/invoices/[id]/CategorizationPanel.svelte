<script lang="ts">
	import type { InvoiceWithDetails } from '$lib/types';
	import Alert from '$lib/ui/Alert.svelte';
	import Badge from '$lib/ui/Badge.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { focusFirstError } from '$lib/ui/focus-error';
	import Panel from '$lib/ui/Panel.svelte';
	import KiAssessment from '../KiAssessment.svelte';

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

	// The KI may take half a minute: its failure shows at the button and takes the focus, so it is in view
	let feedback: HTMLElement | undefined = $state();
	$effect(() => {
		if (error) focusFirstError(feedback);
	});
</script>

<Panel title="Kategorisierung">
	<dl class="grid gap-4 sm:grid-cols-2">
		<div class="flex flex-col gap-1">
			<dt class="text-ink-muted">Kategorie</dt>
			{#if invoice.category}
				<dd class="font-semibold text-ink" data-testid="invoice-category">
					{invoice.category.name}
				</dd>
			{:else}
				<dd class="text-ink-muted">Nicht kategorisiert</dd>
			{/if}
		</div>
		<div class="flex flex-col gap-1">
			<dt class="text-ink-muted">Verteilschlüssel</dt>
			{#if invoice.distributionKey}
				<dd class="font-semibold text-ink" data-testid="invoice-distribution-key">
					{invoice.distributionKey.name}
				</dd>
			{:else}
				<!-- TODO(fachlich prüfen): the equal split without a key is what the statement calculation does;
				     the glossary states it only for the Verwaltungspauschale -->
				<dd class="text-ink-muted">Keiner – die Kosten werden gleichmässig pro Wohnung verteilt</dd>
			{/if}
		</div>
		<div class="flex flex-col gap-1">
			<dt class="text-ink-muted">Umlagefähigkeit</dt>
			<dd data-testid="invoice-utility-cost">
				<Badge
					tone={invoice.isValidUtilityCost ? 'positive' : 'caution'}
					label={invoice.isValidUtilityCost ? 'Umlagefähig' : 'Nicht umlagefähig'}
				/>
			</dd>
		</div>
	</dl>

	{#if invoice.llmConfidence}
		<section class="flex flex-col gap-2 rounded-panel bg-sunken p-4">
			<h3 class="font-semibold text-ink">Vorschlag der KI</h3>
			<KiAssessment confidence={invoice.llmConfidence} />
		</section>
	{/if}

	{#if invoice.manualOverrideReason}
		<section class="flex flex-col gap-2 rounded-panel bg-sunken p-4">
			<h3 class="font-semibold text-ink">Grund der Änderung</h3>
			<p class="text-ink" data-testid="invoice-override-reason">{invoice.manualOverrideReason}</p>
		</section>
	{/if}

	<div class="flex flex-col items-start gap-4" bind:this={feedback}>
		<Button
			icon="ai-suggestion"
			onclick={onrecategorize}
			{busy}
			busyLabel="Wird kategorisiert …"
			testid="invoice-recategorize-button">Neu kategorisieren</Button
		>
		{#if error}
			<Alert tone="critical" title="Kategorisierung fehlgeschlagen">
				<p data-testid="invoice-recategorize-error">{error}</p>
			</Alert>
		{/if}
	</div>
</Panel>
