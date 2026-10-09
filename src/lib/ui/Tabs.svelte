<script lang="ts">
	import type { Snippet } from 'svelte';

	// Tabs with roving focus: Tab enters the selected tab, arrow keys move and select
	let {
		label,
		tabs,
		selected = $bindable(),
		children
	}: {
		label: string;
		tabs: { id: string; label: string }[];
		selected: string;
		children: Snippet;
	} = $props();

	let list = $state<HTMLElement>();

	function keydown(event: KeyboardEvent) {
		const index = tabs.findIndex((tab) => tab.id === selected);
		const next = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: tabs.length - 1 }[
			event.key
		];
		if (next === undefined) return;
		event.preventDefault();
		const target = (next + tabs.length) % tabs.length;
		selected = tabs[target].id;
		list?.querySelectorAll<HTMLElement>('[role=tab]')[target].focus();
	}
</script>

<div class="flex flex-col gap-6">
	<div
		bind:this={list}
		role="tablist"
		aria-label={label}
		class="flex"
		tabindex="-1"
		onkeydown={keydown}
	>
		{#each tabs as tab (tab.id)}
			<button
				type="button"
				role="tab"
				id="tab-{tab.id}"
				aria-selected={tab.id === selected}
				aria-controls={tab.id === selected ? `tabpanel-${tab.id}` : undefined}
				tabindex={tab.id === selected ? 0 : -1}
				onclick={() => (selected = tab.id)}
				class="min-h-12 border-b-4 px-4 font-semibold {tab.id === selected
					? 'border-accent text-ink'
					: 'border-line text-ink-muted hover:text-ink'}"
			>
				{tab.label}
			</button>
		{/each}
	</div>
	<div role="tabpanel" id="tabpanel-{selected}" aria-labelledby="tab-{selected}" tabindex="0">
		{@render children()}
	</div>
</div>
