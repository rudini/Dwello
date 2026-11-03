<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { periodDays } from '$lib/accounting-period';
	import { wizardLink, type Billed } from '$lib/statement-wizard';
	import Button from '$lib/ui/Button.svelte';

	// Step 2, a building the period overlaps (#199, #408 point 2): the ways out, each into the wizard with this building
	// and an existing period of the building; there are no short periods (#1088)
	let { buildingId, overlap }: { buildingId: string; overlap: NonNullable<Billed['overlap']> } =
		$props();

	// one way per first day: periods made before #408 point 2 may share it (code review 199-1 C-2)
	const ways = $derived(
		overlap.choose
			.map((p) => ({ ...p, label: m.statements_period_choose({ period: periodDays(p) }) }))
			.filter((way, i, all) => all.findIndex((other) => other.start === way.start) === i)
	);
</script>

{#if ways.length}
	<div class="flex flex-wrap gap-2">
		{#each ways as way (way.start)}
			<!-- a full load: the wizard starts anew with this building and period -->
			<Button
				href={wizardLink(buildingId, way.start, way.end)}
				reload
				variant="ghost"
				icon="calculate"
				testid="generate-building-period-{buildingId}-{way.start}">{way.label}</Button
			>
		{/each}
	</div>
{/if}
