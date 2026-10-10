<script lang="ts">
	import Button from './Button.svelte';
	import Illustration from './Illustration.svelte';
	import type { IllustrationName } from './illustrations';

	// Nothing to show yet: what is missing, why it matters, and the one next step
	let {
		title,
		text,
		actionLabel,
		actionHref,
		actionTestid,
		illustration,
		testid
	}: {
		title: string;
		text: string;
		actionLabel?: string;
		actionHref?: string;
		actionTestid?: string;
		illustration?: IllustrationName;
		testid?: string;
	} = $props();
</script>

<div class="flex flex-col items-center gap-4 px-4 py-12 text-center" data-testid={testid}>
	{#if illustration}<Illustration name={illustration} />{/if}
	<!-- After a search without results the focus moves here (afterNavigate in the root layout) -->
	<h2 tabindex="-1" data-results class="text-xl font-bold text-ink">{title}</h2>
	<p class="max-w-prose text-ink-muted">{text}</p>
	{#if actionLabel && actionHref}
		<Button variant="primary" href={actionHref} testid={actionTestid}>{actionLabel}</Button>
	{/if}
</div>
