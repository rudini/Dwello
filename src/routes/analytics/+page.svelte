<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import EmptyState from '$lib/ui/EmptyState.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import Panel from '$lib/ui/Panel.svelte';
</script>

<svelte:head>
	<title>{m.analytics_title()} - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8">
	<PageHeader title={m.analytics_title()} purpose={m.analytics_purpose()} />
	<Panel>
		<EmptyState
			testid="coming-soon"
			illustration="meter"
			title={m.analytics_soon()}
			text={m.analytics_soon_text()}
			actionLabel={m.error_to_overview()}
			actionHref="/dashboard"
		/>
	</Panel>
</div>
