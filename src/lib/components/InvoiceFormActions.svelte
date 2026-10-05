<script lang="ts">
	import Button from './Button.svelte';
	import Icon from './Icon.svelte';

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

<div class="flex items-center gap-3">
	<Button href={cancelHref} variant="secondary" testid="form-cancel">Abbrechen</Button>
	<Button type="submit" variant="primary" disabled={busy || disabled} testid="submit-button">
		{#if busy}
			<Icon name="progress_activity" size={20} class="animate-spin" />
			{busyLabel}
		{:else}
			<Icon name="check" size={20} />
			{label}
		{/if}
	</Button>
</div>
