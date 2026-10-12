<script lang="ts">
	import { BUILDING_TOTALS, FORMULA_VARIABLES } from '$lib/distribution-key';
	import { m } from '$lib/paraglide/messages';
	import Panel from '$lib/ui/Panel.svelte';

	// Examples whose explanation holds for the backend's calculation (share = value / sum of all values)
	const examples = [
		{ formula: '{area}', text: m.keys_example_area() },
		{ formula: '{rooms}', text: m.keys_example_rooms() },
		{ formula: '{units}', text: m.keys_example_units() },
		{ formula: '{area} + {rooms} * 10', text: m.keys_example_mixed() },
		{
			formula: '0.7 * {area} / {area_total} + 0.3 * {units} / {units_total}',
			text: m.keys_example_fixed()
		}
	];
</script>

{#snippet variables(list: { name: string; description: () => string }[])}
	<dl class="flex flex-col gap-2">
		{#each list as variable (variable.name)}
			<div class="flex flex-wrap gap-x-4">
				<dt class="font-mono font-semibold text-ink">{`{${variable.name}}`}</dt>
				<dd class="text-ink-muted">{variable.description()}</dd>
			</div>
		{/each}
	</dl>
{/snippet}

<Panel title={m.keys_help_title()}>
	<p>
		{m.keys_help_intro()}
		<code class="font-mono">{'{area}'}</code>{m.keys_help_example()}
	</p>

	<h3 class="text-lg font-semibold text-ink">{m.keys_blocks()}</h3>
	{@render variables(FORMULA_VARIABLES)}

	<h3 class="text-lg font-semibold text-ink">{m.keys_building_totals()}</h3>
	<p>{m.keys_totals_text()}</p>
	{@render variables(BUILDING_TOTALS)}

	<h3 class="text-lg font-semibold text-ink">{m.keys_calculate()}</h3>
	<p>
		{m.keys_calculate_text()}
	</p>

	<h3 class="text-lg font-semibold text-ink">{m.keys_examples()}</h3>
	<ul class="flex flex-col gap-4">
		{#each examples as example (example.formula)}
			<li class="flex flex-col gap-1 rounded-control bg-sunken p-4">
				<code class="font-mono font-semibold text-ink">{example.formula}</code>
				<span class="text-ink-muted">{example.text}</span>
			</li>
		{/each}
	</ul>
</Panel>
