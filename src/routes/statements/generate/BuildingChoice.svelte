<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { Building } from '$lib/types';

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
		billed?: { contracts: number; billed: number };
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
	// Said only when some contract of the period has a statement already
	const billedText = $derived.by(() => {
		if (!billed?.billed) return '';
		const { contracts: total, billed: count } = billed;
		if (count < total)
			return count === 1
				? m.statements_building_billed_one({ billed: count, total })
				: m.statements_building_billed_many({ billed: count, total });
		return total === 1
			? m.statements_building_billed_all_one()
			: m.statements_building_billed_all_many();
	});
	const describedBy = $derived(
		[error && 'buildings-error', billedText && billedId].filter(Boolean).join(' ') || undefined
	);
</script>

<!-- The note on existing statements takes the card's whole width below (persona Marco P-1) and chooses the building
     like the rest of the card (Marco P-3); it describes the checkbox instead of naming it (persona Sven P-1) -->
<label
	class="flex min-h-12 cursor-pointer flex-wrap items-center gap-4 rounded-control border-2 p-4 {selected
		? 'border-accent bg-accent-soft'
		: 'border-line-strong bg-surface'}"
>
	<input
		type="checkbox"
		checked={selected}
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
