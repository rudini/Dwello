<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { page } from '$app/stores';
	import Button from '$lib/ui/Button.svelte';
	import Illustration from '$lib/ui/Illustration.svelte';
	import { MAX_MEGABYTES } from '$lib/invoice-upload';

	const messages: Record<number, () => string> = {
		404: m.error_404,
		403: m.error_403,
		// a body over BODY_SIZE_LIMIT, which SvelteKit refuses as «Payload Too Large» (#847)
		413: m.error_413
	};
	// SvelteKit's own words for an unexpected failure are English in every language (#519); a load's own message stays
	const ownWords = /^(Internal Error|Unknown Error|Error: \d+)$/;
	const message = $derived(
		messages[$page.status]?.() ??
			(ownWords.test($page.error?.message ?? '') ? undefined : $page.error?.message) ??
			m.error_unexpected()
	);
	const hints: Record<number, () => string> = {
		404: m.error_hint_404,
		413: () => m.backend_document_too_large({ megabytes: MAX_MEGABYTES })
	};
	const hint = $derived(hints[$page.status]?.() ?? m.error_hint_retry());
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
		<Button variant="primary" href="/dashboard" icon="overview" testid="error-to-overview"
			>{m.error_to_overview()}</Button
		>
	</div>
</div>
