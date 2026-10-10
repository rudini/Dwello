<script lang="ts">
	import type { StatementDocument } from '$lib/types';
	import Panel from '$lib/ui/Panel.svelte';
	import DocumentItem from '../../documents/DocumentItem.svelte';

	let { reminders }: { reminders: StatementDocument[] } = $props();
</script>

{#if reminders.length > 0}
	<Panel title="Mahnungen">
		<ul class="divide-y divide-line">
			{#each reminders as reminder (reminder.id)}
				<DocumentItem document={reminder} />
			{/each}
		</ul>
	</Panel>
{/if}
