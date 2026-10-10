<script lang="ts">
	import { enhance } from '$app/forms';
	import type { StatementDocument } from '$lib/types';
	import Button from '$lib/ui/Button.svelte';

	// A printed letter was posted: record it
	let { document }: { document: StatementDocument } = $props();
	let saving = $state(false);
</script>

{#if document.status === 'to_send'}
	<form
		method="POST"
		action="?/markSent"
		use:enhance={() => {
			saving = true;
			return async ({ update }) => {
				await update();
				saving = false;
			};
		}}
	>
		<input type="hidden" name="id" value={document.id} />
		<Button
			type="submit"
			icon="send"
			busy={saving}
			busyLabel="Wird gespeichert …"
			ariaLabel="Als versendet markieren: {document.title} an {document.tenantName}"
			testid="document-mark-sent">Als versendet markieren</Button
		>
	</form>
{/if}
