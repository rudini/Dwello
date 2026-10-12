<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { enhance } from '$app/forms';
	import { addToast } from '$lib/stores';
	import Alert from '$lib/ui/Alert.svelte';
	import Dialog from '$lib/ui/Dialog.svelte';

	// Deleting a building also deletes its invoices (backend cascade); one with apartments cannot be deleted
	let {
		open = $bindable(),
		name,
		hasApartments,
		serverError
	}: { open: boolean; name: string; hasApartments: boolean; serverError?: string } = $props();

	let form = $state<HTMLFormElement>();
	let deleting = $state(false);
	const error = $derived(hasApartments ? m.buildings_delete_has_apartments() : serverError);
</script>

<form
	bind:this={form}
	method="POST"
	action="?/delete"
	use:enhance={() => {
		deleting = true;
		return async ({ result, update }) => {
			if (result.type === 'redirect') addToast('success', m.buildings_deleted_toast({ name }));
			await update();
			deleting = false;
		};
	}}
></form>

<Dialog
	bind:open
	title={m.buildings_delete_title()}
	confirmLabel={m.buildings_delete_confirm()}
	danger
	busy={deleting}
	busyLabel={m.buildings_deleting()}
	confirmDisabled={hasApartments}
	confirmTestid="building-delete-confirm"
	onconfirm={() => form?.requestSubmit()}
>
	{#if !hasApartments}
		<p>
			{m.buildings_delete_text_before()} <strong>{name}</strong>
			{m.buildings_delete_text_after()}
		</p>
	{/if}
	{#if error}
		<Alert tone="critical" title={m.buildings_delete_impossible()} testid="form-error">
			<p>{error}</p>
		</Alert>
	{/if}
</Dialog>
