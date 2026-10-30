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

	// «Sicherung einrichten» (#718, A8): the Wiederherstellungscode, the Notfallblatt to print, and the code typed again,
	// before Dwello backs up; until then every page leads here (hooks.server.ts)
	let { data, form }: { data: PageData; form: ActionData } = $props();
	let busy = $state(false);
	const GUIDE = 'https://github.com/rudini/Dwello/blob/main/docs/installation.md';
</script>

<svelte:head>
	<title>{m.backup_title()} - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-6" data-testid="backup-page">
	<PageHeader title={m.backup_title()} purpose={m.backup_intro()} />

	<Panel>
		<div class="flex flex-col gap-4">
			<p class="text-ink-muted">{m.backup_code_label()}</p>
			<p class="text-3xl font-bold break-all text-ink" data-testid="backup-code">{data.code}</p>
			<p>{m.backup_keep_sheet()}</p>
			<div>
				<Button href="/backup/sheet" download testid="backup-sheet-link"
					>{m.backup_sheet_download()}</Button
				>
			</div>
		</div>
	</Panel>

	<Panel>
		<form
			method="POST"
			class="flex flex-col gap-4"
			use:enhance={({ formElement }) => {
				busy = true;
				return async ({ result, update }) => {
					busy = false;
					await update({ reset: false });
					if (result.type !== 'redirect') await focusFirstError(formElement);
				};
			}}
		>
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
					>{m.backup_submit()}</Button
				>
			</div>
		</form>
	</Panel>

	<div class="flex flex-col gap-4">
		<p>{m.backup_location()}</p>
		<p>
			{m.backup_self()}
			<a
				href={GUIDE}
				data-testid="backup-guide-link"
				class="text-accent underline underline-offset-4">{m.backup_guide_link()}</a
			>
		</p>
		<p class="text-ink-muted">
			{m.backup_privacy_before()}
			<a
				href="/privacy"
				data-testid="backup-privacy-link"
				class="text-accent underline underline-offset-4">{m.privacy_record()}</a
			>.
		</p>
	</div>
</div>
