<script lang="ts">
	import { page } from '$app/stores';
	import { isActive, navItems } from '$lib/navigation';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();
</script>

<nav class="bg-gray-800 w-64 min-h-screen p-4 {className}" aria-label="Hauptnavigation">
	<div class="space-y-1">
		{#each navItems as item}
			{@const active = isActive(item.href, $page.url.pathname)}
			<a
				href={item.href}
				class="flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 {active
					? 'bg-gray-900 text-white'
					: 'text-gray-300 hover:bg-gray-700 hover:text-white'}"
			>
				<span class="material-symbols-outlined text-xl" aria-hidden="true">
					{item.icon}
				</span>
				<span>{item.name}</span>
			</a>
		{/each}
	</div>

	<!-- Help Section -->
	<div class="mt-8 pt-8 border-t border-gray-700">
		<a
			href="/help"
			class="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-150"
		>
			<span class="material-symbols-outlined text-xl" aria-hidden="true">help</span>
			<span>Hilfe & Support</span>
		</a>
	</div>
</nav>
