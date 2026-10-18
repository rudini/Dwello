<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Checkbox from '$lib/ui/Checkbox.svelte';

	// Heating costs follow the heating profile; Brennstoff is a mark of a heating cost (#100), so it is asked only then
	let { heating = $bindable(), fuel = $bindable() }: { heating: boolean; fuel: boolean } = $props();
</script>

<Checkbox
	id="isHeatingCost"
	name="isHeatingCost"
	label={m.categories_heating()}
	help={m.categories_heating_help()}
	bind:checked={heating}
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
