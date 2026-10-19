<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { periodName } from '$lib/accounting-period';
	import { wizardLink, type Billed } from '$lib/statement-wizard';
	import Button from '$lib/ui/Button.svelte';

	// Step 2, a building the period overlaps (#199, #408 point 2): the ways out, each into the wizard with this building
	// and its period: an existing period of the building, or a short period for the days no statement covers
	let { buildingId, overlap }: { buildingId: string; overlap: NonNullable<Billed['overlap']> } =
		$props();

	const ways = $derived([
		...overlap.choose.map((p) => ({
			...p,
			label: m.statements_period_choose({ period: periodName(p) })
		})),
		...overlap.short.map((p) => ({
			...p,
			label: m.statements_period_short({ period: periodName(p) })
		}))
	]);
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
		<!-- #486: the Abrechnungsperiode may be part of the Mietvertrag -->
		{#if overlap.short.length}
			<p class="basis-full text-ink-muted" data-testid="generate-building-short-help-{buildingId}">
				{m.statements_short_period_help()}
			</p>
		{/if}
	</div>
{/if}
