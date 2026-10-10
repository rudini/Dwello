<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Snippet } from 'svelte';
	import { addToast } from '$lib/stores';
	import Alert from '$lib/ui/Alert.svelte';
	import Dialog from '$lib/ui/Dialog.svelte';

	// Asks before a master data record is deleted (form action `?/delete`); the backend's refusal stays in the dialog
	let {
		open = $bindable(),
		record,
		name,
		id,
		error,
		confirmTestid,
		children
	}: {
		open: boolean;
		record: string; // e.g. "Kategorie"
		name: string;
		id?: string; // the record to delete, when the page lists several
		error?: string;
		confirmTestid: string;
		children: Snippet;
	} = $props();

	let form = $state<HTMLFormElement>();
	let deleting = $state(false);
</script>

<form
	bind:this={form}
	method="POST"
	action="?/delete"
	use:enhance={() => {
		deleting = true;
		return async ({ result, update }) => {
			if (result.type === 'redirect') {
				addToast('success', `${record} «${name}» gelöscht`);
				open = false;
			}
			await update();
			deleting = false;
		};
	}}
>
	{#if id}<input type="hidden" name="id" value={id} />{/if}
</form>

<Dialog
	bind:open
	title="{record} «{name}» löschen?"
	confirmLabel="Löschen"
	danger
	busy={deleting}
	busyLabel="Wird gelöscht …"
	{confirmTestid}
	onconfirm={() => form?.requestSubmit()}
>
	{@render children()}
	{#if error}
		<Alert tone="critical" title="{record} wurde nicht gelöscht" testid="form-error">
			<p>{error}</p>
		</Alert>
	{/if}
</Dialog>
