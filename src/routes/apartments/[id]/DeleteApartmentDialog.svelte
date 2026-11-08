<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { enhance } from '$app/forms';
	import { addToast } from '$lib/stores';
	import Alert from '$lib/ui/Alert.svelte';
	import Dialog from '$lib/ui/Dialog.svelte';

	// #1257: only an apartment without rental contracts is deleted; one with contracts stays as their history
	let {
		open = $bindable(),
		number,
		buildingId,
		hasContracts,
		serverError,
		refused = false
	}: {
		open: boolean;
		number: string;
		buildingId: string;
		hasContracts: boolean;
		serverError?: string;
		refused?: boolean; // the backend refused it: a contract came after the page loaded
	} = $props();

	let form = $state<HTMLFormElement>();
	let deleting = $state(false);
	const impossible = $derived(hasContracts || refused);
</script>

<form
	bind:this={form}
	method="POST"
	action="?/delete"
	use:enhance={() => {
		deleting = true;
		return async ({ result, update }) => {
			if (result.type === 'redirect') addToast('success', m.apartments_deleted_toast({ number }));
			await update();
			deleting = false;
		};
	}}
>
	<input type="hidden" name="buildingId" value={buildingId} />
</form>

<Dialog
	bind:open
	title={impossible
		? m.apartments_delete_impossible_title({ number })
		: m.apartments_delete_title({ number })}
	confirmLabel={m.apartments_delete_confirm()}
	danger
	busy={deleting}
	busyLabel={m.apartments_deleting()}
	{impossible}
	confirmTestid="apartment-delete-confirm"
	onconfirm={() => form?.requestSubmit()}
>
	{#if impossible}
		<p>{hasContracts ? m.apartments_delete_has_contracts() : serverError}</p>
	{:else}
		<!-- one paragraph: the dialog announces its first one, and the vacancy is part of the consequence (Sven 1257 P-1) -->
		<p>{m.apartments_delete_text({ number })} {m.apartments_delete_vacancy()}</p>
		{#if serverError}
			<Alert tone="critical" title={serverError} testid="form-error" />
		{/if}
	{/if}
</Dialog>
