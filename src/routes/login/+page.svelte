<script lang="ts">
	import { _ } from 'svelte-i18n';
	import ProviderIcon from './ProviderIcon.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Anmelden - Dwello</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-md w-full space-y-8">
		<div class="text-center">
			<h1 class="text-4xl font-bold text-gray-900">{$_('app.name')}</h1>
			<p class="mt-2 text-sm text-gray-600">{$_('app.tagline')}</p>
		</div>

		<div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
			<h2 class="mb-6 text-center text-xl font-semibold text-gray-900">{$_('auth.signIn')}</h2>

			{#if data.error}
				<p
					class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-critical"
					data-testid="login-error"
				>
					{data.error}
				</p>
			{/if}

			<div class="space-y-4">
				{#each data.providers as provider (provider.id)}
					<a
						href={provider.href}
						data-sveltekit-reload
						data-testid="login-{provider.id}"
						class="w-full flex justify-center items-center gap-3 px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						<ProviderIcon provider={provider.id} />
						<span>{$_('auth.signInWith', { values: { provider: provider.name } })}</span>
					</a>
				{:else}
					<p class="text-sm text-gray-600 text-center" data-testid="login-unavailable">
						Es ist keine Anmeldung eingerichtet. Bitte hinterlegen Sie die OAuth-Zugangsdaten für
						Google oder Microsoft.
					</p>
				{/each}
			</div>

			<div class="mt-6 relative">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-gray-300"></div>
				</div>
				<div class="relative flex justify-center text-sm">
					<span class="px-2 bg-white text-ink-muted">{$_('auth.secureAuth')}</span>
				</div>
			</div>

			<div class="mt-6 text-center text-xs text-ink-muted">
				<p>{$_('auth.termsAgreement')}</p>
				<p class="mt-1">{$_('auth.dataLocation')}</p>
			</div>
		</div>

		<p class="text-center text-xs text-ink-muted">Dwello v0.1.0</p>
	</div>
</div>
