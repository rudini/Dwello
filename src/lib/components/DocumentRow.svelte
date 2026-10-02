<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { StatementDocument } from '$lib/types';
	import { formatDate } from '$lib/utils/format';

	let {
		document,
		showTenant = false,
		children
	}: { document: StatementDocument; showTenant?: boolean; children?: Snippet } = $props();

	const heading = $derived([document.title, document.statementNumber].filter(Boolean).join(' · '));
	const details = $derived(
		[
			showTenant && document.tenantName,
			formatDate(document.createdAt),
			document.channel === 'email' ? 'per E-Mail' : 'per Brief'
		]
			.filter(Boolean)
			.join(' · ')
	);
	const delivery = $derived(document.status === 'to_send' ? 'Zu versenden' : 'Versendet');
</script>

<li class="py-3 flex items-center justify-between gap-4" data-testid="document-row">
	<div>
		<p class="font-medium text-gray-900">{heading}</p>
		<p class="text-sm text-gray-500">
			{details} · <span data-testid="document-status">{delivery}</span>
		</p>
		<p class="text-sm text-amber-700">{document.deliveryError ?? ''}</p>
	</div>
	<div class="flex items-center gap-3">
		{@render children?.()}
		<a
			href="/documents/{document.id}/pdf"
			class="text-sm text-primary hover:underline"
			data-testid="document-pdf-link">PDF</a
		>
	</div>
</li>
