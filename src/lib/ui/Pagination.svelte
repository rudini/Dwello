<script lang="ts">
	import { listPageUrl } from '$lib/list-url';
	import Button from './Button.svelte';

	// Paging of a list whose filters live in the URL: where am I, and the page before and after
	let { url, page, pageSize, total }: { url: URL; page: number; pageSize: number; total: number } =
		$props();

	const pages = $derived(Math.ceil(total / pageSize));
</script>

{#if pages > 1}
	<nav aria-label="Seiten" class="flex flex-wrap items-center justify-between gap-4">
		{#if page > 1}
			<Button href={listPageUrl(url, page - 1)} icon="chevron-left" testid="pagination-prev"
				>Vorherige Seite</Button
			>
		{/if}
		<p class="text-ink-muted">Seite {page} von {pages}</p>
		{#if page < pages}
			<Button href={listPageUrl(url, page + 1)} icon="chevron-right" testid="pagination-next"
				>Nächste Seite</Button
			>
		{/if}
	</nav>
{/if}
