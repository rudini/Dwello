<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { api } from '$lib/api';
	import type { InvoiceWithDetails } from '$lib/types';
	import Alert from '$lib/ui/Alert.svelte';
	import Badge from '$lib/ui/Badge.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Dialog from '$lib/ui/Dialog.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import { formatCurrency } from '$lib/utils/format';
	import CategorizationPanel from './CategorizationPanel.svelte';
	import InvoiceFacts from './InvoiceFacts.svelte';

	let { data }: { data: { invoice: InvoiceWithDetails } } = $props();

	const invoice = $derived(data.invoice);
	let showDelete = $state(false);
	let deleting = $state(false);
	let deleteError = $state('');
	let recategorizing = $state(false);
	let recategorizeError = $state('');

	const statusBadge = {
		'auto-categorized': { tone: 'info', label: 'Automatisch kategorisiert' },
		manual: { tone: 'neutral', label: 'Manuell kategorisiert' },
		pending: { tone: 'caution', label: 'Kategorisierung ausstehend' }
	} as const;
	const status = $derived(statusBadge[invoice.categorizationStatus]);

	async function remove() {
		deleting = true;
		deleteError = '';
		const result = await api.delete(`/invoices/${invoice.id}`);
		deleting = false;
		if (result.error) {
			deleteError = result.error.message;
			return;
		}
		goto('/invoices');
	}

	async function recategorize() {
		recategorizing = true;
		recategorizeError = '';
		const result = await api.post(`/invoices/${invoice.id}/recategorize`);
		if (result.error) recategorizeError = result.error.message;
		else await invalidateAll();
		recategorizing = false;
	}
</script>

<svelte:head>
	<title>{invoice.billingEntity} - Rechnung - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8">
	<PageHeader
		title={invoice.billingEntity}
		purpose={invoice.description}
		trail={[{ href: '/invoices', label: 'Rechnungen' }]}
	>
		{#snippet action()}
			<Button
				href="/invoices/{invoice.id}/edit"
				variant="primary"
				icon="edit"
				testid="invoice-edit-button">Rechnung bearbeiten</Button
			>
		{/snippet}
	</PageHeader>

	<p><Badge tone={status.tone} label={status.label} /></p>

	{#if recategorizeError}
		<Alert tone="critical" title="Kategorisierung fehlgeschlagen">
			<p data-testid="invoice-recategorize-error">{recategorizeError}</p>
		</Alert>
	{/if}

	<div class="grid gap-8 lg:grid-cols-3">
		<div class="flex flex-col gap-8 lg:col-span-2">
			<InvoiceFacts {invoice} />
			<CategorizationPanel {invoice} busy={recategorizing} onrecategorize={recategorize} />
		</div>
		<div class="flex flex-col gap-8">
			{#if !invoice.isValidUtilityCost}
				<div data-testid="invoice-legal-note">
					<Alert tone="caution" title="Schweizer Mietrecht">
						<p>
							Diese Kosten sind gemäss Art. 257a–257b OR nicht auf Mieter umlegbar. Typische nicht
							umlagefähige Kosten: Reparaturen, Versicherungen, Steuern, Hypothekarzinsen.
						</p>
					</Alert>
				</div>
			{/if}
			<Panel title="Weitere Aktionen">
				<Button
					variant="danger-ghost"
					icon="delete"
					onclick={() => (showDelete = true)}
					testid="invoice-delete-button">Rechnung löschen</Button
				>
			</Panel>
		</div>
	</div>
</div>

<Dialog
	bind:open={showDelete}
	title="Rechnung löschen"
	confirmLabel="Rechnung löschen"
	danger
	busy={deleting}
	busyLabel="Wird gelöscht …"
	confirmTestid="invoice-delete-confirm"
	onconfirm={remove}
>
	<p>
		Die Rechnung von {invoice.billingEntity} über {formatCurrency(invoice.amount)} wird gelöscht. Sie
		fliesst dann in keine neue Nebenkostenabrechnung mehr ein. Das lässt sich nicht rückgängig machen.
	</p>
	{#if deleteError}
		<Alert tone="critical" title="Nicht gelöscht"><p>{deleteError}</p></Alert>
	{/if}
</Dialog>
