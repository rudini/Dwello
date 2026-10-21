<script lang="ts">
	import { enhance } from '$app/forms';
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';
	import Button from '$lib/ui/Button.svelte';
	import Illustration from '$lib/ui/Illustration.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';
	import { focusFirstError } from '$lib/ui/focus-error';
	import type { ActionData } from './$types';

	// The setup on the first visit (#577): the Einrichtungscode from the server log creates the Konto mit Passwort
	let { form }: { form: ActionData } = $props();

	let busy = $state(false);
	let failed = $state(false);
	const error = $derived(failed ? m.login_error_failed() : form?.error);
</script>

<svelte:head>
	<title>{m.setup_title()} - Dwello</title>
</svelte:head>

<div class="flex flex-1 items-center justify-center px-4 py-12">
	<div class="flex w-full max-w-md flex-col gap-6 rounded-panel border border-line bg-surface p-8">
		<div class="flex flex-col items-center gap-4 text-center">
			<Illustration name="building" />
			<p class="text-xl font-bold text-accent">Dwello</p>
			<h1 class="text-3xl font-bold text-ink">{m.setup_title()}</h1>
			<p class="text-ink-muted">{m.setup_intro()}</p>
		</div>

		{#if error}
			<Alert tone="critical" title={error} testid="setup-error" />
		{/if}

		<form
			method="POST"
			class="flex flex-col gap-4"
			use:enhance={({ formElement }) => {
				busy = true;
				failed = false;
				return async ({ result, update }) => {
					busy = false;
					if (result.type === 'error') failed = true;
					else await update({ reset: false });
					if (result.type === 'redirect') return;
					// a refused setup: the passwords go, the hint above the form gets the focus (as on the sign-in page)
					for (const field of formElement.querySelectorAll<HTMLInputElement>('[type=password]'))
						field.value = '';
					await focusFirstError(formElement.parentElement);
				};
			}}
		>
			<TextInput
				id="setup-code"
				name="code"
				label={m.setup_code()}
				help={m.setup_code_help()}
				autocomplete="off"
				testid="setup-code-input"
			/>
			<TextInput
				id="setup-email"
				name="email"
				type="email"
				label={m.login_email()}
				value={form?.email ?? ''}
				autocomplete="username"
				testid="setup-email-input"
			/>
			<TextInput
				id="setup-password"
				name="password"
				type="password"
				label={m.login_password()}
				help={m.setup_password_help()}
				autocomplete="new-password"
				testid="setup-password-input"
			/>
			<TextInput
				id="setup-password-repeat"
				name="repeat"
				type="password"
				label={m.setup_password_repeat()}
				autocomplete="new-password"
				testid="setup-password-repeat-input"
			/>
			<Button type="submit" variant="primary" full {busy} testid="setup-submit"
				>{m.setup_submit()}</Button
			>
		</form>

		<p class="text-center text-ink-muted">
			{m.login_terms_before()}
			<a
				href="/terms"
				data-testid="setup-terms-link"
				class="text-accent underline underline-offset-4">{m.terms_title()}</a
			>.
			{m.login_privacy_before()}
			<a
				href="/privacy"
				data-testid="setup-privacy-link"
				class="text-accent underline underline-offset-4">{m.privacy_record()}</a
			>.
		</p>
	</div>
</div>
