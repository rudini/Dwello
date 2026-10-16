<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';

	// The invoices «Rechnungen hochladen» created, each a link to its page, and the files still to do (persona Anna)
	let { created, open = [] }: { created: { id: string; name: string }[]; open?: string[] } = $props();
	const title = $derived(
		created.length === 1 ? m.invoices_upload_created_one() : m.invoices_upload_created({ count: created.length })
	);
</script>

<div tabindex="-1" data-testid="invoice-upload-result">
	<Alert tone="positive" {title}>
		<ul class="flex flex-col gap-2">
			{#each created as one (one.id)}
				<li><a class="font-semibold underline" href="/invoices/{one.id}">{one.name}</a></li>
			{/each}
		</ul>
		{#if open.length}<p>{m.invoices_upload_still_open({ names: open.join(', ') })}</p>{/if}
	</Alert>
</div>
