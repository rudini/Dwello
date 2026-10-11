<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { enhance } from '$app/forms';
	import type { Snippet } from 'svelte';
	import Alert from './Alert.svelte';
	import Dialog from './Dialog.svelte';

	// Confirmation that posts to a form action of the page; a refusal stays in the dialog with its reason
	let {
		open = $bindable(),
		action,
		title,
		confirmLabel,
		danger = false,
		disabled = false,
		confirmTestid,
		error,
		onsuccess,
		children
	}: {
		open: boolean;
		action: string;
		title: string;
		confirmLabel: string;
		danger?: boolean;
		disabled?: boolean;
		confirmTestid: string;
		error?: string;
		onsuccess?: () => void;
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
		return async ({ result, update }) => {
			// a delete leads to another page, which confirms it
			if (result.type === 'redirect') onsuccess?.();
			await update();
			busy = false;
			if (result.type !== 'success') return;
			open = false;
			onsuccess?.();
		};
	}}
></form>

<Dialog
	bind:open
	{title}
	{confirmLabel}
	{danger}
	{busy}
	busyLabel={m.ui_please_wait()}
	confirmDisabled={disabled}
	{confirmTestid}
	onconfirm={() => form?.requestSubmit()}
>
	{@render children()}
	{#if error}
		<Alert tone="critical" title={m.ui_action_failed()} testid="form-error"><p>{error}</p></Alert>
	{/if}
</Dialog>
