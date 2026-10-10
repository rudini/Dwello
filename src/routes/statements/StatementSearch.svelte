<script lang="ts">
	import Button from '$lib/ui/Button.svelte';
	import EarlySelect from '$lib/ui/EarlySelect.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';

	// Search and building filter as a plain GET form: works before the page is hydrated, keeps the status
	let {
		search,
		building,
		status,
		buildings
	}: {
		search: string;
		building: string;
		status: string;
		buildings: { id: string; name: string }[];
	} = $props();

	// Bound, so what is typed before hydration is kept; EarlySelect keeps an early building choice
	let term = $derived(search);
	const filtered = $derived(!!(search || building || status));
</script>

<form method="GET" action="/statements" class="flex flex-col gap-4 md:flex-row md:items-end">
	{#if status}<input type="hidden" name="status" value={status} />{/if}
	<div class="flex-1">
		<TextInput
			id="search"
			name="search"
			label="Suche"
			help="Mieter, Abrechnungsnummer oder Wohnung"
			optional
			bind:value={term}
			testid="statement-search-input"
		/>
	</div>
	<div class="flex-1">
		<EarlySelect
			id="building"
			name="building"
			label="Gebäude"
			placeholder="Alle Gebäude"
			optional
			options={buildings.map((b) => ({ value: b.id, label: b.name }))}
			value={building}
			testid="statement-building-filter"
		/>
	</div>
	<div class="flex flex-wrap gap-4">
		<Button type="submit" icon="search" testid="statement-search-submit">Suchen</Button>
		{#if filtered}
			<Button href="/statements" variant="ghost" icon="close">Filter zurücksetzen</Button>
		{/if}
	</div>
</form>
