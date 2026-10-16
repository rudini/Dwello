<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Field from '$lib/ui/Field.svelte';
	import { controlClass } from '$lib/ui/field';

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
			<input
				id={control.id}
				type="file"
				multiple
				accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
				disabled={!enabled}
				aria-describedby={control.describedBy}
				class={controlClass(false)}
				onchange={choose}
				data-testid="invoice-upload-file-input"
			/>
		{/snippet}
	</Field>
</div>
