<script lang="ts">
	import type { StatementDocument } from '$lib/types';
	import Panel from '$lib/ui/Panel.svelte';
	import { formatDate } from '$lib/utils/format';

	// Letters and e-mails to the tenant (e.g. Mahnungen), each with its Versandstatus and PDF
	let { documents }: { documents: StatementDocument[] } = $props();

	const heading = (d: StatementDocument) =>
		[d.title, d.statementNumber].filter(Boolean).join(' · ');
	const details = (d: StatementDocument) =>
		`${formatDate(d.createdAt)} · ${d.channel === 'email' ? 'per E-Mail' : 'per Brief'}`;
</script>

<Panel title="Dokumente">
	<ul class="flex flex-col divide-y divide-line" data-testid="tenant-documents">
		{#each documents as document (document.id)}
			<li class="flex flex-wrap items-center justify-between gap-4 py-4" data-testid="document-row">
				<div class="flex flex-col gap-1">
					<p class="font-semibold text-ink">{heading(document)}</p>
					<p class="text-ink-muted">
						{details(document)} ·
						<span data-testid="document-status"
							>{document.status === 'to_send' ? 'Zu versenden' : 'Versendet'}</span
						>
					</p>
					{#if document.deliveryError}<p class="text-caution">{document.deliveryError}</p>{/if}
				</div>
				<a
					href="/documents/{document.id}/pdf"
					class="text-accent underline underline-offset-4 hover:text-accent-strong"
					data-testid="document-pdf-link">PDF<span class="sr-only"> {heading(document)}</span></a
				>
			</li>
		{:else}
			<li class="text-ink-muted">Noch keine Dokumente.</li>
		{/each}
	</ul>
</Panel>
