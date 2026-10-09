<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';

	const messages: Record<number, string> = {
		404: 'Diese Seite gibt es nicht.',
		403: 'Sie haben keinen Zugriff auf diese Seite.'
	};
	const message = $derived(
		messages[$page.status] ?? $page.error?.message ?? 'Ein unerwarteter Fehler ist aufgetreten.'
	);
</script>

<svelte:head>
	<title>Fehler - Dwello</title>
</svelte:head>

<div class="min-h-[60vh] flex items-center justify-center py-12 px-4">
	<div class="max-w-md w-full text-center">
		<Icon name="error" size={56} class="text-critical mb-6" />
		<h1 class="text-4xl font-bold text-gray-900 mb-2">{$page.status}</h1>
		<p class="text-lg text-gray-600 mb-8">{message}</p>
		<div class="flex justify-center gap-3">
			<Button variant="secondary" onclick={() => history.back()}>
				<Icon name="arrow_back" size={18} />
				Zurück
			</Button>
			<Button href="/dashboard" variant="primary">
				<Icon name="dashboard" size={18} />
				Zum Dashboard
			</Button>
		</div>
	</div>
</div>
