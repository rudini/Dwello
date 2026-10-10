<script lang="ts">
	import Icon from '$lib/ui/Icon.svelte';
	import type { IconName } from '$lib/ui/icons';
	import Panel from '$lib/ui/Panel.svelte';

	// The master data pages, named and ordered as in the main navigation
	const links: { key: string; href: string; label: string; text: string; icon: IconName }[] = [
		{
			key: 'categories',
			href: '/config/categories',
			label: 'Kategorien',
			text: 'Kostenarten, nach denen Sie Rechnungen einordnen',
			icon: 'category'
		},
		{
			key: 'distribution-keys',
			href: '/config/distribution-keys',
			label: 'Verteilschlüssel',
			text: 'Wie die Kosten auf die Wohnungen aufgeteilt werden',
			icon: 'sliders'
		},
		{
			key: 'heating-profiles',
			href: '/config/heating-profiles',
			label: 'Heizprofile',
			text: 'Wie die Heizkosten auf die Monate verteilt werden',
			icon: 'heating'
		}
	];
</script>

<Panel title="Stammdaten">
	<ul class="grid gap-4 md:grid-cols-3" data-testid="quick-links">
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
						class="font-semibold text-accent underline underline-offset-4 after:absolute after:inset-0"
						>{link.label}</a
					>
					<p class="text-ink-muted">{link.text}</p>
				</div>
			</li>
		{/each}
	</ul>
</Panel>
