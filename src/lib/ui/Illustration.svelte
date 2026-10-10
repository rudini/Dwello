<script lang="ts">
	import { illustrations, type IllustrationName } from './illustrations';

	// Decorative unless titled; one line style, colours from the tokens (themeable)
	let { name, title }: { name: IllustrationName; title?: string } = $props();
	const id = $props.id();
	const Motif = $derived(illustrations[name]);
</script>

<svg
	viewBox="0 0 160 120"
	width="160"
	height="120"
	class="shrink-0"
	aria-hidden={title ? undefined : 'true'}
	role={title ? 'img' : undefined}
	aria-labelledby={title ? id : undefined}
>
	{#if title}<title {id}>{title}</title>{/if}
	<g
		fill="var(--illu-fill)"
		stroke="var(--illu-line)"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<Motif />
	</g>
</svg>
