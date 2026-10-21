<script lang="ts">
	import { enhance } from '$app/forms';
	import { m } from '$lib/paraglide/messages';
	import Button from '$lib/ui/Button.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';
	import { focusFirstError } from '$lib/ui/focus-error';

	// Konto mit Passwort (#576); onfailed: the request failed before the backend answered (fach review 576 V-1)
	let {
		redirectTo,
		email,
		onfailed
	}: { redirectTo: string | null; email: string; onfailed: (failed: boolean) => void } = $props();

	let busy = $state(false);
</script>

<form
	method="POST"
	action="?/password"
	class="flex flex-col gap-4"
	use:enhance={({ formElement }) => {
		busy = true;
		onfailed(false);
		return async ({ result, update }) => {
			busy = false;
			if (result.type === 'error') onfailed(true);
			else await update({ reset: false });
			if (result.type === 'redirect') return;
			// a refused sign-in: the wrong password goes, the hint above the form gets the focus and is in view (persona Helga 576 P-1)
			formElement.querySelector<HTMLInputElement>('[name=password]')!.value = '';
			await focusFirstError(formElement.parentElement);
		};
	}}
>
	{#if redirectTo}
		<input type="hidden" name="redirectTo" value={redirectTo} />
	{/if}
	<TextInput
		id="login-email"
		name="email"
		type="email"
		label={m.login_email()}
		value={email}
		autocomplete="username"
		testid="login-email-input"
	/>
	<TextInput
		id="login-password"
		name="password"
		type="password"
		label={m.login_password()}
		help={m.login_password_forgot()}
		autocomplete="current-password"
		testid="login-password-input"
	/>
	<Button type="submit" variant="primary" full {busy} testid="login-password-submit">
		{m.login_password_submit()}
	</Button>
</form>
