<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { goto, invalidateAll } from '$app/navigation';
	import { api } from '$lib/api';
	import { backendMessage } from '$lib/backend-error';
	import { addToast } from '$lib/stores';
	import type { InvoiceWithDetails } from '$lib/types';
	import Alert from '$lib/ui/Alert.svelte';
	import Badge from '$lib/ui/Badge.svelte';
	import Button from '$lib/ui/Button.svelte';
	import BilledWarning from '../BilledWarning.svelte';
	import MissedWarning from '../MissedWarning.svelte';
	import Dialog from '$lib/ui/Dialog.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import { formatCurrency } from '$lib/utils/format';
	import CategorizationPanel from './CategorizationPanel.svelte';
	import InvoiceFacts from './InvoiceFacts.svelte';
	import InvoiceBeleg from './InvoiceBeleg.svelte';

	let {
		data
	}: {
		data: {
			invoice: InvoiceWithDetails;
			billedIn?: { start: string; end: string }[];
			missedIn?: { start: string; end: string }[];
		};
	} = $props();

	const invoice = $derived(data.invoice);
	let showDelete = $state(false);
	let deleting = $state(false);
	let deleteError = $state('');
	let recategorizing = $state(false);
	let recategorizeError = $state('');

	const statusBadge = {
		'auto-categorized': { tone: 'info', label: m.invoices_status_auto_long() },
		manual: { tone: 'neutral', label: m.invoices_status_manual_long() },
		// The KI runs while the invoice is saved: without a category nothing is running any more
		pending: { tone: 'caution', label: m.invoices_status_pending_long() }
	} as const;
	const status = $derived(statusBadge[invoice.categorizationStatus]);

	async function remove() {
		deleting = true;
		deleteError = '';
		const result = await api.delete(`/invoices/${invoice.id}`);
		deleting = false;
		if (result.error) {
			deleteError = m.invoices_delete_failed();
			return;
		}
		addToast('success', m.invoices_deleted({ name: invoice.billingEntity }));
		goto('/invoices');
	}

	async function recategorize() {
		recategorizing = true;
		recategorizeError = '';
		const result = await api.post(`/invoices/${invoice.id}/recategorize`);
		// the message of a code the UI knows, never the server's own text
		if (result.error)
			recategorizeError = backendMessage(
				{ code: result.error.code, params: result.error.params },
				m.backend_unknown_error()
			);
		else await invalidateAll();
		recategorizing = false;
	}
</script>

<svelte:head>
	<title>{invoice.billingEntity} - {m.invoices_record()} - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8">
	<PageHeader
		title={invoice.billingEntity}
		purpose={invoice.description}
		trail={[{ href: '/invoices', label: m.nav_invoices() }]}
	>
		{#snippet action()}
			<Button
				href="/invoices/{invoice.id}/edit"
				variant="primary"
				icon="edit"
				testid="invoice-edit-button">{m.invoices_edit_title()}</Button
			>
		{/snippet}
	</PageHeader>

	<p><Badge tone={status.tone} label={status.label} /></p>

	{#if data.missedIn?.length}<MissedWarning periods={data.missedIn} />{/if}

	<div class="grid gap-8 lg:grid-cols-3">
		<div class="flex flex-col gap-8 lg:col-span-2">
			<InvoiceFacts {invoice} />
			<CategorizationPanel
				{invoice}
				busy={recategorizing}
				error={recategorizeError}
				onrecategorize={recategorize}
			/>
		</div>
		<div class="flex flex-col gap-8">
			{#if !invoice.isValidUtilityCost}
				<div data-testid="invoice-legal-note">
					<Alert tone="caution" title={m.invoices_legal_title()}>
						<p>{m.invoices_legal_text()}</p>
					</Alert>
				</div>
			{/if}
			<InvoiceBeleg {invoice} billed={!!data.billedIn?.length} />
			<Panel title={m.invoices_more_actions()}>
				<Button
					variant="danger-ghost"
					icon="delete"
					onclick={() => (showDelete = true)}
					testid="invoice-delete-button">{m.invoices_delete()}</Button
				>
			</Panel>
		</div>
	</div>
</div>

<Dialog
	bind:open={showDelete}
	title={m.invoices_delete()}
	confirmLabel={m.invoices_delete()}
	danger
	busy={deleting}
	busyLabel={m.buildings_deleting()}
	confirmTestid="invoice-delete-confirm"
	onconfirm={remove}
>
	<p>
		{m.invoices_delete_text({
			name: invoice.billingEntity,
			amount: formatCurrency(invoice.amount)
		})}
	</p>
	{#if invoice.beleg}
		<p data-testid="invoice-delete-document-note">{m.invoices_delete_beleg()}</p>
	{/if}
	{#if data.billedIn?.length}
		<BilledWarning periods={data.billedIn}>
			<p>{m.invoices_delete_billed_text()}</p>
		</BilledWarning>
	{/if}
	{#if deleteError}
		<Alert tone="critical" title={m.buildings_not_deleted()}><p>{deleteError}</p></Alert>
	{/if}
</Dialog>
