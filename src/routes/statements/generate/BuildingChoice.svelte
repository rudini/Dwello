<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { Building } from '$lib/types';
	import { periodName } from '$lib/accounting-period';
	import type { Billed } from '$lib/statement-wizard';
	import OverlapWays from './OverlapWays.svelte';

	// One building to choose in step 2, with its utility invoices in the Abrechnungsperiode once they are counted
	let {
		building,
		selected,
		invoices,
		billed,
		error,
		ontoggle
	}: {
		building: Building & { apartmentCount: number };
		selected: boolean;
		invoices: number | undefined;
		billed?: Billed;
		error?: string;
		ontoggle: () => void;
	} = $props();

	const invoicesText = $derived(
		invoices === 0
			? m.statements_building_no_invoices()
			: invoices === 1
				? m.statements_building_invoices_one({ count: invoices })
				: m.statements_building_invoices_many({ count: invoices ?? 0 })
	);

	const billedId = $derived(`building-billed-${building.id}`);
	const overlap = $derived(billed?.overlap);
	const named = (periods: { start: string; end: string }[]) => periods.map(periodName).join(', ');
	// #199, #408 point 2: a period that overlaps one of the building's: the existing period and the ways out
	const overlapText = (o: NonNullable<Billed['overlap']>) =>
		[
			(o.statements === 1
				? m.statements_building_period_overlaps_one
				: m.statements_building_period_overlaps_many)({
				building: building.name,
				periods: named(o.periods)
			}),
			o.choose.length && m.statements_building_period_choose_text({ periods: named(o.choose) }),
			o.short.length === 1 && m.statements_building_period_short_text({ periods: named(o.short) }),
			o.short.length > 1 && m.statements_building_period_short_many({ periods: named(o.short) }),
			o.vacant && m.statements_building_period_vacant()
		]
			.filter(Boolean)
			.join(' ');
	// Said only when some contract of the period has a statement already
	const billedText = $derived.by(() => {
		if (overlap) return overlapText(overlap);
		if (!billed?.billed) return '';
		const { contracts: total, billed: count } = billed;
		const one = total === 1;
		const some = () =>
			count === 1
				? m.statements_building_billed_one({ billed: count, total })
				: m.statements_building_billed_many({ billed: count, total });
		const all = () =>
			one ? m.statements_building_billed_all_one() : m.statements_building_billed_all_many();
		// how an existing draft is recalculated, here already (persona Helga P-7, #201)
		return `${count < total ? some() : all()} ${m.statements_building_recalculate()}`;
	});
	// a building the period overlaps cannot be chosen (#408 point 2)
	const cardClass = $derived(
		overlap
			? 'border-line-strong bg-sunken'
			: selected
				? 'cursor-pointer border-accent bg-accent-soft'
				: 'cursor-pointer border-line-strong bg-surface'
	);
	const describedBy = $derived(
		[error && 'buildings-error', billedText && billedId].filter(Boolean).join(' ') || undefined
	);
</script>

<!-- The note on existing statements takes the card's whole width below (persona Marco P-1) and chooses the building
     like the rest of the card (Marco P-3); it describes the checkbox instead of naming it (persona Sven P-1) -->
<label class="flex min-h-12 flex-wrap items-center gap-4 rounded-control border-2 p-4 {cardClass}">
	<input
		type="checkbox"
		checked={selected}
		disabled={!!overlap}
		onchange={ontoggle}
		aria-invalid={error ? true : undefined}
		aria-describedby={describedBy}
		class="size-6 shrink-0 cursor-pointer accent-accent"
		data-testid="generate-building-{building.id}"
	/>
	<span class="flex flex-1 flex-col gap-1">
		<span class="font-semibold text-ink">{building.name}</span>
		<span class="text-ink-muted">{building.address}, {building.postalCode} {building.city}</span>
		{#if invoices !== undefined}
			<span
				class={invoices === 0 ? 'font-semibold text-caution' : 'text-ink-muted'}
				data-testid="generate-building-invoices-{building.id}">{invoicesText}</span
			>
		{/if}
	</span>
	<span class="text-right text-ink-muted">
		<span class="font-semibold tabular-nums text-ink">{building.apartmentCount}</span>
		{m.buildings_apartment_many()}
	</span>
	{#if billedText}
		<span
			id={billedId}
			aria-hidden="true"
			class="basis-full font-semibold text-ink"
			data-testid="generate-building-billed-{building.id}">{billedText}</span
		>
	{/if}
</label>
{#if overlap}
	<OverlapWays buildingId={building.id} {overlap} />
{/if}
