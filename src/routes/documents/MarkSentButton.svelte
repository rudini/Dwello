<script lang="ts">
	import { m } from '$lib/paraglide/messages';
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
			busyLabel={m.ui_saving()}
			ariaLabel={m.documents_mark_sent_aria({ title: document.title, name: document.tenantName })}
			testid="document-mark-sent">{m.documents_mark_sent()}</Button
		>
	</form>
{/if}
