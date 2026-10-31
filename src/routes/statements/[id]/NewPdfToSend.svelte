<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import ActionDialog from '$lib/ui/ActionDialog.svelte';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';

	// #968: the new PDF after a change of a sent statement waits under «Dokumente»; marked sent here or there, after a
	// confirmation (Persona Dr. Weber 534 P-2), it keeps the statement's date and Zahlungsfrist
	let { documentId }: { documentId: string } = $props();
	let confirming = $state(false);
</script>

<Alert tone="info" title={m.statements_new_pdf_to_send()} testid="statement-new-pdf-to-send">
	<div>
		<Button icon="send" onclick={() => (confirming = true)} testid="statement-new-pdf-sent-button"
			>{m.statements_new_pdf_mark_sent()}</Button
		>
	</div>
</Alert>
<ActionDialog
	bind:open={confirming}
	action="?/newPdfSent"
	title={m.statements_new_pdf_mark_sent()}
	confirmLabel={m.statements_new_pdf_mark_sent()}
	confirmTestid="statement-new-pdf-sent-confirm"
	fields={{ documentId }}
>
	<p>{m.statements_new_pdf_mark_sent_text()}</p>
</ActionDialog>
