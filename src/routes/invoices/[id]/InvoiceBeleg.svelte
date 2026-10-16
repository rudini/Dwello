<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { invalidateAll } from '$app/navigation';
	import { api } from '$lib/api';
	import { backendMessage } from '$lib/backend-error';
	import { addToast } from '$lib/stores';
	import { fileRefusal } from '$lib/invoice-upload';
	import { tick } from 'svelte';
	import type { InvoiceWithDetails } from '$lib/types';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Field from '$lib/ui/Field.svelte';
	import { controlClass } from '$lib/ui/field';
	import Panel from '$lib/ui/Panel.svelte';
	import { formatCurrency } from '$lib/utils/format';

	// The Beleg of an invoice: to show to a tenant who asks, to add or to replace (#217)
	let { invoice, billed }: { invoice: InvoiceWithDetails; billed: boolean } = $props();

	let input = $state<HTMLInputElement>();
	let saving = $state(false);
	let error = $state<string>();
	// which file and which button: choosing a file alone changes nothing (persona Helga)
	const help = $derived(
		[m.invoices_beleg_file_help(), invoice.beleg ? m.invoices_beleg_how_replace() : m.invoices_beleg_how_add()].join(' ')
	);
	// what the KI saw on the file when it was uploaded (persona Anna); costs that are not allocable only on an invoice
	// that is: one that is not keeps them out already (domain review V-4)
	const hints = $derived(
		[
			invoice.beleg?.deductedAmount &&
				m.invoices_beleg_deducted({ amount: formatCurrency(Number(invoice.beleg.deductedAmount)) }),
			invoice.beleg?.nonAllocableItems && invoice.isValidUtilityCost && m.invoices_beleg_mixed()
		].filter((hint) => !!hint) as string[]
	);

	// a refusal is read out at the file field, which then holds the focus
	async function refuse(reason: string) {
		error = reason;
		await tick();
		input?.focus();
	}

	async function upload() {
		const file = input?.files?.[0];
		error = undefined;
		if (!file) return refuse(m.invoices_beleg_file_missing());
		// a file Dwello does not take is refused before it is sent (over 11 MB the server would not even read it)
		const refusal = await fileRefusal(file);
		if (refusal) return refuse(refusal);
		saving = true;
		const form = new FormData();
		form.set('file', file);
		const answer = await api.put(`/invoices/${invoice.id}/document`, form);
		saving = false;
		if (answer.error)
			return refuse(
				answer.error.params
					? backendMessage({ code: answer.error.code, params: answer.error.params }, m.invoices_beleg_failed())
					: m.invoices_beleg_failed()
			);
		input!.value = '';
		addToast('success', m.invoices_beleg_saved({ name: file.name }));
		await invalidateAll();
	}
</script>

<Panel title={m.invoices_beleg_title()}>
	<div class="flex flex-col gap-4">
		{#if invoice.beleg}
			<p class="break-all text-ink">{invoice.beleg.fileName}</p>
			<div>
				<Button href="/invoices/{invoice.id}/document" target="_blank" icon="document" testid="invoice-document-link"
					>{m.invoices_beleg_show()}</Button
				>
			</div>
		{:else}
			<p class="text-ink-muted">{m.backend_beleg_not_found()}</p>
		{/if}
		{#if hints.length}
			<Alert tone="caution" title={m.invoices_beleg_hints_title()} testid="invoice-document-hints">
				{#each hints as hint (hint)}<p>{hint}</p>{/each}
			</Alert>
		{/if}
		{#if billed && invoice.beleg}
			<Alert tone="caution" title={m.invoices_billed_title()} testid="invoice-document-billed">
				<p>{m.invoices_beleg_billed()}</p>
			</Alert>
		{/if}
		<p class="text-ink-muted" data-testid="invoice-keep-original">{m.invoices_upload_keep_original()}</p>
		<Field
			id="invoice-document-file"
			label={m.invoices_beleg_file_label()}
			{help}
			helpTestid="invoice-document-file-help"
			{error}
		>
			{#snippet children(control)}
				<input
					bind:this={input}
					id={control.id}
					type="file"
					accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
					aria-describedby={control.describedBy}
					aria-invalid={control.invalid || undefined}
					class={controlClass(control.invalid)}
					data-testid="invoice-document-file-input"
				/>
			{/snippet}
		</Field>
		<div>
			<Button icon="document" busy={saving} onclick={upload} testid="invoice-document-upload-button"
				>{invoice.beleg ? m.invoices_beleg_replace() : m.invoices_beleg_add()}</Button
			>
		</div>
	</div>
</Panel>
