<script lang="ts">
	import { applyFilterChoice, showAppliedFilter } from '$lib/utils/list-filter';
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
		years,
		reset
	}: {
		params: URLSearchParams;
		buildings: InvoicesListData['buildings'];
		categories: InvoicesListData['categories'];
		years: string[];
		reset: boolean; // offer «Filter zurücksetzen»: the address has a filter and the list is not empty (#682)
	} = $props();

	// Starts from the URL; afterwards the fields hold what the user types until «Suchen», a select applies at once (#662)
	const fromUrl = () => ({
		search: params.get('search') || '',
		building: params.get('building') || '',
		categoryId: params.get('categoryId') || '',
		validity: params.get('validity') || '',
		year: params.get('year') || ''
	});
	let filters = $state(untrack(fromUrl));
	// a new address (a link, back or forward) shows its filters (#159), in the same form: a filter keeps the focus (#662)
	const address = $derived(params.toString());
	$effect.pre(() => {
		void address;
		filters = untrack(fromUrl);
	});

	function search(event: SubmitEvent) {
		event.preventDefault();
		goto(listSearchUrl('/invoices', filters));
	}

	function clear() {
		filters = { search: '', building: '', categoryId: '', validity: '', year: '' };
		goto('/invoices');
	}

	let form = $state<HTMLFormElement>();
	showAppliedFilter(() => form);
</script>

<form
	bind:this={form}
	method="GET"
	action="/invoices"
	role="search"
	onchange={applyFilterChoice}
	aria-label={m.list_search_label()}
	onsubmit={search}
	class="grid gap-4 rounded-panel border border-line bg-surface p-6 md:grid-cols-2 xl:grid-cols-4"
>
	<TextInput
		id="search"
		name="search"
		label={m.buildings_search()}
		help={m.invoices_search_help()}
		required={false}
		bind:value={filters.search}
		testid="invoice-search-input"
	/>
	<Select
		id="building"
		label={m.apartments_building()}
		name="building"
		placeholder={m.apartments_all_buildings()}
		required={false}
		options={buildings.map((b) => ({ value: b.id, label: b.name || b.address }))}
		bind:value={filters.building}
		testid="invoice-building-filter"
	/>
	<Select
		id="category"
		name="categoryId"
		label={m.buildings_category()}
		placeholder={m.invoices_all_categories()}
		required={false}
		options={categories.map((c) => ({ value: c.id, label: c.name }))}
		bind:value={filters.categoryId}
		testid="invoice-category-filter"
	/>
	<Select
		id="validity"
		name="validity"
		label={m.invoices_allocability()}
		placeholder={m.invoices_all()}
		required={false}
		options={[
			{ value: 'valid', label: m.glossary_allocable_term() },
			{ value: 'invalid', label: m.invoices_not_allocable() }
		]}
		bind:value={filters.validity}
		testid="invoice-validity-filter"
	/>
	<Select
		id="year"
		name="year"
		label={m.invoices_year()}
		help={m.invoices_year_help()}
		placeholder={m.invoices_all_years()}
		required={false}
		options={years.map((year) => ({ value: year, label: year }))}
		bind:value={filters.year}
		testid="invoice-year-filter"
	/>
	<div class="flex flex-wrap gap-4 md:col-span-2 xl:col-span-4">
		<Button type="submit" icon="search" testid="invoice-search-submit"
			>{m.buildings_search_submit()}</Button
		>
		{#if reset}
			<Button variant="ghost" icon="close" onclick={clear}>{m.buildings_reset_filters()}</Button>
		{/if}
	</div>
</form>
