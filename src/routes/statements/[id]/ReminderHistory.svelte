<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import DocumentRow from '$lib/components/DocumentRow.svelte';
	import type { StatementDocument } from '$lib/types';

	let { reminders }: { reminders: StatementDocument[] } = $props();
</script>

{#if reminders.length > 0}
	<Card>
		<h2 class="text-lg font-semibold text-gray-900 mb-4">Mahnungen</h2>
		<ul class="divide-y divide-gray-100">
			{#each reminders as reminder (reminder.id)}
				<DocumentRow document={reminder} />
			{/each}
		</ul>
	</Card>
{/if}
