<script lang="ts">
	import Icon from './Icon.svelte';
	import type { IconName } from './icons';
	import { toneStyle, type Tone } from './tone';

	// Status as a word with its icon, never colour alone; icon replaces the tone's own one
	let {
		tone = 'neutral',
		label,
		icon,
		testid
	}: { tone?: Tone; label: string; icon?: IconName; testid?: string } = $props();
	const style = $derived(toneStyle[tone]);
</script>

<span
	class="inline-flex items-center gap-1 whitespace-nowrap rounded-control border px-2 py-1 text-sm font-semibold {style.box} {style.text}"
	data-testid={testid}
>
	<Icon name={icon ?? style.icon} size={16} />
	{label}
</span>
