<script lang="ts">
	import { applyFilterChoice } from '$lib/list-filter';
	import { m } from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { untrack } from 'svelte';
	import { statusLabels } from '$lib/apartment';
	import { listSearchUrl } from '$lib/list-url';
	import Button from '$lib/ui/Button.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';
	import EarlySelect from '$lib/ui/EarlySelect.svelte';

	let {
		buildings,
		reset
	}: {
		buildings: { id: string; name: string }[];
		reset: boolean; // offer «Filter zurücksetzen»: the address has a filter and the list is not empty (#682)
	} = $props();

	const fromUrl = () => ({
		search: $page.url.searchParams.get('search') ?? '',
		building: $page.url.searchParams.get('building') ?? '',
		status: $page.url.searchParams.get('status') ?? ''
	});
	let filters = $state(untrack(fromUrl));
	// a new address (a link, back or forward) shows its filters (#159), in the same form: a filter keeps the focus (#662)
	const address = $derived($page.url.search);
	$effect.pre(() => {
		void address;
		filters = untrack(fromUrl);
	});
	// #670: by name, as the list (the backend gives the buildings by last change)
	// ponytail: the list sorts by the database's collation; names that differ only in case or umlauts may sort otherwise
	const buildingOptions = $derived(
		buildings
			.map((b) => ({ value: b.id, label: b.name }))
			.sort((a, b) => a.label.localeCompare(b.label, getLocale()))
	);
	const statusOptions = Object.entries(statusLabels).map(([value, label]) => ({ value, label }));

	function search(event: SubmitEvent) {
		event.preventDefault();
		goto(listSearchUrl('/apartments', filters));
	}

	function clear() {
		filters = { search: '', building: '', status: '' };
		goto('/apartments');
	}
</script>

<form
	method="GET"
	action="/apartments"
	role="search"
	onchange={applyFilterChoice}
	aria-label={m.list_search_label()}
	onsubmit={search}
	class="flex flex-col gap-4 rounded-panel border border-line bg-surface p-6"
>
	<div class="grid gap-4 md:grid-cols-3">
		<TextInput
			id="search"
			name="search"
			label={m.buildings_search()}
			bind:value={filters.search}
			help={m.apartments_search_help()}
			helpTestid="apartments-search-help"
			required={false}
			testid="apartments-search-input"
		/>
		<EarlySelect
			id="building"
			name="building"
			label={m.apartments_building()}
			placeholder={m.apartments_all_buildings()}
			options={buildingOptions}
			value={filters.building}
			required={false}
			testid="apartments-building-filter"
			onchange={(value) => (filters.building = value)}
		/>
		<EarlySelect
			id="status"
			name="status"
			label={m.apartments_status()}
			placeholder={m.apartments_all_statuses()}
			options={statusOptions}
			value={filters.status}
			required={false}
			testid="apartments-status-filter"
			onchange={(value) => (filters.status = value)}
		/>
	</div>
	<div class="flex flex-wrap gap-4">
		<Button type="submit" icon="search" testid="apartments-search-submit"
			>{m.buildings_search_submit()}</Button
		>
		{#if reset}
			<Button variant="ghost" icon="close" onclick={clear}>{m.buildings_reset_filters()}</Button>
		{/if}
	</div>
</form>
