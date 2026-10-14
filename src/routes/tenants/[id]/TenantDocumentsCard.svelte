<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { untrack } from 'svelte';
	import { addToast } from '$lib/stores';
	import type { StatementDocument } from '$lib/types';
	import ActionDialog from '$lib/ui/ActionDialog.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import TenantDocumentRow from './TenantDocumentRow.svelte';
	import TenantDocumentUpload from './TenantDocumentUpload.svelte';

	// Letters and e-mails to the tenant (e.g. Mahnungen), each with its Versandstatus and PDF, and the files the
	// property manager uploaded, which can be deleted
	let {
		documents,
		form,
		demo = false
	}: {
		documents: StatementDocument[];
		form?: { title?: string; uploadError?: string; deleteError?: string } | null;
		demo?: boolean;
	} = $props();

	let deleting = $state<Pick<StatementDocument, 'id' | 'title'>>({ id: '', title: '' });
	let deleteOpen = $state(untrack(() => !!form?.deleteError));
</script>

<Panel title={m.nav_documents()}>
	<div class="flex flex-col gap-6">
		<ul class="flex flex-col divide-y divide-line" data-testid="tenant-documents">
			{#each documents as document (document.id)}
				<TenantDocumentRow
					{document}
					ondelete={() => {
						deleting = document;
						deleteOpen = true;
					}}
				/>
			{:else}
				<li class="text-ink-muted" data-testid="tenant-documents-empty">
					{m.tenants_no_documents()}
				</li>
			{/each}
		</ul>

		<TenantDocumentUpload {form} {demo} />
	</div>
</Panel>

<ActionDialog
	bind:open={deleteOpen}
	action="?/deleteDocument"
	title={m.tenants_document_delete_title()}
	confirmLabel={m.tenants_document_delete_confirm()}
	danger
	confirmTestid="document-delete-confirm"
	error={form?.deleteError}
	fields={{ id: deleting.id }}
	onsuccess={() => addToast('success', m.tenants_document_deleted_toast({ title: deleting.title }))}
>
	<p data-testid="document-delete-message">
		{m.tenants_document_delete_text({ title: deleting.title })}
	</p>
</ActionDialog>
