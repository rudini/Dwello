<script lang="ts">
	import { BUILDING_TOTALS, FORMULA_VARIABLES } from '$lib/distribution-key';
	import Panel from '$lib/ui/Panel.svelte';

	// Examples whose explanation holds for the backend's calculation (share = value / sum of all values)
	const examples = [
		{ formula: '{area}', text: 'Nach Wohnfläche: 100 m² tragen doppelt so viel wie 50 m².' },
		{ formula: '{rooms}', text: 'Nach Zimmerzahl: 4 Zimmer tragen doppelt so viel wie 2 Zimmer.' },
		{ formula: '{units}', text: 'Zu gleichen Teilen, z. B. für den Kabelanschluss.' },
		{
			formula: '{area} + {rooms} * 10',
			text: 'Fläche und Zimmer zusammen: jedes Zimmer zählt wie 10 m² zusätzliche Fläche.'
		},
		{
			formula: '0.7 * {area} / {area_total} + 0.3 * {units} / {units_total}',
			text: 'Feste Teile: 70 % der Kosten nach Fläche, 30 % zu gleichen Teilen pro Wohnung.'
		}
	];
</script>

{#snippet variables(list: { name: string; description: string }[])}
	<dl class="flex flex-col gap-2">
		{#each list as variable (variable.name)}
			<div class="flex flex-wrap gap-x-4">
				<dt class="font-mono font-semibold text-ink">{`{${variable.name}}`}</dt>
				<dd class="text-ink-muted">{variable.description}</dd>
			</div>
		{/each}
	</dl>
{/snippet}

<Panel title="So funktioniert eine Formel">
	<p>
		Die Formel ergibt für jede Wohnung eine Zahl. Jede Wohnung trägt den Teil der Kosten, den ihre
		Zahl an der Summe aller Wohnungen ausmacht. Beispiel mit
		<code class="font-mono">{'{area}'}</code>: Wohnung A hat 50 m², Wohnung B 100 m², zusammen 150
		m². A trägt einen Drittel der Kosten, B zwei Drittel.
	</p>

	<h3 class="text-lg font-semibold text-ink">Bausteine</h3>
	{@render variables(FORMULA_VARIABLES)}

	<h3 class="text-lg font-semibold text-ink">Summen des Gebäudes</h3>
	<p>Für Schlüssel aus festen Teilen teilen Sie einen Baustein durch seine Summe.</p>
	{@render variables(BUILDING_TOTALS)}

	<h3 class="text-lg font-semibold text-ink">Rechnen</h3>
	<p>
		+ plus, - minus, * mal, / geteilt durch. Was in Klammern steht, wird zuerst gerechnet.
		Dezimalzahlen schreiben Sie mit Punkt, z. B. 0.5.
	</p>

	<h3 class="text-lg font-semibold text-ink">Beispiele</h3>
	<ul class="flex flex-col gap-4">
		{#each examples as example (example.formula)}
			<li class="flex flex-col gap-1 rounded-control bg-sunken p-4">
				<code class="font-mono font-semibold text-ink">{example.formula}</code>
				<span class="text-ink-muted">{example.text}</span>
			</li>
		{/each}
	</ul>
</Panel>
