<script lang="ts">
	import { enhance } from '$app/forms';
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';
	import { focusFirstError } from '$lib/ui/focus-error';
	import type { ActionData, PageData } from './$types';

	// «Neuer Wiederherstellungscode» (#718, part 3, A8): first signing in again (the password, or the provider anew),
	// then the code, the Notfallblatt and the code typed again; the backups from before stay with the old code
	let { data, form }: { data: PageData; form: ActionData } = $props();
	let busy = $state(false);

	const submitting = ({ formElement }: { formElement: HTMLFormElement }) => {
		busy = true;
		return async ({
			result,
			update
		}: {
			result: { type: string };
			update: (options: { reset: boolean }) => Promise<void>;
		}) => {
			busy = false;
			await update({ reset: false });
			if (result.type !== 'redirect') await focusFirstError(formElement);
		};
	};
</script>

<svelte:head>
	<title>{m.backup_new_title()} - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-6" data-testid="backup-page">
	<PageHeader title={m.backup_new_title()} purpose={m.backup_new_intro()} />

	{#if data.confirmed && !data.code}
		<Alert tone="positive" title={m.backup_new_confirmed()} testid="backup-new-confirmed" />
	{/if}

	{#if data.code}
		<Panel>
			<div class="flex flex-col gap-4">
				<p class="text-ink-muted">{m.backup_code_label()}</p>
				<p class="text-3xl font-bold break-all text-ink" data-testid="backup-code">{data.code}</p>
				<p>{m.backup_new_keep_sheet()}</p>
				<div>
					<Button href="/backup/sheet" download testid="backup-sheet-link"
						>{m.backup_sheet_download()}</Button
					>
				</div>
			</div>
		</Panel>

		<Panel>
			<form method="POST" action="?/confirm" class="flex flex-col gap-4" use:enhance={submitting}>
				{#if form?.error}
					<Alert tone="critical" title={form.error} testid="backup-error" />
				{/if}
				<TextInput
					id="backup-code"
					name="code"
					label={m.backup_confirm_label()}
					help={m.backup_confirm_help()}
					autocomplete="off"
					testid="backup-code-input"
				/>
				<div>
					<Button type="submit" variant="primary" {busy} testid="backup-submit"
						>{m.backup_new_submit()}</Button
					>
				</div>
			</form>
		</Panel>
	{:else if data.step === 'again'}
		<Panel>
			<div class="flex flex-col gap-4">
				<p>{m.backup_new_provider_intro({ provider: data.provider })}</p>
				<div>
					<Button href={data.signIn} reload variant="primary" testid="backup-google-link"
						>{m.backup_new_provider_link({ provider: data.provider })}</Button
					>
				</div>
			</div>
		</Panel>
	{:else}
		<Panel>
			<form method="POST" action="?/create" class="flex flex-col gap-4" use:enhance={submitting}>
				{#if form?.error}
					<Alert tone="critical" title={form.error} testid="backup-error" />
				{/if}
				{#if data.step === 'password'}
					<p>{m.backup_new_password_intro()}</p>
					<TextInput
						id="backup-password"
						name="password"
						type="password"
						label={m.login_password()}
						autocomplete="current-password"
						testid="backup-password-input"
					/>
				{/if}
				<div>
					<Button type="submit" variant="primary" {busy} testid="backup-new-code"
						>{m.backup_new_create()}</Button
					>
				</div>
			</form>
		</Panel>
	{/if}
</div>
