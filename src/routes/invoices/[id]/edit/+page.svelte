<script lang="ts">
	import { goto } from '$app/navigation';
	import { untrack } from 'svelte';
	import { api } from '$lib/api';
	import type { DistributionKeyRow } from '$lib/distribution-key';
	import { plainAmount, servicePeriodOf, validateInvoice } from '$lib/invoice';
	import { addToast } from '$lib/stores';
	import type { Category, InvoiceWithDetails } from '$lib/types';
	import Alert from '$lib/ui/Alert.svelte';
	import { formatDate } from '$lib/utils/format';
	import { focusFirstError } from '$lib/ui/focus-error';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import Textarea from '$lib/ui/Textarea.svelte';
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
		};
	} = $props();

	// The values as loaded, to see what the user changed; the form then holds its own copy
	const initial = untrack(() => ({
		buildingId: data.invoice.buildingId,
		invoiceDate: data.invoice.invoiceDate,
		servicePeriodStart: data.invoice.servicePeriodStart ?? '',
		servicePeriodEnd: data.invoice.servicePeriodEnd ?? '',
		billingEntity: data.invoice.billingEntity,
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

	async function save(event: Event) {
		event.preventDefault();
		errors = validateInvoice(values);
		if (needsReason && !overrideReason.trim())
			errors.overrideReason = 'Bitte geben Sie einen Grund für die Änderung an';
		if (Object.keys(errors).length) return focusFirstError(event.target as Element);

		saving = true;
		saveError = '';
		const result = await api.put(`/invoices/${invoice.id}`, {
			buildingId: values.buildingId,
			invoiceDate: values.invoiceDate,
			...servicePeriodOf(values),
			billingEntityName: values.billingEntity.trim(),
			description: values.description,
			amount: plainAmount(values.amount),
			categoryId: values.categoryId || null,
			distributionKeyId: values.distributionKeyId || null,
			isValidUtilityCost: values.isValidUtilityCost,
			...(overrideReason.trim() && { manualOverrideReason: overrideReason.trim() })
		});
		saving = false;
		if (result.error) {
			saveError = result.error.message;
			focusFirstError(event.target as Element);
			return;
		}
		addToast('success', `Rechnung von ${values.billingEntity.trim()} gespeichert`);
		goto(`/invoices/${invoice.id}`);
	}
</script>

<svelte:head>
	<title>Rechnung bearbeiten - Dwello</title>
</svelte:head>

<form onsubmit={save} class="mx-auto flex max-w-3xl flex-col gap-8" novalidate>
	<PageHeader
		title="Rechnung bearbeiten"
		purpose="Korrigieren Sie die Rechnung von {invoice.billingEntity}. Bestehende Abrechnungen ändern sich dadurch nicht."
		trail={[
			{ href: '/invoices', label: 'Rechnungen' },
			{ href: `/invoices/${invoice.id}`, label: invoice.billingEntity }
		]}
	/>

	{#if data.billedIn?.length}
		<Alert tone="caution" title="Rechnung schon abgerechnet" testid="invoice-billed-warning">
			{#each data.billedIn as period (period.start)}
				<p>
					Für die Abrechnungsperiode {formatDate(period.start)} – {formatDate(period.end)} gibt es schon
					Abrechnungen mit dieser Rechnung.
				</p>
			{/each}
			<p>
				Ändern Sie Datum, Leistungszeitraum oder Betrag, stimmen diese Abrechnungen nicht mehr. Die
				Kosten können dann doppelt oder gar nicht abgerechnet werden. Entwürfe können Sie neu
				erstellen.
			</p>
		</Alert>
	{/if}

	<Panel title="Rechnungsdaten">
		<InvoiceDataFields
			bind:buildingId={values.buildingId}
			bind:invoiceDate={values.invoiceDate}
			bind:servicePeriodStart={values.servicePeriodStart}
			bind:servicePeriodEnd={values.servicePeriodEnd}
			bind:amount={values.amount}
			bind:billingEntity={values.billingEntity}
			bind:description={values.description}
			buildings={data.buildings}
			{errors}
		/>
	</Panel>

	{#if invoice.llmConfidence}
		<OriginalSuggestion {invoice} />
	{/if}

	<Panel title="Kategorie und Verteilung">
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
						label="Grund der Änderung"
						help="Warum passt die Kategorie der KI nicht? Der Grund wird mit der Rechnung gespeichert."
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
		<Alert tone="critical" title="Nicht gespeichert">
			<p>Fehler beim Speichern: {saveError}</p>
		</Alert>
	{/if}

	<div class="flex flex-col gap-4">
		<p class="text-ink-muted" role="status">{changed ? 'Ungespeicherte Änderungen' : ''}</p>
		<InvoiceFormActions
			cancelHref="/invoices/{invoice.id}"
			label="Änderungen speichern"
			busyLabel="Wird gespeichert …"
			busy={saving}
			disabled={!changed}
		/>
	</div>
</form>
