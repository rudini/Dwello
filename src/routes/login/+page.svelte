<script lang="ts">
	import Alert from '$lib/ui/Alert.svelte';
	import Icon from '$lib/ui/Icon.svelte';
	import Illustration from '$lib/ui/Illustration.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Anmelden - Dwello</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center px-4 py-12">
	<div class="flex w-full max-w-md flex-col gap-6 rounded-panel border border-line bg-surface p-8">
		<div class="flex flex-col items-center gap-4 text-center">
			<Illustration name="building" />
			<p class="text-xl font-bold text-accent">Dwello</p>
			<h1 class="text-3xl font-bold text-ink">Anmelden</h1>
			<p class="text-ink-muted">
				Melden Sie sich mit Ihrem bestehenden Konto an. Ein eigenes Passwort für Dwello brauchen Sie
				nicht.
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
					Mit {provider.name} anmelden
				</a>
			{:else}
				<Alert tone="caution" title="Keine Anmeldung eingerichtet" testid="login-unavailable">
					<p>Bitte hinterlegen Sie die OAuth-Zugangsdaten für Google oder Microsoft.</p>
				</Alert>
			{/each}
		</div>

		<p class="text-center text-ink-muted">
			Mit der Anmeldung akzeptieren Sie die
			<a href="/terms" class="text-accent underline underline-offset-4">Nutzungsbedingungen</a>.
		</p>
	</div>
</div>
