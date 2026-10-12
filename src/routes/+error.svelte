<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { page } from '$app/stores';
	import Button from '$lib/ui/Button.svelte';
	import Illustration from '$lib/ui/Illustration.svelte';

	const messages: Record<number, () => string> = {
		404: m.error_404,
		403: m.error_403
	};
	const message = $derived(
		messages[$page.status]?.() ?? $page.error?.message ?? m.error_unexpected()
	);
	const hint = $derived($page.status === 404 ? m.error_hint_404() : m.error_hint_retry());
</script>

<svelte:head>
	<title>{m.error_title()} - Dwello</title>
</svelte:head>

<div class="flex flex-col items-center gap-6 px-4 py-16 text-center">
	<Illustration name="problem" />
	<h1 class="text-3xl font-bold text-ink">{message}</h1>
	<p class="max-w-prose text-lg text-ink-muted">{hint}</p>
	<div class="flex flex-wrap justify-center gap-4">
		<Button onclick={() => history.back()} icon="arrow-back">{m.ui_back()}</Button>
		<Button variant="primary" href="/dashboard" icon="overview">{m.error_to_overview()}</Button>
	</div>
</div>
