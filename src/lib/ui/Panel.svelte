<script lang="ts">
	import type { Snippet } from 'svelte';

	// Bordered surface for one topic of a page
	let {
		title,
		level = 2,
		children,
		testid,
		id
	}: { title?: string; level?: 2 | 3; children: Snippet; testid?: string; id?: string } = $props();
</script>

<!-- scroll-mt keeps a section reached by its anchor clear of the sticky header -->
<section
	{id}
	class="flex scroll-mt-24 flex-col gap-4 rounded-panel border border-line bg-surface p-6"
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
