<script lang="ts">
	import { goto } from '$app/navigation';
	import { _ } from 'svelte-i18n';
	import { clearStores } from '$lib/stores';
	import { getXsrfTokenFromCookie } from '$lib/api';
	import { openMobileNav } from '$lib/stores/navigation';
	import Icon from './Icon.svelte';
	import type { User } from '$lib/stores';

	let { user }: { user: User | null } = $props();

	let showDropdown = $state(false);
	let imageError = $state(false);

	function handleImageError() {
		imageError = true;
	}

	async function logout() {
		try {
			const xsrfToken = getXsrfTokenFromCookie();
			await fetch('/auth/logout', {
				method: 'POST',
				headers: xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : {}
			});
			clearStores();
			await goto('/login');
		} catch (error) {
			console.error('Logout failed:', error);
			// Force redirect anyway
			window.location.href = '/login';
		}
	}

	function toggleDropdown() {
		showDropdown = !showDropdown;
	}

	function closeDropdown() {
		showDropdown = false;
	}
</script>

<header class="bg-white border-b border-gray-200 sticky top-0 z-30">
	<div class="px-4 sm:px-6">
		<div class="flex justify-between items-center h-16">
			<!-- Mobile menu button and Logo -->
			<div class="flex items-center gap-2">
				<button
					type="button"
					onclick={openMobileNav}
					class="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
					aria-label="Menü öffnen"
					data-testid="mobile-menu-button"
				>
					<Icon name="menu" size={24} />
				</button>
				<a href="/" class="flex items-center gap-2.5" data-testid="header-logo">
					<span
						class="flex items-center justify-center size-9 rounded-lg bg-primary text-white"
						aria-hidden="true"
					>
						<Icon name="home_work" size={22} />
					</span>
					<span class="text-xl font-bold text-gray-900">Dwello</span>
				</a>
			</div>

			<!-- User Menu -->
			{#if user}
				<div class="relative">
					<button
						type="button"
						onclick={toggleDropdown}
						data-testid="user-menu-button"
						class="flex items-center gap-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						{#if user.picture && !imageError}
							<img
								src={user.picture}
								alt={user.name}
								class="h-8 w-8 rounded-full"
								onerror={handleImageError}
								referrerpolicy="no-referrer"
							/>
						{:else}
							<div
								class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium"
							>
								{(user.name || user.email || '?').charAt(0).toUpperCase()}
							</div>
						{/if}
						<span class="hidden md:block text-gray-700" data-testid="user-name"
							>{user.name || user.email}</span
						>
						<svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>

					<!-- Dropdown Menu -->
					{#if showDropdown}
						<!-- Backdrop -->
						<button
							type="button"
							class="fixed inset-0 z-10"
							onclick={closeDropdown}
							onkeydown={(e) => e.key === 'Escape' && closeDropdown()}
							aria-label={$_('accessibility.closeMenu')}
						></button>

						<div
							class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20"
						>
							<div class="py-1">
								<div class="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
									<p class="font-medium">{user.name || 'User'}</p>
									<p class="text-gray-500 truncate">{user.email}</p>
								</div>
								<a
									href="/config"
									data-testid="user-menu-settings"
									class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
									onclick={closeDropdown}
								>
									{$_('auth.settings')}
								</a>
								<button
									type="button"
									onclick={logout}
									data-testid="logout-button"
									class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
								>
									{$_('auth.signOut')}
								</button>
							</div>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</header>
