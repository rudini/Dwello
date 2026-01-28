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
	}

	let {
		label,
		value,
		icon,
		iconColor = 'text-blue-600',
		trend,
		href,
		class: className = ''
	}: Props = $props();

	const trendConfig = $derived(() => {
		if (!trend) return null;
		switch (trend.direction) {
			case 'up':
				return {
					icon: 'trending_up',
					color: 'text-green-600',
					bgColor: 'bg-green-50'
				};
			case 'down':
				return {
					icon: 'trending_down',
					color: 'text-red-600',
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

{#if href}
	<a
		{href}
		class="block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-gray-300 transition-all {className}"
	>
		<div class="flex items-start justify-between">
			<div>
				<p class="text-sm font-medium text-gray-500">{label}</p>
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
				<div class="p-3 bg-gray-50 rounded-lg">
					<Icon name={icon} size={24} class={iconColor} />
				</div>
			{/if}
		</div>
	</a>
{:else}
	<div
		class="bg-white border border-gray-200 rounded-xl p-6 {className}"
	>
		<div class="flex items-start justify-between">
			<div>
				<p class="text-sm font-medium text-gray-500">{label}</p>
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
				<div class="p-3 bg-gray-50 rounded-lg">
					<Icon name={icon} size={24} class={iconColor} />
				</div>
			{/if}
		</div>
	</div>
{/if}
