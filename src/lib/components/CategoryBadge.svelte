<script lang="ts">
	import type { Category } from '$lib/types';
	import Icon from './Icon.svelte';

	interface Props {
		category: Category | null;
		showValidity?: boolean;
		size?: 'sm' | 'md';
		class?: string;
	}

	let { category, showValidity = true, size = 'md', class: className = '' }: Props = $props();

	const sizeClasses = {
		sm: 'px-2 py-0.5 text-xs gap-1',
		md: 'px-2.5 py-1 text-sm gap-1.5'
	};

	const iconSizes = {
		sm: 12,
		md: 14
	};

	const baseClasses = $derived(
		`inline-flex items-center rounded-full font-medium ${sizeClasses[size]} ${className}`
	);

	const categoryClasses = $derived.by(() => {
		if (!category) {
			return 'bg-gray-100 text-gray-500';
		}
		return category.isAllowedUtilityCost
			? 'bg-blue-100 text-blue-700'
			: 'bg-amber-100 text-amber-700';
	});
</script>

{#if category}
	<span class="{baseClasses} {categoryClasses}">
		{category.name}
		{#if showValidity}
			{#if category.isAllowedUtilityCost}
				<Icon name="check_circle" size={iconSizes[size]} class="text-blue-500" />
			{:else}
				<Icon name="warning" size={iconSizes[size]} class="text-amber-500" />
			{/if}
		{/if}
	</span>
{:else}
	<span class="{baseClasses} {categoryClasses}">
		Nicht kategorisiert
	</span>
{/if}
