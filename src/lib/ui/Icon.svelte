<script lang="ts">
	import { icons, type IconName } from './icons';

	// Decorative unless labelled; same stroke everywhere so the set stays consistent
	let {
		name,
		size = 20,
		label
	}: { name: IconName; size?: 16 | 20 | 24 | 32; label?: string } = $props();
	const Glyph = $derived(icons[name]);
</script>

<Glyph
	{size}
	strokeWidth={1.75}
	aria-hidden={label ? undefined : 'true'}
	role={label ? 'img' : undefined}
	aria-label={label}
	class="shrink-0"
/>
