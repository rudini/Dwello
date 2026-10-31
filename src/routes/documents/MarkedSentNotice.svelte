<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';

	// A letter just marked as sent: remade with today's date (#193), so its new PDF is printed now; announced
	let { sent }: { sent?: { id: string; title: string; tenantName: string; newPdf?: boolean } } = $props();
</script>

<div role="status">
	{#if sent}
		<Alert
			tone="positive"
			title={m.documents_marked_sent({ title: sent.title, name: sent.tenantName })}
			testid="document-marked-sent"
		>
			<p>{sent.newPdf ? m.documents_print_now_new_pdf() : m.documents_print_now()}</p>
			{#snippet action()}
				<Button
					href="/documents/{sent.id}/pdf"
					icon="document-download"
					testid="document-marked-sent-pdf">{m.documents_download()}</Button
				>
			{/snippet}
		</Alert>
	{/if}
</div>
