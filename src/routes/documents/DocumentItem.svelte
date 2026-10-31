<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { Snippet } from 'svelte';
	import { deliveryErrorText } from '$lib/backend-error';
	import { documentStatus } from '$lib/document-status';
	import type { StatementDocument } from '$lib/types';
	import Badge from '$lib/ui/Badge.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { formatDate } from '$lib/utils/format';

	// One stored letter: what, to whom, when, how it travels and whether it still has to be sent; or an uploaded file
	let {
		document,
		showTenant = false,
		children
	}: { document: StatementDocument; showTenant?: boolean; children?: Snippet } = $props();

	const heading = $derived(
		document.statementNumber ? `${document.title} · ${document.statementNumber}` : document.title
	);
	const channel = $derived(
		document.channel === 'email' ? m.tenants_document_by_email() : m.tenants_document_by_letter()
	);
	const date = $derived(formatDate(document.createdAt));
	const upload = $derived(document.type === 'upload'); // no channel, no Versandstatus
	const created = $derived(
		upload
			? showTenant
				? m.documents_uploaded_to({ name: document.tenantName, date })
				: m.documents_uploaded({ date })
			: showTenant
				? m.documents_created_to({ name: document.tenantName, date, channel })
				: m.documents_created({ date, channel })
	);
	const status = $derived(documentStatus(document));
</script>

<li
	class="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between"
	data-testid="document-row"
>
	<div class="flex flex-col gap-1">
		<p class="font-semibold text-ink">{heading}</p>
		<p class="text-ink-muted">{created}</p>
		<!-- only a sent reminder: one still to send gets its Zahlungsfrist the day it is marked sent, when Dwello remakes it
		(#545, persona weber-545 P-1); one that no longer goes out has none (Fachreview N-7) -->
		{#if document.paymentDeadline && document.status === 'sent'}
			<p class="text-ink-muted">
				{m.documents_payment_deadline({ date: formatDate(document.paymentDeadline) })}
			</p>
		{/if}
		{#if !upload}
			<p>
				<Badge tone={status.tone} label={status.label} testid="document-status" />
			</p>
		{/if}
		{#if document.deliveryError}<p class="text-caution">{deliveryErrorText(document)}</p>{/if}
	</div>
	<div class="flex flex-wrap gap-4">
		{@render children?.()}
		<Button
			href="/documents/{document.id}/pdf"
			download
			icon="document-download"
			ariaLabel={upload
				? m.documents_download_file_aria({ title: heading })
				: m.documents_download_aria({ title: heading })}
			testid="document-pdf-link">{upload ? m.documents_download_file() : m.documents_download()}</Button
		>
	</div>
</li>
