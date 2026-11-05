<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import CostReconciliation from '../CostReconciliation.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const title = $derived(data.title);
</script>

<svelte:head>
	<title>{title} - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-8">
	<PageHeader
		{title}
		purpose={m.reconciliation_help()}
		trail={[{ href: '/reports', label: m.reports_title() }]}
	/>
	<CostReconciliation
		reconciliation={data.reconciliation}
		caption={title}
		testid="report-reconciliation"
	/>
</div>
