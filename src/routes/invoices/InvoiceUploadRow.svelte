<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { selectionHelp, type UploadRow } from '$lib/invoice-upload';
	import type { KeyProposal } from '$lib/invoice';
	import type { Category } from '$lib/types';
	import Badge from '$lib/ui/Badge.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Checkbox from '$lib/ui/Checkbox.svelte';
	import type { Tone } from '$lib/ui/tone';
	import UploadRowFields from './UploadRowFields.svelte';
	import UploadRowNotes from './UploadRowNotes.svelte';

	// One file of «Rechnungen hochladen»: its status, what to know about it, and the invoice to check before creating
	let {
		row = $bindable(),
		preview,
		errors,
		categories,
		distributionKeys,
		keyProposal,
		tank,
		onretry,
		onremove
	}: {
		row: UploadRow;
		preview?: string; // an image of the first page
		errors: Record<string, string>;
		categories: Category[];
		distributionKeys: { id: string; name: string }[];
		keyProposal: KeyProposal;
		tank?: string;
		onretry: () => void;
		onremove: () => void;
	} = $props();

	let open = $state(false);
	// every control of the row names its file and its status to a screen reader
	const about = $derived(`upload-${row.key}`);
	const describedby = $derived(`${about}-name ${about}-status`);
	const statuses: Record<UploadRow['status'], { tone: Tone; label: string }> = {
		reading: { tone: 'info', label: m.invoices_upload_status_reading() },
		check: { tone: 'caution', label: m.invoices_upload_status_check() },
		failed: { tone: 'critical', label: m.invoices_upload_status_error() },
		refused: { tone: 'critical', label: m.invoices_upload_status_refused() }
	};
	const status = $derived(statuses[row.status]);
	const editable = $derived(row.status === 'check' || row.status === 'failed');
	// a file nobody read (also one whose reading failed) has empty fields to enter, not proposals to check (#760)
	const unread = $derived(row.byHand || row.status === 'failed');
	const openLabel = () => (unread ? m.invoices_upload_details_enter() : m.invoices_upload_details_show());
	const toggleLabel = $derived(open ? m.invoices_upload_details_hide() : openLabel());
	// a field the property manager is told to fill in opens the invoice
	$effect(() => {
		if (Object.keys(errors).length) open = true;
	});
</script>

<li class="flex flex-col gap-4 py-4" data-testid="invoice-upload-row">
	<div class="flex flex-wrap items-start justify-between gap-4">
		<p id="{about}-name" class="min-w-0 break-all font-semibold text-ink">{row.file.name}</p>
		<span id="{about}-status"><Badge tone={status.tone} label={status.label} /></span>
	</div>

	<UploadRowNotes {row} {errors} />

	<div class="flex flex-wrap items-center gap-4">
		{#if editable}
			<Checkbox
				id="upload-{row.key}-select"
				label={m.invoices_upload_select()}
				bind:checked={row.selected}
				help={selectionHelp(row)}
				disabled={row.several}
				{describedby}
				testid="invoice-upload-row-select"
			/>
			{#if !row.several}
				<Button
					variant="ghost"
					icon="edit"
					expanded={open}
					{describedby}
					onclick={() => (open = !open)}
					testid="invoice-upload-row-toggle">{toggleLabel}</Button
				>
			{/if}
		{/if}
		{#if row.status === 'failed'}
			<Button icon="refresh" {describedby} onclick={onretry} testid="invoice-upload-row-retry">{m.invoices_upload_retry()}</Button>
		{/if}
		<Button variant="danger-ghost" icon="delete" {describedby} onclick={onremove} testid="invoice-upload-row-remove"
			>{m.invoices_upload_remove()}</Button
		>
	</div>

	{#if open && editable && !row.several}
		<UploadRowFields bind:row {preview} {errors} {categories} {distributionKeys} {keyProposal} {tank} />
	{/if}
</li>
