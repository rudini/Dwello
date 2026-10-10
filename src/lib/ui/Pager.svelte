<script lang="ts">
	import Button from './Button.svelte';

	// Paging of a long list as links, so the page stays in the address and the filters with it
	let {
		page,
		pageCount,
		href
	}: { page: number; pageCount: number; href: (page: number) => string } = $props();
</script>

{#if pageCount > 1}
	<nav aria-label="Seiten" class="flex flex-wrap items-center justify-between gap-4">
		<p class="text-ink-muted">Seite {page} von {pageCount}</p>
		<div class="flex gap-4">
			{#if page > 1}
				<Button href={href(page - 1)} icon="chevron-left" testid="pagination-previous"
					>Zurück</Button
				>
			{/if}
			{#if page < pageCount}
				<Button href={href(page + 1)} testid="pagination-next">Weiter</Button>
			{/if}
		</div>
	</nav>
{/if}
