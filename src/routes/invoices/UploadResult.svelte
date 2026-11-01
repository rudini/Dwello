<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';

	// The invoices «Rechnungen hochladen» created, each a link to its page, and the files still to do (persona Anna)
	let {
		created,
		open = []
	}: { created: { id: string; name: string; rest?: boolean }[]; open?: { key: number; name: string; reason: string }[] } =
		$props();
	const title = $derived(
		created.length === 1 ? m.invoices_upload_created_one() : m.invoices_upload_created({ count: created.length })
	);
</script>

<div tabindex="-1" data-testid="invoice-upload-result">
	<Alert tone="positive" {title}>
		<ul class="flex flex-col gap-2">
			{#each created as one (one.id)}
				<li class="flex flex-col gap-1">
					<a class="font-semibold underline" href="/invoices/{one.id}" data-testid="invoice-upload-created-link">{one.name}</a>
					<!-- #535: the row that said so is gone; its remainder is a second invoice (Fachreview 535-1 V-1) -->
					{#if one.rest}
						<span>{m.invoices_upload_mixed_rest()}</span>
						<a class="underline" href="/invoices/new" data-testid="invoice-upload-record-rest">{m.dashboard_add_invoice()}</a>
					{/if}
				</li>
			{/each}
		</ul>
		{#if open.length}
			<p class="font-semibold">{m.invoices_upload_still_open_title()}</p>
			<ul class="flex flex-col gap-2">
				<!-- by row: two files may have one name (code review 245 C-2) -->
				{#each open as one (one.key)}<li>{m.invoices_upload_still_open_item(one)}</li>{/each}
			</ul>
		{/if}
	</Alert>
</div>
