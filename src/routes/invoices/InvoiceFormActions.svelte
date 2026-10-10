<script lang="ts">
	import Button from '$lib/ui/Button.svelte';

	// Cancel and submit of an invoice form; while saving, the submit button shows `busyLabel`
	let {
		cancelHref,
		label,
		busyLabel,
		busy,
		disabled = false
	}: {
		cancelHref: string;
		label: string;
		busyLabel: string;
		busy: boolean;
		disabled?: boolean;
	} = $props();
</script>

<div class="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
	<Button href={cancelHref} testid="form-cancel">Abbrechen</Button>
	<Button
		type="submit"
		variant="primary"
		icon="save"
		{busy}
		{busyLabel}
		{disabled}
		testid="submit-button">{label}</Button
	>
</div>
