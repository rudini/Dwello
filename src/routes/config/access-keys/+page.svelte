<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { addToast } from '$lib/stores';
	import ActionDialog from '$lib/ui/ActionDialog.svelte';
	import Button from '$lib/ui/Button.svelte';
	import EmptyState from '$lib/ui/EmptyState.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';
	import AccessKeyRow from './AccessKeyRow.svelte';
	import CopyButton from './CopyButton.svelte';
	import NewAccessKey from './NewAccessKey.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	type Key = PageData['keys'][number];
	let creating = $state(false);
	let name = $state('');
	let toRevoke = $state<Key | null>(null);
	// the dialog closes before it reports success: the toast names the key kept here (code review 817-1 C-3)
	let revokedName = $state('');
	const revoking = $derived(toRevoke ?? { id: '', name: '', expired: false });
	// #817: the new key comes once, from the create action; closing it leaves only its name in the list
	let closed = $state<string | null>(null);
	const created = $derived(
		form && 'created' in form && form.created?.key !== closed ? form.created : null
	);
</script>

<svelte:head>
	<title>{m.ai_keys_title()} - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8">
	<PageHeader
		title={m.ai_keys_title()}
		purpose={m.ai_keys_purpose()}
		trail={[{ href: '/config', label: m.nav_settings() }]}
	>
		{#snippet action()}
			<Button
				variant="primary"
				icon="add"
				onclick={() => ((name = ''), (creating = true))}
				testid="access-key-create-button">{m.ai_keys_create()}</Button
			>
		{/snippet}
	</PageHeader>

	<div class="flex flex-col items-start gap-4">
		<p class="break-all text-ink" data-testid="access-key-address">
			{m.ai_keys_address({ url: data.mcpUrl })}
		</p>
		<CopyButton
			text={data.mcpUrl}
			label={m.ai_keys_copy_address()}
			testid="access-key-address-copy"
		/>
	</div>
	<p class="text-ink">
		{m.ai_keys_before()}
		<a href="/privacy#ai-keys" class="text-accent underline underline-offset-4"
			>{m.privacy_title()}</a
		>
	</p>

	{#if created}
		<NewAccessKey key={created.key} url={data.mcpUrl} onclose={() => (closed = created.key)} />
	{/if}

	{#if data.keys.length === 0}
		<EmptyState
			title={m.ai_keys_empty_title()}
			text={m.ai_keys_empty_text()}
			illustration="done"
			testid="access-keys-empty"
		/>
	{:else}
		<ul class="flex flex-col gap-4" data-testid="access-key-list">
			{#each data.keys as key (key.id)}
				<AccessKeyRow {key} onrevoke={() => ((toRevoke = key), (revokedName = key.name))} />
			{/each}
		</ul>
	{/if}
</div>

<ActionDialog
	bind:open={creating}
	action="?/create"
	title={m.ai_keys_create()}
	confirmLabel={m.ai_keys_create()}
	confirmTestid="access-key-create-confirm"
	error={form && 'createError' in form ? form.createError : undefined}
	fields={{ name }}
>
	<TextInput
		id="access-key-name"
		label={m.ai_keys_name()}
		help={m.ai_keys_name_help()}
		bind:value={name}
		testid="access-key-name-input"
	/>
</ActionDialog>

<ActionDialog
	bind:open={
		() => toRevoke !== null,
		(open) => {
			if (!open) toRevoke = null;
		}
	}
	action="?/revoke"
	title={m.ai_keys_revoke_title()}
	confirmLabel={m.ai_keys_revoke()}
	danger
	confirmTestid="access-key-revoke-confirm"
	error={form && 'revokeError' in form ? form.revokeError : undefined}
	fields={{ id: revoking.id }}
	onsuccess={() => addToast('success', m.audit_ai_key_revoked({ name: revokedName }))}
>
	<p data-testid="access-key-revoke-message">
		{revoking.expired
			? m.ai_keys_revoke_expired_text({ name: revoking.name })
			: m.ai_keys_revoke_text({ name: revoking.name })}
	</p>
</ActionDialog>
