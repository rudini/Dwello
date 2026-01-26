<script lang="ts">
	import Icon from './Icon.svelte';

	interface Props {
		page: number;
		pageSize: number;
		total: number;
		onchange?: (_page: number) => void;
		class?: string;
	}

	let { page = $bindable(1), pageSize, total, onchange, class: className = '' }: Props = $props();

	const totalPages = $derived(Math.ceil(total / pageSize));
	const startItem = $derived((page - 1) * pageSize + 1);
	const endItem = $derived(Math.min(page * pageSize, total));

	const canGoPrev = $derived(page > 1);
	const canGoNext = $derived(page < totalPages);

	// Generate page numbers to show
	const pageNumbers = $derived.by(() => {
		const pages: (number | 'ellipsis')[] = [];
		const maxVisible = 5;

		if (totalPages <= maxVisible) {
			for (let i = 1; i <= totalPages; i++) pages.push(i);
		} else {
			pages.push(1);

			if (page > 3) pages.push('ellipsis');

			const start = Math.max(2, page - 1);
			const end = Math.min(totalPages - 1, page + 1);

			for (let i = start; i <= end; i++) pages.push(i);

			if (page < totalPages - 2) pages.push('ellipsis');

			pages.push(totalPages);
		}

		return pages;
	});

	function goToPage(newPage: number) {
		if (newPage >= 1 && newPage <= totalPages) {
			page = newPage;
			onchange?.(newPage);
		}
	}
</script>

{#if total > 0}
	<div class="flex items-center justify-between {className}">
		<p class="text-sm text-gray-600">
			Zeige <span class="font-medium">{startItem}</span> bis <span class="font-medium">{endItem}</span> von
			<span class="font-medium">{total}</span> Einträgen
		</p>

		{#if totalPages > 1}
			<nav class="flex items-center gap-1">
				<button
					type="button"
					onclick={() => goToPage(page - 1)}
					disabled={!canGoPrev}
					class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					aria-label="Vorherige Seite"
				>
					<Icon name="chevron_left" size={20} />
				</button>

				{#each pageNumbers as pageNum}
					{#if pageNum === 'ellipsis'}
						<span class="px-2 text-gray-400">...</span>
					{:else}
						<button
							type="button"
							onclick={() => goToPage(pageNum)}
							class="min-w-[36px] h-9 px-3 rounded-lg font-medium transition-colors {page === pageNum
								? 'bg-primary text-white'
								: 'hover:bg-gray-100 text-gray-700'}"
						>
							{pageNum}
						</button>
					{/if}
				{/each}

				<button
					type="button"
					onclick={() => goToPage(page + 1)}
					disabled={!canGoNext}
					class="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					aria-label="Nächste Seite"
				>
					<Icon name="chevron_right" size={20} />
				</button>
			</nav>
		{/if}
	</div>
{/if}
