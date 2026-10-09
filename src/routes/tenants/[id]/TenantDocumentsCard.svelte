<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import DocumentRow from '$lib/components/DocumentRow.svelte';
	import type { StatementDocument } from '$lib/types';

	let { documents }: { documents: StatementDocument[] } = $props();
</script>

<Card>
	<h2 class="text-lg font-semibold text-gray-900 mb-4">Dokumente</h2>
	<ul class="divide-y divide-gray-100" data-testid="tenant-documents">
		{#each documents as document (document.id)}
			<DocumentRow {document} />
		{:else}
			<li class="text-ink-muted">Noch keine Dokumente.</li>
		{/each}
	</ul>
</Card>
