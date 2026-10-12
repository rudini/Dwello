<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { untrack } from 'svelte';
	import { statusLabels } from '$lib/apartment';
	import { listSearchUrl } from '$lib/list-url';
	import Button from '$lib/ui/Button.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';
	import EarlySelect from '$lib/ui/EarlySelect.svelte';

	let { buildings }: { buildings: { id: string; name: string }[] } = $props();

	const fromUrl = () => ({
		search: $page.url.searchParams.get('search') ?? '',
		building: $page.url.searchParams.get('building') ?? '',
		status: $page.url.searchParams.get('status') ?? ''
	});
	let filters = $state(untrack(fromUrl));
	const filtered = $derived(Object.values(filters).some(Boolean));
	const buildingOptions = $derived(buildings.map((b) => ({ value: b.id, label: b.name })));
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
	role="search"
	onsubmit={search}
	class="flex flex-col gap-4 rounded-panel border border-line bg-surface p-6"
>
	<div class="grid gap-4 md:grid-cols-3">
		<TextInput
			id="search"
			label={m.buildings_search()}
			bind:value={filters.search}
			placeholder={m.apartments_search_placeholder()}
			optional
			testid="apartments-search-input"
		/>
		<EarlySelect
			id="building"
			label={m.apartments_building()}
			placeholder={m.apartments_all_buildings()}
			options={buildingOptions}
			value={filters.building}
			optional
			testid="apartments-building-filter"
			onchange={(value) => (filters.building = value)}
		/>
		<EarlySelect
			id="status"
			label={m.apartments_status()}
			placeholder={m.apartments_all_statuses()}
			options={statusOptions}
			value={filters.status}
			optional
			testid="apartments-status-filter"
			onchange={(value) => (filters.status = value)}
		/>
	</div>
	<div class="flex flex-wrap gap-4">
		<Button type="submit" icon="search" testid="apartments-search-submit"
			>{m.buildings_search_submit()}</Button
		>
		{#if filtered}
			<Button variant="ghost" icon="close" onclick={clear}>{m.buildings_reset_filters()}</Button>
		{/if}
	</div>
</form>
