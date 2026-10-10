<script lang="ts">
	import Glyph from '$lib/ui/Icon.svelte';
	import { materialIcons } from '$lib/components/material-icons';

	// Old screens name Material Symbols; they are drawn from the one Lucide set until the screens are migrated
	let {
		name,
		size = 24,
		class: className = ''
	}: {
		name: string;
		size?: number;
		class?: string;
		'aria-hidden'?: boolean | 'true' | 'false';
	} = $props();
</script>

<span class="inline-flex shrink-0 {className}" aria-hidden="true">
	<Glyph name={materialIcons[name] ?? 'info'} {size} />
</span>
