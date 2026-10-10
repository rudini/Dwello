<script lang="ts">
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
		>PDF herunterladen</Button
	>
{:else}
	<Button
		onclick={ongenerate}
		busy={generating}
		busyLabel="PDF wird erstellt …"
		icon="document"
		testid="statement-generate-pdf-button">PDF erstellen</Button
	>
{/if}
