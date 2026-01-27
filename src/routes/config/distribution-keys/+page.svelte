<script lang="ts">
	import type { DistributionKey } from '$lib/types';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Card from '$lib/components/Card.svelte';
	import Badge from '$lib/components/Badge.svelte';

	interface PageData {
		keys: DistributionKey[];
		total: number;
	}

	let { data }: { data: PageData } = $props();

	const formulaVariables = [
		{ name: '{area}', description: 'Wohnfläche in m²' },
		{ name: '{rooms}', description: 'Anzahl Zimmer' },
		{ name: '{persons}', description: 'Anzahl Personen' },
		{ name: '{volume}', description: 'Raumvolumen in m³' },
		{ name: '{units}', description: 'Anzahl Einheiten (immer 1)' }
	];
</script>

<svelte:head>
	<title>Verteilschlüssel - Dwello</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div class="flex items-center gap-4">
			<a
				href="/config"
				class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
			>
				<Icon name="arrow_back" size={20} />
			</a>
			<div>
				<h1 class="text-2xl font-bold text-gray-900">Verteilschlüssel</h1>
				<p class="text-gray-500 mt-1">{data.total} Schlüssel verfügbar</p>
			</div>
		</div>
		<Button href="/config/distribution-keys/new" variant="primary">
			<Icon name="add" size={20} />
			Neuer Schlüssel
		</Button>
	</div>

	<!-- Info Card -->
	<Card>
		<div class="flex items-start gap-3">
			<Icon name="info" size={24} class="text-blue-500 flex-shrink-0" />
			<div>
				<h3 class="font-medium text-gray-900 mb-1">Verteilschlüssel für Nebenkosten</h3>
				<p class="text-sm text-gray-600 mb-3">
					Verteilschlüssel bestimmen, wie Kosten auf die einzelnen Wohnungen aufgeteilt werden.
					Sie können vordefinierte Schlüssel verwenden oder eigene mit Formeln erstellen.
				</p>
				<div class="flex flex-wrap gap-2">
					{#each formulaVariables as variable}
						<span class="inline-flex items-center px-2 py-1 bg-gray-100 rounded text-xs font-mono">
							{variable.name}
							<span class="ml-1 text-gray-500 font-sans">= {variable.description}</span>
						</span>
					{/each}
				</div>
			</div>
		</div>
	</Card>

	<!-- Keys List -->
	<Card padding={false}>
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-gray-50 border-b border-gray-200">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
							Name
						</th>
						<th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
							Formel
						</th>
						<th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
							Typ
						</th>
						<th class="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
							Status
						</th>
						<th class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
							Aktionen
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200">
					{#each data.keys as key}
						<tr class="hover:bg-gray-50 transition-colors">
							<td class="px-6 py-4">
								<div class="font-medium text-gray-900">{key.name}</div>
								{#if key.description}
									<div class="text-sm text-gray-500">{key.description}</div>
								{/if}
							</td>
							<td class="px-6 py-4">
								{#if key.formula}
									<code class="px-2 py-1 bg-gray-100 rounded text-sm font-mono text-purple-700">
										{key.formula}
									</code>
								{:else}
									<span class="text-sm text-gray-400">Gleichverteilung</span>
								{/if}
							</td>
							<td class="px-6 py-4">
								{#if key.type === 'predefined'}
									<Badge variant="info" size="sm">Vordefiniert</Badge>
								{:else}
									<Badge variant="primary" size="sm">Benutzerdefiniert</Badge>
								{/if}
							</td>
							<td class="px-6 py-4 text-center">
								{#if key.isActive}
									<Badge variant="success" size="sm">Aktiv</Badge>
								{:else}
									<Badge variant="default" size="sm">Inaktiv</Badge>
								{/if}
							</td>
							<td class="px-6 py-4 text-right">
								<div class="flex items-center justify-end gap-2">
									{#if key.type === 'custom'}
										<a
											href="/config/distribution-keys/{key.id}/edit"
											class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
											title="Bearbeiten"
										>
											<Icon name="edit" size={18} />
										</a>
									{/if}
									<a
										href="/config/distribution-keys/{key.id}"
										class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
										title="Details anzeigen"
									>
										<Icon name="visibility" size={18} />
									</a>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</Card>

	<!-- Formula Examples -->
	<Card>
		<h2 class="text-lg font-semibold text-gray-900 mb-4">Formel-Beispiele</h2>
		<div class="space-y-3">
			<div class="p-3 bg-gray-50 rounded-lg">
				<code class="text-sm font-mono text-purple-700">{'{area}'}</code>
				<p class="text-sm text-gray-600 mt-1">
					Einfache Verteilung nach Wohnfläche. Eine 100m² Wohnung zahlt doppelt so viel wie eine 50m² Wohnung.
				</p>
			</div>
			<div class="p-3 bg-gray-50 rounded-lg">
				<code class="text-sm font-mono text-purple-700">{'{area} * 0.7 + {rooms} * 0.3'}</code>
				<p class="text-sm text-gray-600 mt-1">
					Gewichtete Kombination: 70% nach Fläche, 30% nach Zimmerzahl. Ideal für Heizkosten.
				</p>
			</div>
			<div class="p-3 bg-gray-50 rounded-lg">
				<code class="text-sm font-mono text-purple-700">{'{persons}'}</code>
				<p class="text-sm text-gray-600 mt-1">
					Verteilung nach Personenanzahl. Geeignet für Wasserkosten oder Kehricht.
				</p>
			</div>
			<div class="p-3 bg-gray-50 rounded-lg">
				<code class="text-sm font-mono text-purple-700">{'{area} * 0.5 + {persons} * 0.5'}</code>
				<p class="text-sm text-gray-600 mt-1">
					Halb Fläche, halb Personen. Kompromiss zwischen verbrauchsabhängig und flächenbasiert.
				</p>
			</div>
		</div>
	</Card>
</div>
