<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from './Icon.svelte';
	import { toneStyle, type Tone } from './tone';

	// Message with icon, title and text; errors are announced at once, the rest waits
	let {
		tone = 'info',
		title,
		children,
		action,
		testid
	}: {
		tone?: Exclude<Tone, 'neutral'>;
		title: string;
		children?: Snippet;
		action?: Snippet;
		testid?: string;
	} = $props();
	const style = $derived(toneStyle[tone]);
</script>

<div
	class="flex gap-4 rounded-control border-l-4 p-4 text-ink {style.box}"
	role={tone === 'critical' ? 'alert' : undefined}
	data-testid={testid}
>
	<span class={style.text}><Icon name={style.icon} size={24} /></span>
	<div class="flex min-w-0 flex-col gap-2">
		<p class="font-semibold {style.text}">{title}</p>
		{#if children}{@render children()}{/if}
		{#if action}<div>{@render action()}</div>{/if}
	</div>
</div>
