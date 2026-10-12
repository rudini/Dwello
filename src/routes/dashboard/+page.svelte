<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Icon from '$lib/ui/Icon.svelte';
	import PageHeader from '$lib/ui/PageHeader.svelte';
	import type { IconName } from '$lib/ui/icons';
	import BuildingFigures from './BuildingFigures.svelte';
	import DeadlineList from './DeadlineList.svelte';
	import TaskList from './TaskList.svelte';
	import type { OverviewData } from './+page.server';

	// What to do now first, then the dates ahead, then the state of the buildings
	let { data }: { data: OverviewData } = $props();

	const quickActions: { label: string; href: string; icon: IconName }[] = [
		{ label: m.dashboard_add_tenant(), href: '/tenants/new', icon: 'user-add' },
		{ label: m.dashboard_add_contract(), href: '/contracts/new', icon: 'contract' },
		{ label: m.dashboard_add_invoice(), href: '/invoices/new', icon: 'invoice' },
		{ label: m.dashboard_create_statements(), href: '/statements/generate', icon: 'statement' }
	];
</script>

<svelte:head>
	<title>{m.nav_overview()} - Dwello</title>
</svelte:head>

<div class="flex flex-col gap-10">
	<PageHeader title={m.nav_overview()} purpose={m.dashboard_purpose()} />
	<TaskList tasks={data.tasks} />
	<DeadlineList deadlines={data.deadlines} />

	<section aria-labelledby="quick-heading" class="flex flex-col gap-4">
		<h2 id="quick-heading" class="text-2xl font-bold text-ink">{m.dashboard_quick_heading()}</h2>
		<ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{#each quickActions as action (action.href)}
				<li>
					<a
						href={action.href}
						data-testid="quick-action"
						class="flex h-full min-h-12 items-center gap-4 rounded-panel border border-line bg-surface p-4 font-semibold text-accent hover:bg-accent-soft"
					>
						<Icon name={action.icon} size={24} />
						{action.label}
					</a>
				</li>
			{/each}
		</ul>
	</section>

	<BuildingFigures {data} />
</div>
