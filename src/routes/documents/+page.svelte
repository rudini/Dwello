<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import FieldError from '$lib/components/FieldError.svelte';
	import DocumentRow from '$lib/components/DocumentRow.svelte';
	import MarkSentButton from './MarkSentButton.svelte';
	import type { StatementDocument } from '$lib/types';
	import type { ActionData } from './$types';

	let {
		data,
		form
	}: { data: { documents: StatementDocument[]; status: string | null }; form: ActionData } =
		$props();

	const filterClass = (active: boolean) =>
		`px-3 py-1.5 rounded-lg text-sm font-medium ${active ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`;
</script>

<svelte:head>
	<title>Dokumente - Dwello</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<h1 class="text-2xl font-bold text-gray-900">Dokumente</h1>
		<p class="text-ink-muted mt-1">
			Mahnungen und andere Schreiben an Mieter. Briefe „zu versenden“ ausdrucken, verschicken und
			als versendet markieren.
		</p>
	</div>

	<nav class="flex gap-2">
		<a href="/documents" class={filterClass(!data.status)} data-testid="documents-filter-all"
			>Alle</a
		>
		<a
			href="/documents?status=to_send"
			class={filterClass(data.status === 'to_send')}
			data-testid="documents-filter-to-send">Zu versenden</a
		>
	</nav>

	<FieldError message={form?.actionError} />

	<Card>
		<ul class="divide-y divide-gray-100">
			{#each data.documents as document (document.id)}
				<DocumentRow {document} showTenant>
					<MarkSentButton {document} />
				</DocumentRow>
			{:else}
				<li class="text-ink-muted" data-testid="documents-empty">Keine Dokumente vorhanden.</li>
			{/each}
		</ul>
	</Card>
</div>
