<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { UploadRow } from '$lib/invoice-upload';
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
		onretry,
		onremove
	}: {
		row: UploadRow;
		preview?: string; // an image of the first page
		errors: Record<string, string>;
		categories: Category[];
		distributionKeys: { id: string; name: string }[];
		onretry: () => void;
		onremove: () => void;
	} = $props();

	let open = $state(false);
	const statuses: Record<UploadRow['status'], { tone: Tone; label: string }> = {
		reading: { tone: 'info', label: m.invoices_upload_status_reading() },
		check: { tone: 'caution', label: m.invoices_upload_status_check() },
		failed: { tone: 'critical', label: m.invoices_upload_status_error() },
		refused: { tone: 'critical', label: m.invoices_upload_status_refused() }
	};
	const status = $derived(statuses[row.status]);
	const editable = $derived(row.status === 'check' || row.status === 'failed');
	const toggleLabel = $derived(open ? m.invoices_upload_details_hide() : m.invoices_upload_details_show());
	// a field the property manager is told to fill in opens the invoice
	$effect(() => {
		if (Object.keys(errors).length) open = true;
	});
</script>

<li class="flex flex-col gap-4 py-4" data-testid="invoice-upload-row">
	<div class="flex flex-wrap items-start justify-between gap-4">
		<p class="min-w-0 break-all font-semibold text-ink">{row.file.name}</p>
		<Badge tone={status.tone} label={status.label} />
	</div>

	<UploadRowNotes {row} {errors} title={status.label} />

	<div class="flex flex-wrap items-center gap-4">
		{#if editable}
			<Checkbox
				id="upload-{row.key}-select"
				label={m.invoices_upload_select()}
				bind:checked={row.selected}
				disabled={row.several}
				testid="invoice-upload-row-select"
			/>
			<Button variant="ghost" icon="edit" onclick={() => (open = !open)} testid="invoice-upload-row-toggle">{toggleLabel}</Button>
		{/if}
		{#if row.status === 'failed'}
			<Button icon="refresh" onclick={onretry} testid="invoice-upload-row-retry">{m.invoices_upload_retry()}</Button>
		{/if}
		<Button variant="danger-ghost" icon="delete" onclick={onremove} testid="invoice-upload-row-remove"
			>{m.invoices_upload_remove()}</Button
		>
	</div>

	{#if open && editable}
		<UploadRowFields bind:row {preview} {errors} {categories} {distributionKeys} />
	{/if}
</li>
