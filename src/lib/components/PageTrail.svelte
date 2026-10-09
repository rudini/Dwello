<script lang="ts">
	import Icon from './Icon.svelte';

	// Links to the parent pages, then the current page
	let { links, current }: { links: { href: string; label: string }[]; current: string } = $props();
</script>

<nav class="flex items-center text-sm text-ink-muted">
	{#each links as link (link.href)}
		<a href={link.href} data-testid="breadcrumb-link" class="hover:text-primary transition-colors"
			>{link.label}</a
		>
		<Icon name="chevron_right" size={16} class="mx-2" />
	{/each}
	<span class="text-gray-900 font-medium">{current}</span>
</nav>
