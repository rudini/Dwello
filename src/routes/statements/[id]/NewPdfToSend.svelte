<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { enhance } from '$app/forms';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';

	// #968: the new PDF after a change of a sent statement waits under «Dokumente»; marked sent here or there, it keeps
	// the statement's date and Zahlungsfrist
	let { documentId }: { documentId: string } = $props();
	let saving = $state(false);
</script>

<Alert tone="info" title={m.statements_new_pdf_to_send()} testid="statement-new-pdf-to-send">
	<form
		method="POST"
		action="?/newPdfSent"
		use:enhance={() => {
			saving = true;
			return async ({ update }) => {
				await update();
				saving = false;
			};
		}}
	>
		<input type="hidden" name="documentId" value={documentId} />
		<Button
			type="submit"
			icon="send"
			busy={saving}
			busyLabel={m.ui_saving()}
			testid="statement-new-pdf-sent-button">{m.statements_new_pdf_mark_sent()}</Button
		>
	</form>
</Alert>
