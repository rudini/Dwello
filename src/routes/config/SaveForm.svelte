<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Snippet } from 'svelte';
	import { m } from '$lib/paraglide/messages';
	import { addToast } from '$lib/stores';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { focusFirstError } from '$lib/ui/focus-error';

	// Form of a master data record: the reason it was not saved on top, cancel and save at the bottom;
	// once saved, a message names the kind of record (`record`) and the name the user gave it
	let {
		action,
		record,
		error,
		cancelHref,
		submitLabel,
		submitTestid,
		checking = $bindable(false),
		children
	}: {
		action?: string;
		record: 'category' | 'distributionKey' | 'heatingProfile';
		error?: string;
		cancelHref: string;
		submitLabel: string;
		submitTestid: string;
		checking?: boolean; // while another action runs, e.g. «Von der KI prüfen lassen»
		children: Snippet;
	} = $props();

	const texts = {
		category: { saved: m.categories_saved, notSaved: m.categories_not_saved },
		distributionKey: { saved: m.keys_saved, notSaved: m.keys_not_saved },
		heatingProfile: { saved: m.profiles_saved, notSaved: m.profiles_not_saved }
	};
	const text = $derived(texts[record]);

	let saving = $state(false);
	let form: HTMLFormElement;
</script>

<!-- Enter in a field saves, also when another action's button (e.g. «Formel testen») comes first -->
<svelte:window
	onkeydown={(event) => {
		const field = event.target;
		if (event.key !== 'Enter' || !(field instanceof HTMLInputElement) || field.form !== form)
			return;
		event.preventDefault();
		form.requestSubmit(form.querySelector<HTMLButtonElement>(`[data-testid="${submitTestid}"]`));
	}}
/>

<form
	bind:this={form}
	method="POST"
	{action}
	use:enhance={({ formData, submitter }) => {
		checking = !!submitter?.hasAttribute('formaction'); // another action, e.g. "Formel testen", saves nothing
		saving = !checking;
		const name = String(formData.get('name') ?? '').trim();
		return async ({ result, update, formElement }) => {
			if (result.type === 'redirect') addToast('success', text.saved({ name }));
			await update({ reset: false });
			saving = checking = false;
			focusFirstError(formElement);
		};
	}}
	class="flex flex-col gap-8"
	novalidate
>
	{#if error}
		<Alert tone="critical" title={text.notSaved()} testid="form-error">
			<p>{error}</p>
		</Alert>
	{/if}

	{@render children()}

	<div class="flex flex-col-reverse gap-4 border-t border-line pt-6 sm:flex-row">
		<Button href={cancelHref} testid="form-cancel">{m.ui_cancel()}</Button>
		<Button
			type="submit"
			variant="primary"
			icon="save"
			busy={saving}
			busyLabel={m.ui_saving()}
			testid={submitTestid}>{submitLabel}</Button
		>
	</div>
</form>
