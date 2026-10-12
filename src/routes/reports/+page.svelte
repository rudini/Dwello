<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import EmptyState from '$lib/ui/EmptyState.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Panel from '$lib/ui/Panel.svelte';
</script>

<svelte:head>
	<title>{m.reports_title()} - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8">
	<PageHeader title={m.reports_title()} purpose={m.reports_purpose()} />
	<Panel>
		<EmptyState
			testid="coming-soon"
			illustration="statement"
			title={m.reports_soon()}
			text={m.reports_soon_text()}
			actionLabel={m.error_to_overview()}
			actionHref="/dashboard"
		/>
	</Panel>
</div>
