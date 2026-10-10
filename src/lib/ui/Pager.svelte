<script lang="ts">
	import Button from './Button.svelte';

	// Paging of a long list: which page this is and the way to its neighbours
	let {
		page,
		pageSize,
		total,
		href
	}: { page: number; pageSize: number; total: number; href: (page: number) => string } = $props();

	const pages = $derived(Math.ceil(total / pageSize));
</script>

{#if pages > 1}
	<nav aria-label="Seiten" class="flex flex-wrap items-center justify-between gap-4">
		<p class="text-ink-muted">Seite {page} von {pages}</p>
		<div class="flex flex-wrap gap-4">
			{#if page > 1}
				<Button href={href(page - 1)} icon="chevron-left">Vorherige Seite</Button>
			{/if}
			{#if page < pages}
				<Button href={href(page + 1)}>Nächste Seite</Button>
			{/if}
		</div>
	</nav>
{/if}
