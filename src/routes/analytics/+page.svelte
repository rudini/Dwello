<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import Icon from '$lib/components/Icon.svelte';
</script>

<svelte:head>
	<title>Analytics - Dwello</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div>
		<h1 class="text-2xl font-bold text-gray-900">Analytics</h1>
		<p class="text-ink-muted mt-1">Detaillierte Auswertungen und Statistiken</p>
	</div>

	<!-- Coming Soon Card -->
	<Card>
		<div class="text-center py-16">
			<div class="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
				<Icon name="analytics" size={40} class="text-accent" />
			</div>
			<h2 class="text-xl font-semibold text-gray-900 mb-2" data-testid="coming-soon-title">
				Analytics kommt in Phase 2
			</h2>
			<p class="text-ink-muted max-w-md mx-auto mb-8">
				Detaillierte Auswertungen, Trends und Prognosen werden in der nächsten Version verfügbar
				sein.
			</p>

			<div class="grid gap-4 sm:grid-cols-3 max-w-2xl mx-auto">
				<div class="p-4 bg-gray-50 rounded-lg">
					<Icon name="trending_up" size={24} class="text-ink-muted mb-2" />
					<p class="font-medium text-gray-700">Einnahmentrends</p>
					<p class="text-sm text-ink-muted">Monatliche Entwicklung</p>
				</div>
				<div class="p-4 bg-gray-50 rounded-lg">
					<Icon name="bar_chart" size={24} class="text-ink-muted mb-2" />
					<p class="font-medium text-gray-700">Kostenanalyse</p>
					<p class="text-sm text-ink-muted">Nach Kategorie</p>
				</div>
				<div class="p-4 bg-gray-50 rounded-lg">
					<Icon name="timeline" size={24} class="text-ink-muted mb-2" />
					<p class="font-medium text-gray-700">Prognosen</p>
					<p class="text-sm text-ink-muted">Künftige Einnahmen</p>
				</div>
			</div>
		</div>
	</Card>
</div>
