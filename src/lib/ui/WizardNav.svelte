<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Button from './Button.svelte';

	// Bottom of a wizard step inside its form: "Weiter" submits the step, so Enter in a field goes on as well;
	// the last step names its action instead
	let {
		step,
		last,
		onback,
		finalLabel,
		busy = false,
		loading = false,
		cancelHref,
		finalTestid = 'submit-button',
		busyLabel = m.ui_saving()
	}: {
		step: number;
		last: number;
		onback: () => void;
		finalLabel: string;
		busy?: boolean;
		loading?: boolean; // the step still loads what it shows: «Weiter» waits for it (#468)
		cancelHref: string;
		finalTestid?: string;
		busyLabel?: string;
	} = $props();
</script>

<div class="flex flex-col-reverse gap-4 border-t border-line pt-6 sm:flex-row sm:justify-between">
	{#if step === 1}
		<Button href={cancelHref} variant="ghost" testid="form-cancel">{m.ui_cancel()}</Button>
	{:else}
		<Button onclick={onback} variant="secondary" icon="arrow-back" testid="wizard-back"
			>{m.ui_back()}</Button
		>
	{/if}
	{#if step === last}
		<Button type="submit" variant="primary" icon="save" {busy} {busyLabel} testid={finalTestid}
			>{finalLabel}</Button
		>
	{:else}
		<Button
			type="submit"
			variant="primary"
			busy={busy || loading}
			busyLabel={loading ? m.ui_please_wait() : busyLabel}
			testid="wizard-next">{m.ui_next()}</Button
		>
	{/if}
</div>
