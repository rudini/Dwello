<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { enhance } from '$app/forms';
	import { tick, type Snippet } from 'svelte';
	import Alert from './Alert.svelte';
	import Dialog from './Dialog.svelte';
	import { dialogSubmit } from './dialog-submit';

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
		fields = {},
		check = () => true,
		children,
		afterError
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
		fields?: Record<string, string>; // values of fields in the dialog, which lies outside the form
		check?: () => boolean; // false: the dialog shows what is wrong, nothing is sent
		children: Snippet;
		afterError?: Snippet; // a way out of a refusal, read after the refusal itself
	} = $props();

	let form = $state<HTMLFormElement>();
	let busy = $state(false);
	let refusal = $state<HTMLElement>();

	// a refusal shows below the content: it takes the focus, so it is read and scrolled into a short window;
	// a way out below it is scrolled in first, then the refusal, so a window big enough shows both (persona Anna K2)
	async function showRefusal() {
		await tick();
		const alert = refusal?.querySelector<HTMLElement>('[data-testid="form-error"]');
		alert?.focus();
		[...(refusal?.querySelectorAll<HTMLElement>('button') ?? [])]
			.at(-1)
			?.scrollIntoView?.({ block: 'nearest' });
		alert?.scrollIntoView?.({ block: 'nearest' });
	}
</script>

<form
	bind:this={form}
	method="POST"
	{action}
	use:enhance={dialogSubmit(
		() => fields,
		(running) => (busy = running),
		(result) => {
			if (result.type === 'failure') return showRefusal();
			if (result.type !== 'success') return;
			open = false;
			onsuccess?.();
		},
		() => onsuccess?.() // a delete leads to another page, which confirms it
	)}
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
	onconfirm={() => check() && form?.requestSubmit()}
>
	{@render children()}
	<div bind:this={refusal} class="contents">
		{#if error}
			<Alert tone="critical" title={m.ui_action_failed()} testid="form-error"><p>{error}</p></Alert>
		{/if}
		{@render afterError?.()}
	</div>
</Dialog>
