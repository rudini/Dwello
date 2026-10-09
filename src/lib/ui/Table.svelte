<script lang="ts">
	import type { Snippet } from 'svelte';

	// Data table: a caption, column heads, amounts right-aligned with tabular figures; scrolls sideways on narrow screens
	let {
		caption,
		captionHidden = false,
		columns,
		children,
		testid
	}: {
		caption: string;
		captionHidden?: boolean;
		columns: { label: string; numeric?: boolean; hidden?: boolean }[];
		children: Snippet;
		testid?: string;
	} = $props();
</script>

<!-- A scrollable region must be reachable by keyboard (WCAG 2.1.1) -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->

<div
	class="overflow-x-auto rounded-panel border border-line bg-surface"
	role="region"
	aria-label={caption}
	tabindex="0"
>
	<table class="w-full border-collapse text-left" data-testid={testid}>
		<caption
			class={captionHidden ? 'sr-only' : 'px-4 py-4 text-left text-lg font-semibold text-ink'}
			>{caption}</caption
		>
		<thead class="bg-sunken">
			<tr>
				{#each columns as column (column.label)}
					<th
						scope="col"
						class="px-4 py-4 font-semibold text-ink {column.numeric ? 'text-right' : ''}"
						><span class={column.hidden ? 'sr-only' : ''}>{column.label}</span></th
					>
				{/each}
			</tr>
		</thead>
		<tbody class="divide-y divide-line tabular-nums [&_td]:px-4 [&_td]:py-4">
			{@render children()}
		</tbody>
	</table>
</div>
