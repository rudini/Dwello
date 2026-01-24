<script lang="ts">
	import { page } from '$app/stores';

	interface NavItem {
		name: string;
		href: string;
		icon: string;
	}

	const navItems: NavItem[] = [
		{ name: 'Dashboard', href: '/', icon: 'dashboard' },
		{ name: 'Buildings', href: '/buildings', icon: 'apartment' },
		{ name: 'Apartments', href: '/apartments', icon: 'door_front' },
		{ name: 'Tenants', href: '/tenants', icon: 'people' },
		{ name: 'Contracts', href: '/contracts', icon: 'description' },
		{ name: 'Invoices', href: '/invoices', icon: 'receipt_long' },
		{ name: 'Statements', href: '/statements', icon: 'summarize' },
		{ name: 'Configuration', href: '/config', icon: 'settings' }
	];

	function isActive(href: string, currentPath: string): boolean {
		if (href === '/') {
			return currentPath === '/';
		}
		return currentPath.startsWith(href);
	}
</script>

<nav class="bg-gray-800 w-64 min-h-screen p-4">
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
			<span>Help & Support</span>
		</a>
	</div>
</nav>
