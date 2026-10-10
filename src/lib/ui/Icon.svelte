<script lang="ts">
	import { icons, type IconName } from './icons';

	// Decorative unless labelled; Lucide shapes with one stroke width everywhere, so the set stays consistent
	let { name, size = 20, label }: { name: IconName; size?: number; label?: string } = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="1.75"
	stroke-linecap="round"
	stroke-linejoin="round"
	class="shrink-0"
	aria-hidden={label ? undefined : 'true'}
	role={label ? 'img' : undefined}
	aria-label={label}
>
	{#each icons[name] as [tag, attributes], i (i)}
		<svelte:element this={tag} {...attributes} />
	{/each}
</svg>
