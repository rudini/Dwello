<script lang="ts">
	import type { Snippet } from 'svelte';

	// A message that appears without the focus moving (#665): the region is there before it, so it is
	// announced when `shown`; empty, it takes no gap in the column (review B-13 N5)
	let { shown, testid, children }: { shown: boolean; testid?: string; children: Snippet } =
		$props();
</script>

<div role="status" class={shown ? '' : 'sr-only'} data-testid={testid}>
	{#if shown}{@render children()}{/if}
</div>
