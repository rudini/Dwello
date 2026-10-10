<script lang="ts">
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
	const error = $derived(
		hasApartments
			? 'Dieses Gebäude kann nicht gelöscht werden, da es noch Wohnungen enthält. Löschen Sie zuerst seine Wohnungen.'
			: serverError
	);
</script>

<form
	bind:this={form}
	method="POST"
	action="?/delete"
	use:enhance={() => {
		deleting = true;
		return async ({ result, update }) => {
			if (result.type === 'redirect') addToast('success', `Gebäude ${name} gelöscht`);
			await update();
			deleting = false;
		};
	}}
></form>

<Dialog
	bind:open
	title="Gebäude löschen?"
	confirmLabel="Gebäude löschen"
	danger
	busy={deleting}
	busyLabel="Wird gelöscht …"
	confirmDisabled={hasApartments}
	confirmTestid="building-delete-confirm"
	onconfirm={() => form?.requestSubmit()}
>
	{#if !hasApartments}
		<p>
			Das Gebäude <strong>{name}</strong> und alle seine Rechnungen werden endgültig gelöscht. Das lässt
			sich nicht rückgängig machen.
		</p>
	{/if}
	{#if error}
		<Alert tone="critical" title="Löschen nicht möglich" testid="form-error">
			<p>{error}</p>
		</Alert>
	{/if}
</Dialog>
