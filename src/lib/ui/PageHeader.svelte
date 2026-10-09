<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from './Icon.svelte';

	// Where am I (trail, title), what is this page for, and its one main action
	let {
		title,
		purpose,
		trail = [],
		action
	}: {
		title: string;
		purpose?: string;
		trail?: { href: string; label: string }[];
		action?: Snippet;
	} = $props();
</script>

<header class="flex flex-col gap-4">
	{#if trail.length}
		<nav aria-label="Brotkrümelnavigation">
			<ol class="flex flex-wrap items-center gap-2 text-ink-muted">
				{#each trail as link (link.href)}
					<li class="flex items-center gap-2">
						<a
							href={link.href}
							class="text-accent underline underline-offset-4 hover:text-accent-strong"
							data-testid="breadcrumb-link">{link.label}</a
						>
						<Icon name="chevron-right" size={16} />
					</li>
				{/each}
				<li aria-current="page" class="text-ink">{title}</li>
			</ol>
		</nav>
	{/if}
	<div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
		<div class="flex flex-col gap-2">
			<h1 class="text-3xl font-bold leading-tight text-ink">{title}</h1>
			{#if purpose}<p class="max-w-prose text-lg text-ink-muted">{purpose}</p>{/if}
		</div>
		{#if action}<div class="flex shrink-0 flex-wrap gap-4">{@render action()}</div>{/if}
	</div>
</header>
