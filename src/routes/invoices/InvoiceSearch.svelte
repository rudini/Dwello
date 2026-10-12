<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { untrack } from 'svelte';
	import { goto } from '$app/navigation';
	import { listSearchUrl } from '$lib/list-url';
	import type { InvoicesListData } from '$lib/types';
	import Button from '$lib/ui/Button.svelte';
	import Select from '$lib/ui/Select.svelte';
	import TextInput from '$lib/ui/TextInput.svelte';

	// Search and filters of the invoice list; they live in the URL, so the server filters across all invoices
	let {
		params,
		buildings,
		categories,
		years
	}: {
		params: URLSearchParams;
		buildings: InvoicesListData['buildings'];
		categories: InvoicesListData['categories'];
		years: string[];
	} = $props();

	// Starts from the URL; afterwards the fields hold what the user chooses until "Suchen"
	let filters = $state(
		untrack(() => ({
			search: params.get('search') || '',
			building: params.get('building') || '',
			categoryId: params.get('categoryId') || '',
			validity: params.get('validity') || '',
			year: params.get('year') || ''
		}))
	);
	const filtered = $derived(Object.values(filters).some(Boolean));

	function search(event: SubmitEvent) {
		event.preventDefault();
		goto(listSearchUrl('/invoices', filters));
	}

	function clear() {
		filters = { search: '', building: '', categoryId: '', validity: '', year: '' };
		goto('/invoices');
	}
</script>

<form onsubmit={search} class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
	<TextInput
		id="search"
		label={m.buildings_search()}
		help={m.invoices_search_help()}
		optional
		bind:value={filters.search}
		testid="invoice-search-input"
	/>
	<Select
		id="building"
		label={m.apartments_building()}
		placeholder={m.apartments_all_buildings()}
		optional
		options={buildings.map((b) => ({ value: b.id, label: b.name || b.address }))}
		bind:value={filters.building}
		testid="invoice-building-filter"
	/>
	<Select
		id="category"
		label={m.buildings_category()}
		placeholder={m.invoices_all_categories()}
		optional
		options={categories.map((c) => ({ value: c.id, label: c.name }))}
		bind:value={filters.categoryId}
		testid="invoice-category-filter"
	/>
	<Select
		id="validity"
		label={m.invoices_allocability()}
		placeholder={m.invoices_all()}
		optional
		options={[
			{ value: 'valid', label: m.glossary_allocable_term() },
			{ value: 'invalid', label: m.invoices_not_allocable() }
		]}
		bind:value={filters.validity}
		testid="invoice-validity-filter"
	/>
	<Select
		id="year"
		label={m.invoices_year()}
		help={m.invoices_year_help()}
		placeholder={m.invoices_all_years()}
		optional
		options={years.map((year) => ({ value: year, label: year }))}
		bind:value={filters.year}
		testid="invoice-year-filter"
	/>
	<div class="flex flex-wrap gap-4 md:col-span-2 xl:col-span-4">
		<Button type="submit" icon="search" testid="invoice-search-submit"
			>{m.buildings_search_submit()}</Button
		>
		{#if filtered}
			<Button variant="ghost" icon="close" onclick={clear}>{m.buildings_reset_filters()}</Button>
		{/if}
	</div>
</form>
