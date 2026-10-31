<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import FormDialog from './FormDialog.svelte';

	// #968: the new PDF after a change of a sent statement waits under «Dokumente»; marked sent here or there, after a
	// confirmation (Persona Dr. Weber 534 P-2), it keeps the statement's date and Zahlungsfrist
	// it closes after any answer: a refusal shows on the page (Code-Review 534-2 C-15)
	let { documentId, refund = false }: { documentId: string; refund?: boolean } = $props();
	let confirming = $state(false);
</script>

<Alert tone="info" title={m.statements_new_pdf_to_send()} testid="statement-new-pdf-to-send">
	<div>
		<Button icon="send" onclick={() => (confirming = true)} testid="statement-new-pdf-sent-button"
			>{m.statements_new_pdf_mark_sent()}</Button
		>
	</div>
</Alert>
<FormDialog
	bind:open={confirming}
	action="?/newPdfSent"
	title={m.statements_new_pdf_mark_sent()}
	confirmLabel={m.statements_new_pdf_mark_sent()}
	confirmTestid="statement-new-pdf-sent-confirm"
	success={m.statements_new_pdf_marked_sent()}
	fields={{ documentId }}
>
	<p>
		{refund ? m.statements_new_pdf_mark_sent_text_refund() : m.statements_new_pdf_mark_sent_text()}
	</p>
</FormDialog>
