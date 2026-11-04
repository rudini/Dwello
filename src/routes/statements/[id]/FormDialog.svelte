<script lang="ts">
	import { m } from '$lib/paraglide/messages';
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
		describedby,
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
		success?: string; // said after the action succeeded; the focus then goes to the new status
		describedby?: string; // the ids of the sentences that describe the dialog, when its first paragraph is not enough
		children: Snippet;
	} = $props();

	let form = $state<HTMLFormElement>();
	let busy = $state(false);
	let said: string | undefined; // the success text at submit: the refreshed page may name another (#959, a part payment)
</script>

<!-- hidden: an empty form would still take a gap in the page's column -->
<form
	hidden
	bind:this={form}
	method="POST"
	{action}
	use:enhance={dialogSubmit(
		() => ((said = success), fields),
		(running) => (busy = running),
		async (result) => {
			open = false;
			if (result.type === 'success' && said) {
				addToast('success', said);
				await tick(); // after the dialog has handed the focus back
				// its button may be gone now: the focus names the new status, not the page title again (#653)
				document.getElementById('statement-status-line')?.focus();
			}
		},
		() => ondone?.(),
		true // only the delete leads to another page
	)}
></form>

<Dialog
	bind:open
	{title}
	{confirmLabel}
	{danger}
	{busy}
	busyLabel={m.ui_saving()}
	{confirmTestid}
	{describedby}
	onconfirm={() => check() && form?.requestSubmit()}
>
	{@render children()}
</Dialog>
