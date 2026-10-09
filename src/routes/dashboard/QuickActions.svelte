<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';

	const actions = [
		{
			href: '/buildings/new',
			label: 'Gebäude hinzufügen',
			hint: 'Neues Gebäude erfassen',
			icon: 'add_business',
			tone: 'bg-blue-100 text-accent'
		},
		{
			href: '/tenants/new',
			label: 'Mieter hinzufügen',
			hint: 'Neuen Mieter erfassen',
			icon: 'person_add',
			tone: 'bg-green-100 text-positive'
		},
		{
			href: '/invoices/new',
			label: 'Rechnung erfassen',
			hint: 'Neue Rechnung hinzufügen',
			icon: 'receipt',
			tone: 'bg-purple-100 text-purple-600'
		},
		{
			href: '/statements/generate',
			label: 'Abrechnungen erstellen',
			hint: 'Neue NK-Abrechnungen',
			icon: 'calculate',
			tone: 'bg-orange-100 text-caution'
		}
	];
</script>

<div data-testid="quick-actions">
	<h2 class="text-lg font-semibold text-gray-900 mb-4">Schnellaktionen</h2>
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		{#each actions as action (action.href)}
			<a
				href={action.href}
				data-testid="quick-action"
				class="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-primary/40 hover:shadow-md transition-all"
			>
				<div class="p-2 rounded-lg {action.tone}">
					<Icon name={action.icon} size={24} />
				</div>
				<div>
					<p class="font-medium text-gray-900">{action.label}</p>
					<p class="text-sm text-ink-muted">{action.hint}</p>
				</div>
			</a>
		{/each}
	</div>
</div>
