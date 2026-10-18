<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { tick } from 'svelte';
	import { addToast } from '$lib/stores';
	import type { StatementDocument } from '$lib/types';
	import { getLocale } from '$lib/paraglide/runtime';
	import { formatDate } from '$lib/utils/format';
	import ActionDialog from '$lib/ui/ActionDialog.svelte';
	import Alert from '$lib/ui/Alert.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import TenantDocumentRow from './TenantDocumentRow.svelte';
	import TenantDocumentUpload from './TenantDocumentUpload.svelte';

	// Letters and e-mails to the tenant (e.g. Mahnungen), each with its Versandstatus and PDF, and the files the
	// property manager uploaded, which can be deleted
	// former: a former tenant's uploads from before the last Vertragsende, to look at and delete (#178)
	let {
		documents,
		former = null,
		name = '',
		form,
		demo = false
	}: {
		documents: StatementDocument[];
		former?: { endDate: string; documents: Pick<StatementDocument, 'title'>[] } | null;
		name?: string;
		form?: { title?: string; uploadError?: string; titleError?: string; deleteError?: string } | null;
		demo?: boolean;
	} = $props();

	let deleting = $state<Pick<StatementDocument, 'id' | 'title'>>({ id: '', title: '' });
	let deleteOpen = $state(false);
	let list = $state<HTMLElement>();
</script>

<Panel title={m.nav_documents()}>
	<div class="flex flex-col gap-6">
		{#if former}
			<Alert tone="caution" title={m.tenants_former_documents_title()} testid="tenant-former-documents">
				<!-- TODO(fachlich prüfen, #334): «Mietzinsdepot» has its glossary row; the help texts follow -->
				<p>
					{m.tenants_former_documents_text({
						name,
						date: formatDate(former.endDate),
						titles: new Intl.ListFormat(getLocale(), { type: 'conjunction' }).format(
							former.documents.map((document) => document.title)
						)
					})}
				</p>
			</Alert>
		{/if}
		<ul
			bind:this={list}
			tabindex="-1"
			aria-label={m.nav_documents()}
			class="flex flex-col divide-y divide-line"
			data-testid="tenant-documents"
		>
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
	onsuccess={async () => {
		addToast('success', m.tenants_document_deleted_toast({ title: deleting.title }));
		// the deleted row held the focus: it goes to the list the row was in
		await tick();
		list?.focus();
	}}
>
	<p data-testid="document-delete-message">
		{m.tenants_document_delete_text({ title: deleting.title })}
	</p>
</ActionDialog>
