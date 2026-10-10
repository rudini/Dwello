<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Snippet } from 'svelte';
	import { addToast } from '$lib/stores';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { focusFirstError } from '$lib/ui/focus-error';

	// Form of a master data record: the reason it was not saved on top, cancel and save at the bottom;
	// once saved, a message names the record (`record`, e.g. "Kategorie") and the name the user gave it
	let {
		action,
		record,
		error,
		cancelHref,
		submitLabel,
		submitTestid,
		children
	}: {
		action?: string;
		record: string;
		error?: string;
		cancelHref: string;
		submitLabel: string;
		submitTestid: string;
		children: Snippet;
	} = $props();

	let saving = $state(false);
</script>

<form
	method="POST"
	{action}
	use:enhance={({ formData, submitter }) => {
		saving = !submitter?.hasAttribute('formaction'); // another action, e.g. "Formel testen", saves nothing
		const name = String(formData.get('name') ?? '').trim();
		return async ({ result, update, formElement }) => {
			if (result.type === 'redirect') addToast('success', `${record} «${name}» gespeichert`);
			await update({ reset: false });
			saving = false;
			focusFirstError(formElement);
		};
	}}
	class="flex flex-col gap-8"
	novalidate
>
	{#if error}
		<Alert tone="critical" title="{record} wurde nicht gespeichert" testid="form-error">
			<p>{error}</p>
		</Alert>
	{/if}

	{@render children()}

	<div class="flex flex-col-reverse gap-4 border-t border-line pt-6 sm:flex-row">
		<Button href={cancelHref} testid="form-cancel">Abbrechen</Button>
		<Button
			type="submit"
			variant="primary"
			icon="save"
			busy={saving}
			busyLabel="Wird gespeichert …"
			testid={submitTestid}>{submitLabel}</Button
		>
	</div>
</form>
