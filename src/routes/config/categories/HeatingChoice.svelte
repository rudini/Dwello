<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Checkbox from '$lib/ui/Checkbox.svelte';

	// Heating costs follow the heating profile; Brennstoff is a mark of a heating cost (#100), so it is asked only then.
	// On Dwello's own categories «Heizkosten» is fixed (#302)
	let {
		heating = $bindable(),
		fuel = $bindable(),
		fixed = false
	}: { heating: boolean; fuel: boolean; fixed?: boolean } = $props();
</script>

<Checkbox
	id="isHeatingCost"
	name="isHeatingCost"
	label={m.categories_heating()}
	help={fixed ? m.categories_heating_fixed() : m.categories_heating_help()}
	bind:checked={heating}
	disabled={fixed}
	testid="category-heating-checkbox"
/>
{#if heating}
	<Checkbox
		id="isFuel"
		name="isFuel"
		label={m.categories_fuel()}
		help={m.categories_fuel_help()}
		bind:checked={fuel}
		testid="category-fuel-checkbox"
	/>
{/if}
