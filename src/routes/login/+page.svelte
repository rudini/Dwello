<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Alert from '$lib/ui/Alert.svelte';
	import Icon from '$lib/ui/Icon.svelte';
	import Illustration from '$lib/ui/Illustration.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{m.login_title()} - Dwello</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center px-4 py-12">
	<div class="flex w-full max-w-md flex-col gap-6 rounded-panel border border-line bg-surface p-8">
		<div class="flex flex-col items-center gap-4 text-center">
			<Illustration name="building" />
			<p class="text-xl font-bold text-accent">Dwello</p>
			<h1 class="text-3xl font-bold text-ink">{m.login_title()}</h1>
			<p class="text-ink-muted">
				{m.login_intro()}
			</p>
		</div>

		{#if data.error}
			<Alert tone="critical" title={data.error} testid="login-error" />
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
			{:else}
				<Alert tone="caution" title={m.login_unavailable_title()} testid="login-unavailable">
					<p>{m.login_unavailable_text()}</p>
				</Alert>
			{/each}
		</div>

		<p class="text-center text-ink-muted">
			{m.login_terms_before()}
			<a
				href="/terms"
				data-testid="login-terms-link"
				class="text-accent underline underline-offset-4">{m.terms_title()}</a
			>.
		</p>
	</div>
</div>
