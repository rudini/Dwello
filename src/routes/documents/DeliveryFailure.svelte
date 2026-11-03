<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { deliveryErrorText } from '$lib/backend-error';
	import type { StatementDocument } from '$lib/types';

	// An e-mail that did not go out (#736): the address it went to, the way to the tenant whose address it is, and to
	// «Dokumente», where the letter waits to be marked sent; each way only where the page is not already there
	let {
		document,
		tenantLink = true,
		documentsLink = true
	}: { document: StatementDocument; tenantLink?: boolean; documentsLink?: boolean } = $props();

	// only a refused address is the tenant's to check; a mail setup that is missing is not
	const addressRefused = $derived(document.deliveryErrorCode !== 'MAIL_NOT_CONFIGURED');
	const link = 'inline-flex min-h-12 items-center font-semibold text-ink underline';
</script>

<div class="flex flex-col gap-1">
	<p class="text-caution">{deliveryErrorText(document)}</p>
	{#if document.recipient}
		<!-- an address has no place to break: without one it widens the page (Firefox, #1087) -->
		<p class="text-ink-muted wrap-anywhere">
			{m.documents_delivery_recipient({ address: document.recipient })}
		</p>
	{/if}
	{#if (tenantLink && addressRefused) || documentsLink}
		<p class="flex flex-wrap gap-x-4">
			{#if tenantLink && addressRefused}
				<a class={link} href="/tenants/{document.tenantId}" data-testid="delivery-tenant-link"
					>{m.documents_delivery_check_address({ name: document.tenantName })}</a
				>
			{/if}
			{#if documentsLink}
				<a class={link} href="/documents" data-testid="delivery-documents-link"
					>{m.documents_delivery_to_documents()}</a
				>
			{/if}
		</p>
	{/if}
</div>
