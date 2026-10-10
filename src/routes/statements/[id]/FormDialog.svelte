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
		children
	}: {
		open: boolean;
		action: string;
		title: string;
		confirmLabel: string;
		confirmTestid: string;
		danger?: boolean;
		children: Snippet;
	} = $props();

	let form = $state<HTMLFormElement>();
	let busy = $state(false);
</script>

<form
	bind:this={form}
	method="POST"
	{action}
	use:enhance={() => {
		busy = true;
		return async ({ update }) => {
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
