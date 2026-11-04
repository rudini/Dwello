<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Button from '$lib/ui/Button.svelte';
	import Illustration from '$lib/ui/Illustration.svelte';
	import type { PageData } from './$types';

	// #734: in the look of the app's error page (+error.svelte)
	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.title} - Dwello</title>
</svelte:head>

<div class="flex flex-col items-center gap-6 px-4 py-16 text-center">
	<Illustration name="problem" />
	<h1 class="text-3xl font-bold text-ink">{data.title}</h1>
	<p class="max-w-prose text-lg text-ink-muted" data-testid="pdf-refusal-message">
		{data.sentence}
	</p>
	<div class="flex flex-wrap justify-center gap-4">
		{#if data.settings}
			<Button href="/config" icon="settings" testid="pdf-refusal-settings"
				>{m.documents_to_settings()}</Button
			>
		{/if}
		<Button
			variant="primary"
			href={data.back ?? data.list}
			icon="arrow-back"
			testid="pdf-refusal-back">{data.way}</Button
		>
	</div>
</div>
