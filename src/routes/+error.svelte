<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/ui/Button.svelte';
	import Illustration from '$lib/ui/Illustration.svelte';

	const messages: Record<number, string> = {
		404: 'Diese Seite gibt es nicht.',
		403: 'Sie haben keinen Zugriff auf diese Seite.'
	};
	const message = $derived(
		messages[$page.status] ?? $page.error?.message ?? 'Ein unerwarteter Fehler ist aufgetreten.'
	);
	const hint = $derived(
		$page.status === 404
			? 'Prüfen Sie die Adresse oder gehen Sie zur Übersicht.'
			: 'Versuchen Sie es später erneut.'
	);
</script>

<svelte:head>
	<title>Fehler - Dwello</title>
</svelte:head>

<div class="flex flex-col items-center gap-6 px-4 py-16 text-center">
	<Illustration name="problem" />
	<h1 class="text-3xl font-bold text-ink">{message}</h1>
	<p class="max-w-prose text-lg text-ink-muted">{hint}</p>
	<div class="flex flex-wrap justify-center gap-4">
		<Button onclick={() => history.back()} icon="arrow-back">Zurück</Button>
		<Button variant="primary" href="/dashboard" icon="overview">Zur Übersicht</Button>
	</div>
</div>
