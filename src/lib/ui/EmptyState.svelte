<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from './Button.svelte';

	// Nothing to show yet: what is missing, why it matters, and the one next step
	let {
		title,
		text,
		actionLabel,
		actionHref,
		illustration,
		testid
	}: {
		title: string;
		text: string;
		actionLabel?: string;
		actionHref?: string;
		illustration?: Snippet;
		testid?: string;
	} = $props();
</script>

<div class="flex flex-col items-center gap-4 px-4 py-12 text-center" data-testid={testid}>
	{#if illustration}{@render illustration()}{/if}
	<h2 class="text-xl font-bold text-ink">{title}</h2>
	<p class="max-w-prose text-ink-muted">{text}</p>
	{#if actionLabel && actionHref}
		<Button variant="primary" href={actionHref}>{actionLabel}</Button>
	{/if}
</div>
