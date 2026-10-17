<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Snippet } from 'svelte';
	import { m } from '$lib/paraglide/messages';
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
		record: 'category' | 'distributionKey' | 'heatingProfile' | 'auditEntry';
		name: string;
		id?: string; // the record to delete, when the page lists several
		error?: string;
		confirmTestid: string;
		children: Snippet;
	} = $props();

	const texts = {
		category: {
			deleted: m.categories_deleted,
			question: m.categories_delete_question,
			notDeleted: m.categories_not_deleted
		},
		distributionKey: {
			deleted: m.keys_deleted,
			question: m.keys_delete_question,
			notDeleted: m.keys_not_deleted
		},
		heatingProfile: {
			deleted: m.profiles_deleted,
			question: m.profiles_delete_question,
			notDeleted: m.profiles_not_deleted
		},
		auditEntry: {
			deleted: m.audit_deleted,
			question: m.audit_delete_title,
			notDeleted: m.audit_not_deleted
		}
	};
	const text = $derived(texts[record]);

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
				addToast('success', text.deleted({ name }));
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
	title={text.question({ name })}
	confirmLabel={m.buildings_delete()}
	danger
	busy={deleting}
	busyLabel={m.buildings_deleting()}
	{confirmTestid}
	onconfirm={() => form?.requestSubmit()}
>
	{@render children()}
	{#if error}
		<Alert tone="critical" title={text.notDeleted()} testid="form-error">
			<p>{error}</p>
		</Alert>
	{/if}
</Dialog>
