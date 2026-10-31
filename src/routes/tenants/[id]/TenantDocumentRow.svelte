<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { deliveryErrorText } from '$lib/backend-error';
	import { documentStatus } from '$lib/document-status';
	import type { StatementDocument } from '$lib/types';
	import Button from '$lib/ui/Button.svelte';
	import { formatDate } from '$lib/utils/format';

	// A letter with its date, way and Versandstatus, or an uploaded file with its date, which can be deleted
	let { document, ondelete }: { document: StatementDocument; ondelete: () => void } = $props();

	const upload = $derived(document.type === 'upload');
	const heading = (d: StatementDocument) =>
		[d.title, d.statementNumber].filter(Boolean).join(' · ');
	// a PDF kept before a change (#969) has no way and no Versandstatus: only when it was made (Fachreview 969-1 V-1)
	const details = (d: StatementDocument) =>
		d.type === 'upload'
			? m.documents_uploaded({ date: formatDate(d.createdAt) })
			: !d.status
				? m.documents_pdf_before_change_made({ date: formatDate(d.createdAt) })
				: `${formatDate(d.createdAt)} · ${d.channel === 'email' ? m.tenants_document_by_email() : m.tenants_document_by_letter()}`;
</script>

<li class="flex flex-wrap items-center justify-between gap-4 py-4" data-testid="document-row">
	<div class="flex flex-col gap-1">
		<p class="font-semibold text-ink">{heading(document)}</p>
		<p class="text-ink-muted">
			{details(document)}
			{#if document.status}
				·
				<span data-testid="document-status">{documentStatus(document).label}</span>
			{/if}
		</p>
		{#if document.deliveryError}<p class="text-caution">
				{deliveryErrorText(document)}
			</p>{/if}
	</div>
	<div class="flex flex-wrap items-center gap-4">
		<Button
			href="/documents/{document.id}/pdf"
			download
			icon="document-download"
			ariaLabel={upload
				? m.documents_download_file_aria({ title: heading(document) })
				: m.documents_download_aria({ title: heading(document) })}
			testid="document-pdf-link">{upload ? m.documents_download_file() : m.documents_download()}</Button
		>
		{#if upload}
			<Button
				variant="danger-ghost"
				icon="delete"
				ariaLabel={m.tenants_document_delete_aria({ title: document.title })}
				onclick={ondelete}
				testid="document-delete-button">{m.tenants_document_delete()}</Button
			>
		{/if}
	</div>
</li>
