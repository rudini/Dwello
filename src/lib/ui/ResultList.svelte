<script lang="ts">
	import type { Snippet } from 'svelte';
	import Pagination from './Pagination.svelte';

	type Count = (inputs: { count: number }) => string;
	type PageCount = (inputs: {
		from: number;
		to: number;
		total: number;
		page: number;
		pages: number;
	}) => string;

	// The records of a list page: a heading that counts them and takes the focus after a search, the list, its pages
	let {
		id,
		counts,
		shown,
		listClass = 'flex flex-col divide-y divide-line rounded-panel border border-line bg-surface',
		url,
		page,
		pageSize,
		total,
		children
	}: {
		id: string; // of the heading, which names the section
		// the heading's texts for one and several records, and for one and several shown of a longer list
		counts: { one: Count; many: Count; pageOne: PageCount; pageMany: PageCount };
		shown: number; // records on this page
		listClass?: string;
		url: URL;
		page: number;
		pageSize: number;
		total: number;
		children: Snippet; // the list's items
	} = $props();

	// #670, #682: over several pages the heading names the records shown and the page, not only the total
	const heading = $derived.by(() => {
		const pages = Math.ceil(total / pageSize);
		if (pages < 2) return (total === 1 ? counts.one : counts.many)({ count: total });
		const from = (page - 1) * pageSize + 1;
		return (shown === 1 ? counts.pageOne : counts.pageMany)({
			from,
			to: from + shown - 1,
			total,
			page,
			pages
		});
	});
</script>

<section aria-labelledby={id} class="flex flex-col gap-4">
	<h2 {id} tabindex="-1" data-results data-testid="list-results" class="text-xl font-bold text-ink">{heading}</h2>
	<ul class={listClass}>
		{@render children()}
	</ul>
</section>
<Pagination {url} {page} {pageSize} {total} />
