<script lang="ts">
	import Icon from './Icon.svelte';

	interface BreadcrumbItem {
		label: string;
		href?: string;
	}

	interface Props {
		items: BreadcrumbItem[];
		class?: string;
	}

	let { items, class: className = '' }: Props = $props();
</script>

<nav class="flex items-center text-sm text-gray-500 {className}" aria-label="Breadcrumb">
	{#each items as item, index}
		{#if index > 0}
			<Icon name="chevron_right" size={16} class="mx-2 text-gray-400" />
		{/if}

		{#if item.href && index < items.length - 1}
			<a href={item.href} class="hover:text-primary transition-colors">
				{item.label}
			</a>
		{:else}
			<span class={index === items.length - 1 ? 'text-gray-900 font-medium' : ''}>
				{item.label}
			</span>
		{/if}
	{/each}
</nav>
