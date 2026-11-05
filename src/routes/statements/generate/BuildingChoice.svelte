<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { Building } from '$lib/types';
	import { otherPeriodText, overlapText } from '$lib/accounting-period';
	import { unchoosable, type Billed } from '$lib/statement-wizard';

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
	const blocked = $derived(unchoosable(billed));
	// Said only when some contract of the period has a statement already
	const billedText = $derived.by(() => {
		if (billed?.otherPeriod) return otherPeriodText(billed.otherPeriod, building.name);
		if (billed?.overlap?.length) return overlapText(billed.overlap, building.name);
		if (!billed?.billed) return '';
		const { contracts: total, billed: count } = billed;
		const one = total === 1;
		// #1068: one sentence that leads with what happens; «Neu berechnen» is said once in the step
		const rest = total - count;
		if (count === total) return one ? m.statements_building_billed_all_one() : m.statements_building_billed_all_many();
		if (count === 1)
			return rest === 1
				? m.statements_building_billed_one_rest_one({ billed: count, total })
				: m.statements_building_billed_one_rest_many({ billed: count, total });
		return rest === 1
			? m.statements_building_billed_many_rest_one({ billed: count, total })
			: m.statements_building_billed_many_rest_many({ billed: count, total });
	});
	// a building that bills another period cannot be chosen (#1088)
	const cardClass = $derived(
		blocked
			? 'border-line-strong bg-sunken'
			: selected
				? 'cursor-pointer border-accent bg-accent-soft'
				: 'cursor-pointer border-line-strong bg-surface'
	);
	// #738: named by building and address; the counts and notes describe it
	const id = (part: string) => `building-${part}-${building.id}`;
	const apartmentsWord = $derived(
		building.apartmentCount === 1 ? m.buildings_apartment_one() : m.buildings_apartment_many()
	);
	// read as sentences, so the apartments are not heard as part of the period (persona Sven 738 P-3)
	const countsText = $derived(
		[invoices !== undefined && invoicesText, `${building.apartmentCount} ${apartmentsWord}`]
			.filter(Boolean)
			.join('. ')
	);
	const describedBy = $derived(
		// #1068 (persona Sven 1068 P-1): what happens to the building first, then the counts
		[billedText && billedId, id('counts'), error && 'buildings-error'].filter(Boolean).join(' ')
	);
</script>

<!-- The note on existing statements takes the card's whole width below (persona Marco P-1) and chooses the building
     like the rest of the card (Marco P-3); it describes the checkbox instead of naming it (persona Sven P-1) -->
<label
	class="flex min-h-12 flex-wrap items-center gap-4 rounded-control border-2 p-4 {cardClass}"
	data-testid="generate-building-card-{building.id}"
>
	<input
		type="checkbox"
		checked={selected}
		disabled={blocked}
		onchange={ontoggle}
		aria-invalid={error ? true : undefined}
		aria-labelledby="{id('name')} {id('address')}"
		aria-describedby={describedBy}
		class="size-6 shrink-0 cursor-pointer accent-accent"
		data-testid="generate-building-{building.id}"
	/>
	<span class="flex flex-1 flex-col gap-1">
		<span id={id('name')} class="font-semibold text-ink">{building.name}</span>
		<span id={id('address')} class="text-ink-muted"
			>{building.address}, {building.postalCode} {building.city}</span
		>
		{#if invoices !== undefined}
			<span
				class={invoices === 0 ? 'font-semibold text-caution' : 'text-ink-muted'}
				data-testid="generate-building-invoices-{building.id}">{invoicesText}</span
			>
		{/if}
	</span>
	<span class="text-right text-ink-muted">
		<span class="font-semibold tabular-nums text-ink">{building.apartmentCount}</span>
		{apartmentsWord}
	</span>
	<span id={id('counts')} hidden>{countsText}</span>
	{#if billedText}
		<span
			id={billedId}
			aria-hidden="true"
			class="basis-full font-semibold text-ink"
			data-testid="generate-building-billed-{building.id}">{billedText}</span
		>
	{/if}
</label>
