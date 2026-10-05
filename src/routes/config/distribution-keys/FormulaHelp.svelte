<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import { FORMULA_VARIABLES } from '$lib/distribution-key';

	const examples = [
		{
			formula: '{area}',
			text: 'Nach Wohnfläche: eine 100 m² Wohnung zahlt doppelt so viel wie eine 50 m² Wohnung.'
		},
		{
			formula: '{area} * 0.7 + {rooms} * 0.3',
			text: '70 % nach Fläche, 30 % nach Zimmerzahl, z.B. für Heizkosten.'
		},
		{ formula: '{units}', text: 'Gleiche Anteile für alle Wohnungen, z.B. für Kabel-TV.' }
	];
</script>

<Card>
	<h2 class="text-lg font-semibold text-gray-900 mb-4">Formeln</h2>
	<div class="flex flex-wrap gap-2 mb-4">
		{#each FORMULA_VARIABLES as variable (variable.name)}
			<span class="inline-flex items-center px-2 py-1 bg-gray-100 rounded text-xs font-mono">
				{`{${variable.name}}`}
				<span class="ml-1 text-gray-500 font-sans">= {variable.description}</span>
			</span>
		{/each}
	</div>
	<div class="space-y-3">
		{#each examples as example (example.formula)}
			<div class="p-3 bg-gray-50 rounded-lg">
				<code class="text-sm font-mono text-purple-700">{example.formula}</code>
				<p class="text-sm text-gray-600 mt-1">{example.text}</p>
			</div>
		{/each}
	</div>
</Card>
