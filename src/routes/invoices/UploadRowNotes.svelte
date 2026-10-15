<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { UploadRow } from '$lib/invoice-upload';
	import Alert from '$lib/ui/Alert.svelte';

	// What the property manager should know about a file, then what keeps its invoice from being created
	let { row, errors, title }: { row: UploadRow; errors: Record<string, string>; title: string } = $props();

	const messages = $derived(
		[
			...row.notes,
			row.status === 'failed' && m.invoices_upload_read_failed(),
			errors.category,
			Object.keys(errors).some((field) => field !== 'category') && m.invoices_upload_fields_missing(),
			row.createError
		].filter((text) => !!text) as string[]
	);
	const tone = $derived(row.status === 'check' && !row.createError ? 'caution' : 'critical');
</script>

{#if messages.length}
	<div data-testid="invoice-upload-row-message">
		<Alert {tone} {title}>
			{#each messages as message (message)}<p>{message}</p>{/each}
			{#if row.duplicateOf}
				<p>
					<a class="font-semibold text-accent-strong underline" href="/invoices/{row.duplicateOf}" target="_blank"
						>{m.invoices_upload_duplicate_link()}</a
					>
				</p>
			{/if}
		</Alert>
	</div>
{/if}
