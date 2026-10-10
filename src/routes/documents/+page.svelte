<script lang="ts">
	import type { StatementDocument } from '$lib/types';
	import Alert from '$lib/ui/Alert.svelte';
	import EmptyState from '$lib/ui/EmptyState.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import DocumentItem from './DocumentItem.svelte';
	import MarkSentButton from './MarkSentButton.svelte';
	import type { ActionData } from './$types';

	let {
		data,
		form
	}: { data: { documents: StatementDocument[]; status: string | null }; form: ActionData } =
		$props();

	const filters = $derived([
		{ href: '/documents', label: 'Alle', testid: 'documents-filter-all', active: !data.status },
		{
			href: '/documents?status=to_send',
			label: 'Zu versenden',
			testid: 'documents-filter-to-send',
			active: data.status === 'to_send'
		}
	]);
</script>

<svelte:head>
	<title>Dokumente - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8">
	<PageHeader
		title="Dokumente"
		purpose="Mahnungen und andere Schreiben an Mieter. Drucken Sie Briefe, die noch zu versenden sind, schicken Sie sie per Post und markieren Sie sie dann als versendet."
	/>

	<nav aria-label="Dokumente filtern">
		<ul class="flex flex-wrap gap-4">
			{#each filters as filter (filter.testid)}
				<li>
					<a
						href={filter.href}
						aria-current={filter.active ? 'page' : undefined}
						class="inline-flex min-h-12 items-center rounded-control border-2 px-6 font-semibold {filter.active
							? 'border-accent bg-accent-soft text-accent-strong'
							: 'border-line-strong bg-surface text-accent hover:bg-accent-soft'}"
						data-testid={filter.testid}>{filter.label}</a
					>
				</li>
			{/each}
		</ul>
	</nav>

	{#if form?.actionError}
		<Alert tone="critical" title="Nicht gespeichert">
			<p data-testid="form-error">{form.actionError}</p>
		</Alert>
	{/if}

	{#if data.documents.length}
		<ul class="divide-y divide-line rounded-panel border border-line bg-surface px-6">
			{#each data.documents as document (document.id)}
				<DocumentItem {document} showTenant>
					<MarkSentButton {document} />
				</DocumentItem>
			{/each}
		</ul>
	{:else}
		<div data-testid="documents-empty">
			<EmptyState
				illustration="envelope"
				title={data.status ? 'Keine Briefe zu versenden' : 'Noch keine Dokumente'}
				text="Mahnungen, die Sie bei einer Nebenkostenabrechnung senden, erscheinen hier."
				actionLabel="Zu den Nebenkostenabrechnungen"
				actionHref="/statements"
			/>
		</div>
	{/if}
</div>
