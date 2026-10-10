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
							class="inline-flex min-h-12 items-center text-accent underline underline-offset-4 hover:text-accent-strong"
							data-testid="breadcrumb-link">{link.label}</a
						>
						<Icon name="chevron-right" size={16} />
					</li>
				{/each}
				<li aria-current="page" class="text-ink">{title}</li>
			</ol>
		</nav>
	{/if}
	<div class="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-end md:justify-between">
		<!-- From md the title keeps at least 18rem and the actions wrap below it instead of squeezing it -->
		<div class="flex min-w-0 flex-col gap-2 md:grow md:basis-72">
			<!-- Focusable from script: after an action removes the focused button, focus returns here.
			     Long German words hyphenate (lang="de" in app.html) instead of widening the page -->
			<h1 tabindex="-1" class="hyphens-auto break-words text-3xl font-bold leading-tight text-ink">
				{title}
			</h1>
			{#if purpose}<p class="max-w-prose text-lg text-ink-muted">{purpose}</p>{/if}
		</div>
		{#if action}<div class="flex flex-wrap gap-4">{@render action()}</div>{/if}
	</div>
</header>
