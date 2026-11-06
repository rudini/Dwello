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
		testid,
		titleId,
		element = $bindable()
	}: {
		tone?: Exclude<Tone, 'neutral'>;
		title: string;
		children?: Snippet;
		action?: Snippet;
		testid?: string;
		titleId?: string; // to name the title in a field's description (#665)
		element?: HTMLElement; // to move the focus to the message
	} = $props();
	const style = $derived(toneStyle[tone]);
</script>

<div
	bind:this={element}
	class="flex gap-4 rounded-control border-l-4 p-4 text-ink {style.box}"
	role={tone === 'critical' ? 'alert' : undefined}
	tabindex="-1"
	data-testid={testid}
	data-tone={tone}
>
	<span class={style.text}><Icon name={style.icon} size={24} /></span>
	<div class="flex min-w-0 flex-col gap-2">
		<p id={titleId} class="font-semibold {style.text}">{title}</p>
		{#if children}{@render children()}{/if}
		{#if action}<div>{@render action()}</div>{/if}
	</div>
</div>
