<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from './Icon.svelte';
	import Button from './Button.svelte';

	interface Props {
		icon?: string;
		title: string;
		description?: string;
		actionLabel?: string;
		actionHref?: string;
		onaction?: () => void;
		class?: string;
		children?: Snippet;
	}

	let {
		icon = 'inbox',
		title,
		description = '',
		actionLabel = '',
		actionHref = '',
		onaction,
		class: className = '',
		children
	}: Props = $props();
</script>

<div class="flex flex-col items-center justify-center py-12 px-4 text-center {className}">
	<div class="size-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
		<Icon name={icon} size={32} class="text-gray-400" />
	</div>

	<h3 class="text-lg font-semibold text-gray-900 mb-1">{title}</h3>

	{#if description}
		<p class="text-gray-500 max-w-sm mb-6">{description}</p>
	{/if}

	{#if children}
		<div class="mb-6">
			{@render children()}
		</div>
	{/if}

	{#if actionLabel}
		{#if actionHref}
			<Button href={actionHref}>
				<Icon name="add" size={18} />
				{actionLabel}
			</Button>
		{:else if onaction}
			<Button onclick={onaction}>
				<Icon name="add" size={18} />
				{actionLabel}
			</Button>
		{/if}
	{/if}
</div>
