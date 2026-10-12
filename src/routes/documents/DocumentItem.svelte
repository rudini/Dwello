<script lang="ts">
	import type { Snippet } from 'svelte';
	import { deliveryErrorText } from '$lib/backend-error';
	import type { StatementDocument } from '$lib/types';
	import Badge from '$lib/ui/Badge.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { formatDate } from '$lib/utils/format';

	// One stored letter: what, to whom, when, how it travels and whether it still has to be sent
	let {
		document,
		showTenant = false,
		children
	}: { document: StatementDocument; showTenant?: boolean; children?: Snippet } = $props();

	const heading = $derived(
		document.statementNumber ? `${document.title} · ${document.statementNumber}` : document.title
	);
	const recipient = $derived(showTenant ? `An ${document.tenantName}, ` : '');
	const channel = $derived(document.channel === 'email' ? 'per E-Mail' : 'per Brief');
	const toSend = $derived(document.status === 'to_send');
</script>

<li
	class="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between"
	data-testid="document-row"
>
	<div class="flex flex-col gap-1">
		<p class="font-semibold text-ink">{heading}</p>
		<p class="text-ink-muted">
			{recipient}erstellt am {formatDate(document.createdAt)}, {channel}
		</p>
		<p>
			<Badge
				tone={toSend ? 'caution' : 'positive'}
				label={toSend ? 'Zu versenden' : 'Versendet'}
				testid="document-status"
			/>
		</p>
		{#if document.deliveryError}<p class="text-caution">{deliveryErrorText(document)}</p>{/if}
	</div>
	<div class="flex flex-wrap gap-4">
		{@render children?.()}
		<Button
			href="/documents/{document.id}/pdf"
			icon="document-download"
			ariaLabel="PDF herunterladen: {heading}"
			testid="document-pdf-link">PDF herunterladen</Button
		>
	</div>
</li>
