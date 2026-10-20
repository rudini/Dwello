<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { toDoOf, type UploadRow } from '$lib/invoice-upload';
	import Alert from '$lib/ui/Alert.svelte';

	// What the property manager should know about a file, then what keeps its invoice from being created
	let { row, errors }: { row: UploadRow; errors: Record<string, string> } = $props();

	// a sentence once: the Kategorie missing after creating is the note the row had before
	const messages = $derived([
		...new Set(
			[
				...row.notes,
				...toDoOf(row),
				errors.category,
				Object.keys(errors).some((field) => field !== 'category') && m.invoices_upload_fields_missing(),
				row.createError,
				// after what is to do, so the long rule below does not push it down (#455, persona Marco of #222)
				row.deducted
			].filter((text) => !!text) as string[]
		)
	]);
	const tone = $derived(row.status === 'check' && !row.createError ? 'caution' : 'critical');
</script>

{#if messages.length}
	<div data-testid="invoice-upload-row-message">
		<Alert {tone} title={m.invoices_upload_notes_title({ name: row.file.name })}>
			{#each messages as message (message)}<p>{message}</p>{/each}
			{#if row.deducted}
				<p class="text-ink-muted" data-testid="invoice-upload-deducted-rule">
					{m.invoices_upload_deducted_rule()}
				</p>
			{/if}
			{#if row.duplicateOf}
				<p>
					<a class="font-semibold text-accent-strong underline" href="/invoices/{row.duplicateOf}"
						>{m.invoices_upload_duplicate_link()}</a
					>
				</p>
			{/if}
		</Alert>
	</div>
{/if}
