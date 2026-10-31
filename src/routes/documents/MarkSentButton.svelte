<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { StatementDocument } from '$lib/types';
	import ActionDialog from '$lib/ui/ActionDialog.svelte';
	import Button from '$lib/ui/Button.svelte';

	// A printed letter was posted: record it, after a confirmation that names what follows (Persona Dr. Weber 534 P-2, P-4)
	// a refusal shows in the open confirmation, the page behind it is inert (Code-Review 534-2 C-15)
	let { document, error }: { document: StatementDocument; error?: string } = $props();
	let confirming = $state(false);
</script>

{#if document.status === 'to_send' && !document.notToSend}
	<Button
		icon="send"
		onclick={() => (confirming = true)}
		ariaLabel={m.documents_mark_sent_aria({ title: document.title, name: document.tenantName })}
		testid="document-mark-sent">{m.documents_mark_sent()}</Button
	>
	<ActionDialog
		bind:open={confirming}
		action="?/markSent"
		title={m.documents_mark_sent_title({ title: document.title, name: document.tenantName })}
		confirmLabel={m.documents_mark_sent()}
		confirmTestid="document-mark-sent-confirm"
		fields={{ id: document.id }}
		{error}
	>
		<p>{m.documents_mark_sent_text()}</p>
	</ActionDialog>
{/if}
