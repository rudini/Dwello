<script lang="ts">
	import Button from '$lib/ui/Button.svelte';
	import Icon from '$lib/ui/Icon.svelte';
	import Illustration from '$lib/ui/Illustration.svelte';
	import type { Task } from '$lib/overview';

	// One task: what, why, and the way there; the next step is highlighted and holds the main action
	let { task, next }: { task: Task; next: boolean } = $props();
</script>

<li
	class="flex flex-col gap-4 rounded-panel border bg-surface p-6 md:flex-row md:items-center {next
		? 'border-accent'
		: 'border-line'}"
	data-testid="overview-task"
>
	{#if task.illustration}
		<Illustration name={task.illustration} />
	{:else}
		<span class="text-accent"><Icon name={task.icon} size={32} /></span>
	{/if}
	<div class="flex flex-1 flex-col gap-1">
		{#if next}<p class="font-semibold text-accent">Nächster Schritt</p>{/if}
		<h3 class="text-xl font-bold text-ink">{task.title}</h3>
		<p class="text-ink-muted">{task.text}</p>
		{#if task.link}
			<a
				href={task.link.href}
				class="inline-flex min-h-12 items-center self-start text-accent underline underline-offset-4 hover:text-accent-strong"
				data-testid="overview-task-link">{task.link.label}</a
			>
		{/if}
	</div>
	<Button variant={next ? 'primary' : 'secondary'} href={task.href}>{task.action}</Button>
</li>
