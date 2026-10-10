<script lang="ts">
	import EmptyState from '$lib/ui/EmptyState.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Panel from '$lib/ui/Panel.svelte';
</script>

<svelte:head>
	<title>Berichte - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8">
	<PageHeader title="Berichte" purpose="Jahresberichte und Exporte zu Ihren Gebäuden." />
	<Panel>
		<EmptyState
			testid="coming-soon"
			illustration="statement"
			title="Berichte kommen in Phase 2"
			text="Jahresberichte und Exporte als Excel oder PDF sind für eine spätere Version geplant. Fristen und Zahlen zu Ihren Gebäuden finden Sie schon heute in der Übersicht."
			actionLabel="Zur Übersicht"
			actionHref="/dashboard"
		/>
	</Panel>
</div>
