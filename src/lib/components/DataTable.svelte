<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from './Icon.svelte';

	type SortDirection = 'asc' | 'desc' | null;

	interface Column {
		key: string;
		label: string;
		sortable?: boolean;
		class?: string;
		headerClass?: string;
	}

	interface Props {
		columns: Column[];
		data: Record<string, unknown>[];
		sortKey?: string;
		sortDirection?: SortDirection;
		onsort?: (_sortKey: string, _sortDirection: SortDirection) => void;
		emptyMessage?: string;
		class?: string;
		rowClass?: string;
		row?: Snippet<[Record<string, unknown>, number]>;
		cell?: Snippet<[{ column: Column; value: unknown; row: Record<string, unknown>; index: number }]>;
	}

	let {
		columns,
		data,
		sortKey = $bindable(''),
		sortDirection = $bindable(null),
		onsort,
		emptyMessage = 'Keine Daten vorhanden',
		class: className = '',
		rowClass = '',
		row,
		cell
	}: Props = $props();

	function handleSort(column: Column) {
		if (!column.sortable) return;

		let newDirection: SortDirection;
		if (sortKey === column.key) {
			newDirection = sortDirection === 'asc' ? 'desc' : sortDirection === 'desc' ? null : 'asc';
		} else {
			newDirection = 'asc';
		}

		sortKey = newDirection ? column.key : '';
		sortDirection = newDirection;
		onsort?.(sortKey, sortDirection);
	}

	function getSortIcon(column: Column): string {
		if (!column.sortable) return '';
		if (sortKey !== column.key) return 'unfold_more';
		return sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward';
	}
</script>

<div class="overflow-x-auto {className}">
	<table class="w-full">
		<thead>
			<tr class="border-b border-gray-200">
				{#each columns as column}
					<th
						class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4 {column.headerClass || ''}"
					>
						{#if column.sortable}
							<button
								type="button"
								onclick={() => handleSort(column)}
								class="inline-flex items-center gap-1 hover:text-gray-700 transition-colors"
							>
								{column.label}
								<Icon name={getSortIcon(column)} size={16} class="text-gray-400" />
							</button>
						{:else}
							{column.label}
						{/if}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody class="divide-y divide-gray-100">
			{#if data.length === 0}
				<tr>
					<td colspan={columns.length} class="py-12 text-center text-gray-500">
						<div class="flex flex-col items-center gap-2">
							<Icon name="inbox" size={32} class="text-gray-300" />
							<p>{emptyMessage}</p>
						</div>
					</td>
				</tr>
			{:else}
				{#each data as rowData, index}
					{#if row}
						{@render row(rowData, index)}
					{:else}
						<tr class="hover:bg-gray-50 transition-colors {rowClass}">
							{#each columns as column}
								<td class="py-4 px-4 {column.class || ''}">
									{#if cell}
										{@render cell({ column, value: rowData[column.key], row: rowData, index })}
									{:else}
										{rowData[column.key] ?? '-'}
									{/if}
								</td>
							{/each}
						</tr>
					{/if}
				{/each}
			{/if}
		</tbody>
	</table>
</div>
