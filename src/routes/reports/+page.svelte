<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import Icon from '$lib/components/Icon.svelte';
</script>

<svelte:head>
	<title>Berichte - Dwello</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div>
		<h1 class="text-2xl font-bold text-gray-900">Berichte</h1>
		<p class="text-ink-muted mt-1">Berichte und Dokumente generieren</p>
	</div>

	<!-- Coming Soon Card -->
	<Card>
		<div class="text-center py-16">
			<div
				class="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-6"
			>
				<Icon name="summarize" size={40} class="text-purple-600" />
			</div>
			<h2 class="text-xl font-semibold text-gray-900 mb-2" data-testid="coming-soon-title">
				Berichte kommen in Phase 2
			</h2>
			<p class="text-ink-muted max-w-md mx-auto mb-8">
				Automatische Berichterstellung und Export-Funktionen werden in der nächsten Version
				verfügbar sein.
			</p>

			<div class="grid gap-4 sm:grid-cols-3 max-w-2xl mx-auto">
				<div class="p-4 bg-gray-50 rounded-lg">
					<Icon name="description" size={24} class="text-ink-muted mb-2" />
					<p class="font-medium text-gray-700">Jahresberichte</p>
					<p class="text-sm text-ink-muted">Jährliche Übersicht</p>
				</div>
				<div class="p-4 bg-gray-50 rounded-lg">
					<Icon name="table_chart" size={24} class="text-ink-muted mb-2" />
					<p class="font-medium text-gray-700">Export</p>
					<p class="text-sm text-ink-muted">Excel & PDF</p>
				</div>
				<div class="p-4 bg-gray-50 rounded-lg">
					<Icon name="schedule_send" size={24} class="text-ink-muted mb-2" />
					<p class="font-medium text-gray-700">Automatisierung</p>
					<p class="text-sm text-ink-muted">Geplante Berichte</p>
				</div>
			</div>
		</div>
	</Card>
</div>
