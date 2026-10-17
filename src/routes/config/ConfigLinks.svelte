<script lang="ts">
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
		testid?: string;
	};

	// The master data pages, named and ordered as in the main navigation; the Protokoll (#357) on its own
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
		title = m.settings_master_data(),
		testid = 'quick-links',
		links = masterData()
	}: { title?: string; testid?: string; links?: Link[] } = $props();
</script>

<Panel {title}>
	<ul class="grid gap-4 md:grid-cols-3" data-testid={testid}>
		{#each links as link (link.key)}
			<!-- The whole card opens the page; its name is the link -->
			<li
				class="relative flex items-start gap-4 rounded-panel border border-line p-4 hover:border-line-strong"
				data-testid="quick-link-{link.key}"
			>
				<span class="text-accent"><Icon name={link.icon} size={24} /></span>
				<div class="flex flex-col gap-1">
					<a
						href={link.href}
						data-testid={link.testid}
						class="font-semibold text-accent underline underline-offset-4 after:absolute after:inset-0"
						>{link.label}</a
					>
					<p class="text-ink-muted">{link.text}</p>
				</div>
			</li>
		{/each}
	</ul>
</Panel>
