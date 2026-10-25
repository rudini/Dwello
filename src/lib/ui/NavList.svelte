<script lang="ts">
	import { page } from '$app/stores';
	import { activeHref } from './navigation';
	import Icon from './Icon.svelte';
	import type { IconName } from './icons';

	type Item = { label: string; href: string; icon: IconName };

	// Main menu, one level: group headings are labels, the current page is marked
	let {
		groups,
		onnavigate
	}: { groups: { label: string; items: Item[] }[]; onnavigate?: () => void } = $props();
</script>

<div class="flex flex-col gap-6">
	{#each groups as group (group.label)}
		<div class="flex flex-col gap-1">
			{#if group.label}<p class="px-4 text-sm font-semibold text-ink-muted">{group.label}</p>{/if}
			<ul class="flex flex-col gap-1">
				{#each group.items as item (item.href)}
					{@const active = item.href === activeHref($page.url.pathname)}
					<li>
						<a
							href={item.href}
							onclick={onnavigate}
							aria-current={active ? 'page' : undefined}
							data-testid="main-nav-link"
							class="flex min-h-12 items-center gap-4 rounded-control border-l-4 px-4 font-semibold {active
								? 'border-accent bg-accent-soft text-accent-strong'
								: 'border-transparent text-ink hover:bg-sunken'}"
						>
							<Icon name={item.icon} size={24} />
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/each}
</div>
