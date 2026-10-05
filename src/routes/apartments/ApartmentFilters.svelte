<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { untrack } from 'svelte';
	import { statusLabels } from '$lib/apartment';
	import Card from '$lib/components/Card.svelte';
	import FilterActions from '$lib/components/FilterActions.svelte';
	import FilterSelect from '$lib/components/FilterSelect.svelte';
	import SearchField from '$lib/components/SearchField.svelte';

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
		const params = new URLSearchParams(Object.entries(filters).filter(([, value]) => value));
		params.set('page', '1');
		goto(`/apartments?${params}`);
	}

	function clear() {
		filters = { search: '', building: '', status: '' };
		goto('/apartments');
	}
</script>

<Card>
	<form onsubmit={search} class="flex flex-col lg:flex-row lg:items-center gap-4">
		<div class="flex-1 flex flex-col sm:flex-row gap-4">
			<SearchField
				bind:value={filters.search}
				placeholder="Wohnungsnummer, Gebäude oder Mieter..."
				testid="apartments-search-input"
			/>
			<FilterSelect
				id="building"
				label="Gebäude"
				allLabel="Alle Gebäude"
				options={buildingOptions}
				value={filters.building}
				testid="apartments-building-filter"
				onchange={(value) => (filters.building = value)}
			/>
			<FilterSelect
				id="status"
				label="Status"
				allLabel="Alle Status"
				options={statusOptions}
				value={filters.status}
				testid="apartments-status-filter"
				onchange={(value) => (filters.status = value)}
			/>
		</div>
		<FilterActions {filtered} onclear={clear} testid="apartments-search-submit" />
	</form>
</Card>
