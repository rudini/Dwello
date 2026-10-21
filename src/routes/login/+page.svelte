<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';
	import Icon from '$lib/ui/Icon.svelte';
	import Illustration from '$lib/ui/Illustration.svelte';
	import PasswordForm from './PasswordForm.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// a request that fails before the backend answered (fach review 576 V-1): not a wrong password, not a Sperre
	let failed = $state(false);
	const error = $derived(failed ? m.login_error_failed() : (form?.error ?? data.error));
	const intro = $derived(data.password ? m.login_intro_password() : m.login_intro());
	// without any sign-in set up, the hint how to create one (fach review 576 V-2)
	const unavailable = $derived(!data.password && !data.providers.length);
</script>

<svelte:head>
	<title>{m.login_title()} - Dwello</title>
</svelte:head>

<div class="flex flex-1 items-center justify-center px-4 py-12">
	<div class="flex w-full max-w-md flex-col gap-6 rounded-panel border border-line bg-surface p-8">
		<div class="flex flex-col items-center gap-4 text-center">
			<Illustration name="building" />
			<p class="text-xl font-bold text-accent">Dwello</p>
			<h1 class="text-3xl font-bold text-ink">{m.login_title()}</h1>
			<p class="text-ink-muted">
				{intro}
			</p>
		</div>

		{#if error}
			<Alert tone="critical" title={error} testid="login-error" />
		{/if}

		{#if data.insecure}
			<Alert tone="caution" title={m.login_insecure_title()} testid="login-insecure">
				<p>{m.login_insecure_text()}</p>
			</Alert>
		{/if}

		{#if data.password}
			<PasswordForm
				redirectTo={data.redirectTo}
				email={form?.email ?? ''}
				onfailed={(value) => (failed = value)}
			/>
		{/if}

		<div class="flex flex-col gap-4">
			{#each data.providers as provider (provider.id)}
				<a
					href={provider.href}
					data-sveltekit-reload
					data-testid="login-{provider.id}"
					class="flex min-h-12 items-center justify-center gap-2 rounded-control border-2 border-line-strong bg-surface px-6 font-semibold text-accent hover:bg-accent-soft"
				>
					<Icon name="user" />
					{m.login_with({ provider: provider.name })}
				</a>
			{/each}
			{#if unavailable}
				<Alert tone="caution" title={m.login_unavailable_title()} testid="login-unavailable">
					<p>{m.login_unavailable_text()}</p>
				</Alert>
			{/if}
		</div>

		<p class="text-center text-ink-muted" data-testid="login-legal">
			{m.login_terms_before()}
			<a
				href="/terms"
				data-testid="login-terms-link"
				class="text-accent underline underline-offset-4">{m.terms_title()}</a
			>.
			{m.login_privacy_before()}
			<a
				href="/privacy"
				data-testid="login-privacy-link"
				class="text-accent underline underline-offset-4">{m.privacy_record()}</a
			>.
		</p>
	</div>
</div>
