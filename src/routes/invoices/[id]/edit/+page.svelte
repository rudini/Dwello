<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { goto } from '$app/navigation';
	import { untrack } from 'svelte';
	import { api } from '$lib/api';
	import { backendMessage } from '$lib/backend-error';
	import type { DistributionKeyRow } from '$lib/distribution-key';
	import { plainAmount, servicePeriodOf, validateInvoice } from '$lib/invoice';
	import { addToast } from '$lib/stores';
	import type { Category, InvoiceWithDetails } from '$lib/types';
	import Alert from '$lib/ui/Alert.svelte';
	import BilledWarning from '../../BilledWarning.svelte';
	import MissedWarning from '../../MissedWarning.svelte';
	import { focusFirstError } from '$lib/ui/focus-error';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import Textarea from '$lib/ui/Textarea.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';
	import InvoiceCategoryFields from '../../InvoiceCategoryFields.svelte';
	import InvoiceDataFields from '../../InvoiceDataFields.svelte';
	import InvoiceFormActions from '../../InvoiceFormActions.svelte';
	import OriginalSuggestion from './OriginalSuggestion.svelte';

	let {
		data
	}: {
		data: {
			invoice: InvoiceWithDetails;
			buildings: { id: string; name: string; address: string }[];
			categories: Category[];
			distributionKeys: DistributionKeyRow[];
			billedIn?: { start: string; end: string }[]; // periods with statements that took this invoice
			missedIn?: { start: string; end: string }[]; // periods with statements made before it was recorded
		};
	} = $props();

	// Akontorechnungen deducted on the Beleg, said at the Betrag (#455)
	const deducted = $derived(data.invoice.beleg?.deductedAmount);

	// The values as loaded, to see what the user changed; the form then holds its own copy
	const initial = untrack(() => ({
		buildingId: data.invoice.buildingId,
		invoiceDate: data.invoice.invoiceDate,
		servicePeriodStart: data.invoice.servicePeriodStart ?? '',
		servicePeriodEnd: data.invoice.servicePeriodEnd ?? '',
		billingEntity: data.invoice.billingEntity,
		invoiceNumber: data.invoice.invoiceNumber ?? '',
		description: data.invoice.description,
		amount: data.invoice.amount.toFixed(2),
		categoryId: data.invoice.categoryId || '',
		distributionKeyId: data.invoice.distributionKeyId || '',
		isValidUtilityCost: data.invoice.isValidUtilityCost
	}));
	const invoice = $derived(data.invoice);
	let values = $state({ ...initial });
	let overrideReason = $state('');
	let errors = $state<Record<string, string>>({});
	let saving = $state(false);
	let saveError = $state('');

	// Overriding the KI's category needs a reason
	const needsReason = $derived(values.categoryId !== initial.categoryId && !!invoice.llmConfidence);
	const changed = $derived(
		(Object.keys(initial) as (keyof typeof initial)[]).some((key) => values[key] !== initial[key])
	);

	// the invoice as the backend takes it
	const body = $derived({
		buildingId: values.buildingId,
		invoiceDate: values.invoiceDate,
		...servicePeriodOf(values),
		billingEntityName: values.billingEntity.trim(),
		invoiceNumber: values.invoiceNumber.trim() || null,
		description: values.description,
		amount: plainAmount(values.amount),
		categoryId: values.categoryId || null,
		distributionKeyId: values.distributionKeyId || null,
		isValidUtilityCost: values.isValidUtilityCost,
		...(overrideReason.trim() && { manualOverrideReason: overrideReason.trim() })
	});

	async function save(event: Event) {
		event.preventDefault();
		errors = validateInvoice(values);
		if (needsReason && !overrideReason.trim()) errors.overrideReason = m.invoices_error_reason();
		if (Object.keys(errors).length) return focusFirstError(event.target as Element);

		saving = true;
		saveError = '';
		const result = await api.put(`/invoices/${invoice.id}`, body);
		saving = false;
		if (result.error) {
			// the message of a code the UI knows, never the server's own text
			const reason = backendMessage({ code: result.error.code, params: result.error.params }, '');
			saveError = reason ? m.invoices_save_error({ error: reason }) : m.invoices_save_failed();
			focusFirstError(event.target as Element);
			return;
		}
		addToast('success', m.invoices_saved({ name: values.billingEntity.trim() }));
		goto(`/invoices/${invoice.id}`);
	}
</script>

<svelte:head>
	<title>{m.invoices_edit_title()} - Dwello</title>
</svelte:head>

<form onsubmit={save} class="mx-auto flex max-w-3xl flex-col gap-8" novalidate>
	<PageHeader
		title={m.invoices_edit_title()}
		purpose={m.invoices_edit_purpose({ name: invoice.billingEntity })}
		trail={[
			{ href: '/invoices', label: m.nav_invoices() },
			{ href: `/invoices/${invoice.id}`, label: invoice.billingEntity }
		]}
	/>

	{#if data.missedIn?.length}<MissedWarning periods={data.missedIn} invoice={data.invoice} />{/if}

	{#if data.billedIn?.length}
		<BilledWarning periods={data.billedIn}>
			<p>{m.invoices_edit_billed_text()}</p>
		</BilledWarning>
	{/if}

	<Panel title={m.invoices_data()}>
		<!-- a number the KI read wrongly is corrected here (persona Helga) -->
		<TextInput
			id="invoiceNumber"
			label={m.invoices_invoice_number()}
			optional
			bind:value={values.invoiceNumber}
			testid="invoice-number-input"
		/>
		<InvoiceDataFields
			bind:buildingId={values.buildingId}
			bind:invoiceDate={values.invoiceDate}
			bind:servicePeriodStart={values.servicePeriodStart}
			bind:servicePeriodEnd={values.servicePeriodEnd}
			bind:amount={values.amount}
			{deducted}
			bind:billingEntity={values.billingEntity}
			bind:description={values.description}
			buildings={data.buildings}
			{errors}
		/>
	</Panel>

	{#if invoice.llmConfidence}
		<OriginalSuggestion {invoice} />
	{/if}

	<Panel title={m.invoices_category_and_split()}>
		<InvoiceCategoryFields
			bind:categoryId={values.categoryId}
			bind:distributionKeyId={values.distributionKeyId}
			bind:isValidUtilityCost={values.isValidUtilityCost}
			categories={data.categories}
			distributionKeys={data.distributionKeys}
		>
			{#snippet after()}
				{#if needsReason}
					<Textarea
						id="overrideReason"
						label={m.invoices_override_reason()}
						help={m.invoices_override_reason_help()}
						rows={2}
						bind:value={overrideReason}
						error={errors.overrideReason}
						testid="invoice-override-reason-input"
					/>
				{/if}
			{/snippet}
		</InvoiceCategoryFields>
	</Panel>

	{#if saveError}
		<Alert tone="critical" title={m.buildings_not_saved()}>
			<p>{saveError}</p>
		</Alert>
	{/if}

	<div class="flex flex-col gap-4">
		<p class="text-ink-muted" role="status">{changed ? m.invoices_unsaved() : ''}</p>
		<InvoiceFormActions
			cancelHref="/invoices/{invoice.id}"
			label={m.buildings_save_changes()}
			busyLabel={m.ui_saving()}
			busy={saving}
			disabled={!changed}
		/>
	</div>
</form>
