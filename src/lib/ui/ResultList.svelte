<script lang="ts">
	import type { Snippet } from 'svelte';
	import Pagination from './Pagination.svelte';

	// The records of a list page: a heading that counts them and takes the focus after a search, the list, its pages
	let {
		id,
		heading,
		listClass = 'flex flex-col divide-y divide-line rounded-panel border border-line bg-surface',
		url,
		page,
		pageSize,
		total,
		children
	}: {
		id: string; // of the heading, which names the section
		heading: string;
		listClass?: string;
		url: URL;
		page: number;
		pageSize: number;
		total: number;
		children: Snippet; // the list's items
	} = $props();
</script>

<section aria-labelledby={id} class="flex flex-col gap-4">
	<h2 {id} tabindex="-1" data-results data-testid="list-results" class="text-xl font-bold text-ink">{heading}</h2>
	<ul class={listClass}>
		{@render children()}
	</ul>
</section>
<Pagination {url} {page} {pageSize} {total} />
