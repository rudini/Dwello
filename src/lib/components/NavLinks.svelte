<script lang="ts">
	import { page } from '$app/stores';
	import { isActive, navGroups } from '$lib/navigation';
	import Icon from './Icon.svelte';

	// The grouped main menu; the sidebar and the mobile drawer only differ in their frame
	let { onnavigate }: { onnavigate?: () => void } = $props();
</script>

{#each navGroups as group (group.label)}
	<div class="mb-5">
		{#if group.label}
			<p class="px-3 mb-1.5 text-xs font-semibold uppercase tracking-wider text-ink-muted">
				{group.label}
			</p>
		{/if}
		<div class="space-y-0.5">
			{#each group.items as item (item.href)}
				{@const active = isActive(item.href, $page.url.pathname)}
				<a
					href={item.href}
					data-testid="main-nav-link"
					aria-current={active ? 'page' : undefined}
					onclick={onnavigate}
					class="flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors duration-150 {active
						? 'bg-primary/10 text-primary font-semibold'
						: 'text-gray-600 font-medium hover:bg-gray-100 hover:text-gray-900'}"
				>
					<Icon name={item.icon} size={20} />
					<span>{item.name}</span>
				</a>
			{/each}
		</div>
	</div>
{/each}
