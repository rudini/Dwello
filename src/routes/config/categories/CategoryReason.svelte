<script lang="ts" module>
	import { m } from '$lib/paraglide/messages';

	type Shown = { key?: string; predefined?: boolean; isAllowedUtilityCost: boolean };
	// Each predefined category by its key, with the allocability its fixed sentence explains (#186, wording from the
	// domain review docs/reviews/186-fachreview-1.md); each writes out the laws it cites and ends with its conclusion
	// (#292, docs/reviews/292-fachreview-1.md)
	const REASONS: Record<string, [allowed: boolean, reason: () => string]> = {
		Heating: [true, m.categories_reason_heating],
		'Hot Water': [true, m.categories_reason_hot_water],
		'Cold Water': [true, m.categories_reason_cold_water],
		Wastewater: [true, m.categories_reason_wastewater],
		'Electricity Common Areas': [true, m.categories_reason_common_electricity],
		Elevator: [true, m.categories_reason_elevator],
		Caretaker: [true, m.categories_reason_caretaker],
		'Garden Maintenance': [true, m.categories_reason_garden],
		'Snow Removal': [true, m.categories_reason_snow],
		'Waste Disposal': [true, m.categories_reason_waste],
		'TV/Cable': [true, m.categories_reason_tv],
		'Chimney Sweep': [true, m.categories_reason_chimney],
		Repairs: [false, m.categories_reason_repairs],
		'Building Insurance': [false, m.categories_reason_building_insurance],
		'Property Tax': [false, m.categories_reason_property_tax],
		'Mortgage Interest': [false, m.categories_reason_mortgage],
		Administration: [false, m.categories_reason_administration],
		Renovation: [false, m.categories_reason_renovation],
		'Capital Improvements': [false, m.categories_reason_capital_improvements],
		'Pest Control': [false, m.categories_reason_pest_control],
		'Fire Extinguisher Maintenance': [false, m.categories_reason_fire_extinguisher]
	};

	/**
	 * Why a predefined category's costs are or are not umlagefähig; none for an own category, and none once the
	 * Liegenschaftsverwalter changed its allocability, so no sentence argues against the choice next to it
	 */
	export function reasonOf(category?: Shown) {
		const known = category?.predefined ? REASONS[category.key ?? ''] : undefined;
		return known?.[0] === category?.isAllowedUtilityCost ? known?.[1]() : undefined;
	}

	/** The category whose reason an invoice shows: none when the invoice's allocability differs from its category's */
	export const reasonCategory = (invoice: { isValidUtilityCost: boolean; category?: Shown }) =>
		invoice.isValidUtilityCost === invoice.category?.isAllowedUtilityCost
			? invoice.category
			: undefined;
</script>

<script lang="ts">
	let { category }: { category?: Shown } = $props();

	const reason = $derived(reasonOf(category));
</script>

{#if reason}
	<p class="text-ink-muted" data-testid="category-reason">{reason}</p>
{/if}
