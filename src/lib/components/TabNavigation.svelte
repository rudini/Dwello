<script lang="ts">
	import Icon from './Icon.svelte';

	interface Tab {
		id: string;
		label: string;
		icon?: string;
	}

	interface Props {
		tabs: Tab[];
		activeTab: string;
		onTabChange: (tabId: string) => void;
	}

	let { tabs, activeTab, onTabChange }: Props = $props();
</script>

<div class="flex gap-6 border-b border-slate-200">
	{#each tabs as tab (tab.id)}
		<button
			onclick={() => onTabChange(tab.id)}
			class="py-4 px-0 border-b-2 transition-colors font-medium flex items-center gap-2 {activeTab === tab.id
				? 'border-primary text-primary'
				: 'border-transparent text-slate-600 hover:text-slate-900'}"
		>
			{#if tab.icon}
				<Icon name={tab.icon} size={18} />
			{/if}
			{tab.label}
		</button>
	{/each}
</div>
