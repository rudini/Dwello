<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import type { StatementDocument } from '$lib/types';

	let { document }: { document: StatementDocument } = $props();
</script>

{#if document.status === 'to_send'}
	<form method="POST" action="?/markSent" use:enhance>
		<input type="hidden" name="id" value={document.id} />
		<Button type="submit" variant="secondary" size="sm" testid="document-mark-sent">
			Als versendet markieren
		</Button>
	</form>
{/if}
