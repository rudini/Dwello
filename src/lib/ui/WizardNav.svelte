<script lang="ts">
	import Button from './Button.svelte';

	// Bottom of a wizard step inside its form: "Weiter" submits the step, so Enter in a field goes on as well;
	// the last step names its action instead
	let {
		step,
		last,
		onback,
		finalLabel,
		busy = false,
		cancelHref,
		finalTestid = 'submit-button',
		busyLabel = 'Wird gespeichert …'
	}: {
		step: number;
		last: number;
		onback: () => void;
		finalLabel: string;
		busy?: boolean;
		cancelHref: string;
		finalTestid?: string;
		busyLabel?: string;
	} = $props();
</script>

<div class="flex flex-col-reverse gap-4 border-t border-line pt-6 sm:flex-row sm:justify-between">
	{#if step === 1}
		<Button href={cancelHref} variant="ghost" testid="form-cancel">Abbrechen</Button>
	{:else}
		<Button onclick={onback} variant="secondary" icon="arrow-back" testid="wizard-back"
			>Zurück</Button
		>
	{/if}
	{#if step === last}
		<Button type="submit" variant="primary" icon="save" {busy} {busyLabel} testid={finalTestid}
			>{finalLabel}</Button
		>
	{:else}
		<Button type="submit" variant="primary" {busy} {busyLabel} testid="wizard-next">Weiter</Button>
	{/if}
</div>
