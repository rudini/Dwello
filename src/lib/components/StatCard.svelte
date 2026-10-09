<script lang="ts">
	import Icon from './Icon.svelte';

	interface Props {
		label: string;
		value: string | number;
		icon?: string;
		iconColor?: string;
		trend?: {
			value: number;
			direction: 'up' | 'down' | 'neutral';
		};
		href?: string;
		class?: string;
		testId?: string;
	}

	let {
		label,
		value,
		icon,
		iconColor = 'text-accent',
		trend,
		href,
		class: className = '',
		testId
	}: Props = $props();

	// Generate testId from label if not provided
	const computedTestId = $derived(testId || `stat-${label.toLowerCase().replace(/\s+/g, '-')}`);

	const trendConfig = $derived(() => {
		if (!trend) return null;
		switch (trend.direction) {
			case 'up':
				return {
					icon: 'trending_up',
					color: 'text-positive',
					bgColor: 'bg-green-50'
				};
			case 'down':
				return {
					icon: 'trending_down',
					color: 'text-critical',
					bgColor: 'bg-red-50'
				};
			default:
				return {
					icon: 'trending_flat',
					color: 'text-gray-600',
					bgColor: 'bg-gray-50'
				};
		}
	});
</script>

<!-- A link when it opens a filtered list, a plain tile otherwise -->
<svelte:element
	this={href ? 'a' : 'div'}
	{href}
	data-testid={computedTestId}
	class="block bg-white border border-gray-200 rounded-xl p-5 {href
		? 'hover:shadow-md hover:border-primary/40 transition-all'
		: ''} {className}"
>
	<div class="flex items-start justify-between">
		<div>
			<p class="text-sm font-medium text-ink-muted">{label}</p>
			<p class="text-2xl font-bold text-gray-900 mt-1">{value}</p>
			{#if trend && trendConfig()}
				<div class="flex items-center gap-1 mt-2">
					<span
						class="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium {trendConfig()
							?.bgColor} {trendConfig()?.color}"
					>
						<Icon name={trendConfig()?.icon || ''} size={14} />
						{trend.value}%
					</span>
				</div>
			{/if}
		</div>
		{#if icon}
			<div class="p-2.5 bg-gray-50 rounded-lg">
				<Icon name={icon} size={24} class={iconColor} />
			</div>
		{/if}
	</div>
</svelte:element>
