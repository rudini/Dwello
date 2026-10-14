<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Button from '$lib/ui/Button.svelte';
	import EarlySelect from '$lib/ui/EarlySelect.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';

	// Search and building filter as a plain GET form: works before the page is hydrated, keeps the status
	let {
		search,
		building,
		status,
		contract = '',
		buildings
	}: {
		search: string;
		building: string;
		status: string;
		contract?: string;
		buildings: { id: string; name: string }[];
	} = $props();

	// Bound, so what is typed before hydration is kept; EarlySelect keeps an early building choice
	let term = $derived(search);
	const filtered = $derived(!!(search || building || status || contract));
</script>

<form method="GET" action="/statements" class="flex flex-col gap-4 md:flex-row md:items-end">
	{#if status}<input type="hidden" name="status" value={status} />{/if}
	{#if contract}<input type="hidden" name="contract" value={contract} />{/if}
	<div class="flex-1">
		<TextInput
			id="search"
			name="search"
			label={m.buildings_search()}
			help={m.statements_search_help()}
			optional
			bind:value={term}
			testid="statement-search-input"
		/>
	</div>
	<div class="flex-1">
		<EarlySelect
			id="building"
			name="building"
			label={m.apartments_building()}
			placeholder={m.apartments_all_buildings()}
			optional
			options={buildings.map((b) => ({ value: b.id, label: b.name }))}
			value={building}
			testid="statement-building-filter"
		/>
	</div>
	<div class="flex flex-wrap gap-4">
		<Button type="submit" icon="search" testid="statement-search-submit"
			>{m.buildings_search_submit()}</Button
		>
		{#if filtered}
			<Button href="/statements" variant="ghost" icon="close">{m.buildings_reset_filters()}</Button>
		{/if}
	</div>
</form>
