<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { fieldNote, type UploadRow } from '$lib/invoice-upload';
	import DateInput from '$lib/ui/DateInput.svelte';
	import type { Category } from '$lib/types';
	import TextInput from '$lib/ui/TextInput.svelte';
	import InvoiceCategoryFields from './InvoiceCategoryFields.svelte';
	import InvoiceDataFields from './InvoiceDataFields.svelte';

	// The invoice of one file to check: the first page beside its fields
	let {
		row = $bindable(),
		preview,
		errors,
		categories,
		distributionKeys
	}: {
		row: UploadRow;
		preview?: string;
		errors: Record<string, string>;
		categories: Category[];
		distributionKeys: { id: string; name: string }[];
	} = $props();

	const prefix = $derived(`upload-${row.key}-`);
</script>

<div class="grid gap-6 md:grid-cols-2">
	{#if preview}
		<img src={preview} alt={m.invoices_upload_preview({ name: row.file.name })} class="max-h-96 w-full rounded-control border border-line object-contain object-top" />
	{/if}
	<div class="flex flex-col gap-6">
		<TextInput
			id="{prefix}invoiceNumber"
			label={m.invoices_invoice_number()}
			optional
			bind:value={row.values.invoiceNumber}
			note={fieldNote(row, 'invoiceNumber')}
			testid="invoice-upload-invoice-number-input"
		/>
		<InvoiceDataFields
			idPrefix={prefix}
			chooseBuilding={false}
			buildingId=""
			buildings={[]}
			bind:invoiceDate={row.values.invoiceDate}
			bind:servicePeriodStart={row.values.servicePeriodStart}
			bind:servicePeriodEnd={row.values.servicePeriodEnd}
			bind:amount={row.values.amount}
			bind:billingEntity={row.values.billingEntity}
			bind:description={row.values.description}
			read={row}
			{errors}
		/>
		<DateInput
			id="{prefix}dueDate"
			label={m.invoices_due_date()}
			optional
			bind:value={row.values.dueDate}
			note={fieldNote(row, 'dueDate')}
			testid="invoice-upload-due-date-input"
		/>
		<InvoiceCategoryFields
			idPrefix={prefix}
			categoryRequired
			categoryError={errors.category}
			bind:categoryId={row.values.categoryId}
			bind:distributionKeyId={row.values.distributionKeyId}
			bind:isValidUtilityCost={row.values.isValidUtilityCost}
			{categories}
			{distributionKeys}
		/>
	</div>
</div>
