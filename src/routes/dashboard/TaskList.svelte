<script lang="ts">
	import EmptyState from '$lib/ui/EmptyState.svelte';
	import Panel from '$lib/ui/Panel.svelte';
	import type { Task } from '$lib/overview';
	import TaskCard from './TaskCard.svelte';

	// The work of today, in order; the first task is the one main action of the overview
	let { tasks }: { tasks: Task[] } = $props();
</script>

<section aria-labelledby="tasks-heading" class="flex flex-col gap-4">
	<h2 id="tasks-heading" class="text-2xl font-bold text-ink">Als Nächstes zu tun</h2>
	{#if tasks.length}
		<ol class="flex flex-col gap-4">
			{#each tasks as task, i (task.id)}
				<TaskCard {task} next={i === 0} />
			{/each}
		</ol>
	{:else}
		<Panel>
			<EmptyState
				title="Alles erledigt"
				text="Im Moment ist nichts zu tun. Neue Aufgaben erscheinen hier, sobald Abrechnungen bereitstehen oder Fristen näher rücken."
				illustration="done"
			/>
		</Panel>
	{/if}
</section>
