<script lang="ts">
	import type { Snippet } from 'svelte';
	import { enhance } from '$app/forms';
	import { tick } from 'svelte';
	import { addToast } from '$lib/stores';
	import Dialog from '$lib/ui/Dialog.svelte';
	import { dialogSubmit } from '$lib/ui/dialog-submit';

	// A confirmation whose button runs a form action of the page; closes once the action has answered
	let {
		open = $bindable(),
		action,
		title,
		confirmLabel,
		confirmTestid,
		danger = false,
		ondone,
		fields = {},
		check = () => true,
		success,
		children
	}: {
		open: boolean;
		action: string;
		title: string;
		confirmLabel: string;
		confirmTestid: string;
		danger?: boolean;
		ondone?: () => void; // the action led to another page
		fields?: Record<string, string>; // values of fields in the dialog, which lies outside the form
		check?: () => boolean; // false: the dialog shows what is wrong, nothing is sent
		success?: string; // said after the action succeeded; the focus then goes to the page title
		children: Snippet;
	} = $props();

	let form = $state<HTMLFormElement>();
	let busy = $state(false);
</script>

<form
	bind:this={form}
	method="POST"
	{action}
	use:enhance={dialogSubmit(
		() => fields,
		(running) => (busy = running),
		async (result) => {
			open = false;
			if (result.type === 'success' && success) {
				addToast('success', success);
				await tick(); // after the dialog has handed the focus back
				document.querySelector<HTMLElement>('h1')?.focus(); // its button may be gone now
			}
		},
		ondone
	)}
></form>

<Dialog
	bind:open
	{title}
	{confirmLabel}
	{danger}
	{busy}
	busyLabel="Wird gespeichert …"
	{confirmTestid}
	onconfirm={() => check() && form?.requestSubmit()}
>
	{@render children()}
</Dialog>
