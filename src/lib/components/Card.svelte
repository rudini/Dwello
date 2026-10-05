<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		padding?: boolean;
		children?: Snippet;
	}

	let { class: className = '', padding = true, children }: Props = $props();

	const paddingClass = $derived(padding ? 'p-6' : '');
</script>

<div class="bg-white border border-slate-200 rounded-xl shadow-sm {paddingClass} {className}">
	{#if children}
		{@render children()}
	{/if}
</div>
