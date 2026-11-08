<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { Snippet } from 'svelte';
	import { m } from '$lib/paraglide/messages';
	import { addToast } from '$lib/stores';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import { focusFirstError } from '$lib/ui/focus-error';
	import { saveOnEnter } from '$lib/ui/save-on-enter';
	import { focusSavedRow } from '$lib/focus-after-action';
	import { localName } from '$lib/names';

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
		form = $bindable(),
		ask,
		children
	}: {
		action?: string;
		record: 'category' | 'distributionKey' | 'heatingProfile';
		error?: string;
		cancelHref: string;
		submitLabel: string;
		submitTestid: string;
		checking?: boolean; // while another action runs, e.g. «Von der KI prüfen lassen»
		form?: HTMLFormElement;
		ask?: () => boolean; // true: a question comes before the save, which the asker sends again once answered
		children: Snippet;
	} = $props();

	const texts = {
		category: { saved: m.categories_saved, notSaved: m.categories_not_saved },
		distributionKey: { saved: m.keys_saved, notSaved: m.keys_not_saved },
		heatingProfile: { saved: m.profiles_saved, notSaved: m.profiles_not_saved }
	};
	const text = $derived(texts[record]);

	let saving = $state(false);

	const submitted: SubmitFunction = ({ formData, submitter, cancel }) => {
		// another action, e.g. "Formel testen", saves nothing; each answer ends only its own request
		const check = !!submitter?.hasAttribute('formaction');
		if (!check && ask?.()) return cancel();
		if (check) checking = true;
		else saving = true;
		const name = String(formData.get('name') ?? '').trim();
		// the names the list shows in the UI language (#345)
		const [nameFR, nameIT, nameEN] = ['nameFR', 'nameIT', 'nameEN'].map((key) =>
			String(formData.get(key) ?? '')
		);
		const names = { name, nameFR, nameIT, nameEN };
		return async ({ result, update, formElement }) => {
			const focused = document.activeElement;
			const formPage = location.pathname;
			// #678: the confirmation names the record as the list does
			if (result.type === 'redirect') addToast('success', text.saved({ name: localName(names) }));
			await update({ reset: false });
			// #1124, #1128: back on the list, the saved record's row has the focus, which the confirmation keeps clear of
			if (result.type === 'redirect') focusSavedRow(formPage, names);
			if (check) checking = false;
			else saving = false;
			await focusFirstError(formElement);
			// the button was disabled while it ran: without an error to show, the focus goes back to where
			// the user went meanwhile, or to the button
			if (check && document.activeElement === document.body)
				(focused instanceof HTMLElement && focused !== document.body
					? focused
					: submitter
				)?.focus();
		};
	};
</script>

<form
	bind:this={form}
	method="POST"
	{action}
	use:enhance={submitted}
	{@attach saveOnEnter(() => saving)}
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
