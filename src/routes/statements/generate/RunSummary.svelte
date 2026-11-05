<script lang="ts" module>
	export type Summary = {
		period: string;
		buildings: string;
		heatingProfile?: string;
		feePercent: number;
	};
</script>

<script lang="ts">
	import { m } from '$lib/paraglide/messages';

	// What a run of «Abrechnungen erstellen» bills, said once more before creating (#663)
	let { summary }: { summary?: Summary } = $props();

	const facts = $derived(
		summary
			? [
					[m.glossary_period_term(), summary.period],
					[m.statements_step_buildings(), summary.buildings],
					[m.glossary_profile_term(), summary.heatingProfile],
					[m.glossary_fee_term(), m.statements_fee_of_own({ percent: summary.feePercent })]
				].filter((fact): fact is [string, string] => !!fact[1])
			: []
	);
</script>

{#if facts.length}
	<dl class="grid gap-4 sm:grid-cols-2" data-testid="run-summary">
		{#each facts as [term, value] (term)}
			<div class="flex flex-col gap-1 rounded-panel bg-sunken p-4">
				<dt class="text-ink-muted">{term}</dt>
				<dd class="font-semibold text-ink">{value}</dd>
			</div>
		{/each}
	</dl>
{/if}
