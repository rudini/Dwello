<script lang="ts">
	import Icon from './Icon.svelte';
	import { toneStyle, type Tone } from './tone';

	// Status as a word with its icon, never colour alone
	let {
		tone = 'neutral',
		label,
		testid
	}: { tone?: Tone; label: string; testid?: string } = $props();
	const style = $derived(toneStyle[tone]);
</script>

<span
	class="inline-flex items-center gap-1 whitespace-nowrap rounded-control border px-2 py-1 text-sm font-semibold {style.box} {style.text}"
	data-testid={testid}
>
	<Icon name={style.icon} size={16} />
	{label}
</span>
