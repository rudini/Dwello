<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Field from '$lib/ui/Field.svelte';
	import FileInput from '$lib/ui/FileInput.svelte';

	// Where files are chosen or dropped; closed until the building is chosen
	let { enabled, onfiles }: { enabled: boolean; onfiles: (files: File[]) => void } = $props();

	const help = $derived(enabled ? m.invoices_upload_files_help() : m.invoices_upload_building_first());

	function choose(event: Event) {
		const input = event.target as HTMLInputElement;
		onfiles([...(input.files ?? [])]);
		input.value = ''; // the same file can be chosen again after removing it
	}

	function drop(event: DragEvent) {
		event.preventDefault();
		if (enabled) onfiles([...(event.dataTransfer?.files ?? [])]);
	}
</script>

<div
	role="presentation"
	class="rounded-panel border-2 border-dashed border-line-strong p-4"
	ondragover={(event) => event.preventDefault()}
	ondrop={drop}
>
	<Field id="invoice-upload-files" label={m.invoices_upload_files_label()} {help}>
		{#snippet children(control)}
			<FileInput
				{control}
				choose={m.invoices_upload_files_choose()}
				multiple
				disabled={!enabled}
				onchange={choose}
				testid="invoice-upload-file"
			/>
		{/snippet}
	</Field>
</div>
