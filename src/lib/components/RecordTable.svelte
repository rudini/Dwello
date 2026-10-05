<script lang="ts">
	import type { Snippet } from 'svelte';
	import Card from './Card.svelte';

	// Table of records with a trailing actions column; the rows come as children
	let {
		columns,
		children
	}: { columns: { label: string; align?: 'left' | 'center' }[]; children: Snippet } = $props();
	const alignClass = { left: 'text-left', center: 'text-center' };
</script>

<Card padding={false}>
	<div class="overflow-x-auto">
		<table class="w-full">
			<thead
				class="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider"
			>
				<tr>
					{#each columns as column (column.label)}
						<th class="px-6 py-3 {alignClass[column.align ?? 'left']}">{column.label}</th>
					{/each}
					<th class="px-6 py-3"><span class="sr-only">Aktionen</span></th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200">
				{@render children()}
			</tbody>
		</table>
	</div>
</Card>
