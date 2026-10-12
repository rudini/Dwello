<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Button from '$lib/ui/Button.svelte';

	// The statement's PDF: made once, then downloaded
	let {
		id,
		generated,
		generating,
		ongenerate
	}: { id: string; generated: boolean; generating: boolean; ongenerate: () => void } = $props();
</script>

{#if generated}
	<Button href="/statements/{id}/pdf" icon="document-download" testid="statement-pdf-download"
		>{m.documents_download()}</Button
	>
{:else}
	<Button
		onclick={ongenerate}
		busy={generating}
		busyLabel={m.statements_pdf_creating()}
		icon="document"
		testid="statement-generate-pdf-button">{m.statements_create_pdf()}</Button
	>
{/if}
