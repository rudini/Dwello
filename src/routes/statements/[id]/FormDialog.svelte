<script lang="ts">
	import type { Snippet } from 'svelte';
	import { enhance } from '$app/forms';
	import Dialog from '$lib/ui/Dialog.svelte';

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
		children: Snippet;
	} = $props();

	let form = $state<HTMLFormElement>();
	let busy = $state(false);
</script>

<form
	bind:this={form}
	method="POST"
	{action}
	use:enhance={({ formData }) => {
		for (const [name, value] of Object.entries(fields)) formData.set(name, value);
		busy = true;
		return async ({ result, update }) => {
			if (result.type === 'redirect') ondone?.();
			await update();
			busy = false;
			open = false;
		};
	}}
></form>

<Dialog
	bind:open
	{title}
	{confirmLabel}
	{danger}
	{busy}
	busyLabel="Wird gespeichert …"
	{confirmTestid}
	onconfirm={() => form?.requestSubmit()}
>
	{@render children()}
</Dialog>
