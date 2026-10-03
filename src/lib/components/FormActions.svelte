<script lang="ts">
	import Button from './Button.svelte';
	import Icon from './Icon.svelte';

	// Cancel and submit at the bottom of a form that submits itself; the submit button spins while it is busy
	let {
		cancelHref,
		submitting,
		icon,
		label,
		busyLabel
	}: { cancelHref: string; submitting: boolean; icon: string; label: string; busyLabel: string } = $props();
</script>

<div class="flex gap-3 pt-4 border-t border-gray-200">
	<Button href={cancelHref} variant="secondary" testid="form-cancel">Abbrechen</Button>
	<Button type="submit" variant="primary" disabled={submitting} testid="submit-button">
		{#if submitting}
			<span class="animate-spin">
				<Icon name="refresh" size={18} />
			</span>
			{busyLabel}
		{:else}
			<Icon name={icon} size={18} />
			{label}
		{/if}
	</Button>
</div>
