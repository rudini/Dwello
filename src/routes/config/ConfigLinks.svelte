<script lang="ts">
	import type { Snippet } from 'svelte';
	import { m } from '$lib/paraglide/messages';
	import Icon from '$lib/ui/Icon.svelte';
	import type { IconName } from '$lib/ui/icons';
	import Panel from '$lib/ui/Panel.svelte';

	type Link = {
		key: string;
		href: string;
		label: string;
		text: string;
		icon: IconName;
		warnings?: string[]; // #1456: what the page behind the link still lacks
	};

	// #1456: one group of the overview «Einstellungen». By default the master data pages, named and ordered as in the
	// main navigation
	const masterData = (): Link[] => [
		{
			key: 'categories',
			href: '/config/categories',
			label: m.nav_categories(),
			text: m.settings_link_categories(),
			icon: 'category'
		},
		{
			key: 'distribution-keys',
			href: '/config/distribution-keys',
			label: m.nav_distribution_keys(),
			text: m.settings_link_keys(),
			icon: 'sliders'
		},
		{
			key: 'heating-profiles',
			href: '/config/heating-profiles',
			label: m.nav_heating_profiles(),
			text: m.settings_link_profiles(),
			icon: 'heating'
		}
	];

	let {
		title = m.settings_group_statement(),
		testid = 'quick-links',
		links = masterData(),
		children
	}: { title?: string; testid?: string; links?: Link[]; children?: Snippet } = $props();
</script>

<Panel {title} testid="settings-group">
	<ul class="grid gap-4 md:grid-cols-3" data-testid={testid}>
		{#each links as link (link.key)}
			<!-- The whole card opens the page; its name is the link -->
			<li
				class="relative flex items-start gap-4 rounded-panel border border-line p-4 hover:border-line-strong"
				data-testid="quick-link-{link.key}"
			>
				<span class="text-accent"><Icon name={link.icon} size={24} /></span>
				<!-- min-w-0 and break-words: a long word («Wiederherstellungscode») wraps at 150 % instead of leaving the card (persona helga-718c P-4) -->
				<div class="flex min-w-0 flex-col gap-1 break-words">
					<a
						href={link.href}
						class="font-semibold text-accent underline underline-offset-4 after:absolute after:inset-0"
						aria-describedby={[
							`${link.key}-text`,
							...(link.warnings ?? []).map((_, at) => `${link.key}-missing-${at}`)
						].join(' ')}
						data-testid="settings-entry-name">{link.label}</a
					>
					<p id="{link.key}-text" class="text-ink-muted">{link.text}</p>
					{#each link.warnings ?? [] as warning, at (warning)}
						<p
							id="{link.key}-missing-{at}"
							class="flex items-start gap-2 font-semibold text-critical"
							data-testid="{link.key}-missing"
						>
							<Icon name="warning" />
							{warning}
						</p>
					{/each}
				</div>
			</li>
		{/each}
	</ul>
	{@render children?.()}
</Panel>
