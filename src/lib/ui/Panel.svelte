<script lang="ts">
	import type { Snippet } from 'svelte';

	// Bordered surface for one topic of a page
	let {
		title,
		level = 2,
		children,
		testid
	}: { title?: string; level?: 2 | 3; children: Snippet; testid?: string } = $props();
</script>

<section
	class="flex flex-col gap-4 rounded-panel border border-line bg-surface p-6"
	data-testid={testid}
>
	{#if title}
		{#if level === 3}
			<h3 class="text-xl font-bold leading-tight text-ink">{title}</h3>
		{:else}
			<h2 class="text-xl font-bold leading-tight text-ink">{title}</h2>
		{/if}
	{/if}
	{@render children()}
</section>
