<script lang="ts">
	import EmptyState from '$lib/ui/EmptyState.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Panel from '$lib/ui/Panel.svelte';
</script>

<svelte:head>
	<title>Analytics - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8">
	<PageHeader title="Analytics" purpose="Auswertungen zu Einnahmen und Kosten Ihrer Gebäude." />
	<Panel>
		<EmptyState
			testid="coming-soon"
			illustration="meter"
			title="Analytics kommt in Phase 2"
			text="Auswertungen zu Einnahmen, Kosten nach Kategorie und Prognosen sind für eine spätere Version geplant. Fristen und Zahlen zu Ihren Gebäuden finden Sie schon heute in der Übersicht."
			actionLabel="Zur Übersicht"
			actionHref="/dashboard"
		/>
	</Panel>
</div>
