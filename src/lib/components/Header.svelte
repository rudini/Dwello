<script lang="ts">
	import { goto } from '$app/navigation';
	import { clearStores } from '$lib/stores';
	import { getXsrfTokenFromCookie } from '$lib/api';
	import { openMobileNav } from '$lib/stores/navigation';
	import Icon from '$lib/ui/Icon.svelte';
	import IconButton from '$lib/ui/IconButton.svelte';
	import type { User } from '$lib/stores';
	import { clearAllDrafts } from '$lib/wizard-draft';

	let { user }: { user: User | null } = $props();

	let menuOpen = $state(false);
	let menuButton = $state<HTMLButtonElement>();
	const displayName = $derived(user?.name || user?.email || '');

	function closeMenu() {
		menuOpen = false;
		menuButton?.focus();
	}

	async function logout() {
		clearAllDrafts(localStorage); // no personal data stays in the browser
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
			window.location.href = '/login'; // leave anyway
		}
	}
</script>

<svelte:window onkeydown={(event) => menuOpen && event.key === 'Escape' && closeMenu()} />

<header class="sticky top-0 z-30 border-b border-line bg-surface">
	<div class="flex h-16 items-center justify-between gap-4 px-4 lg:px-6">
		<div class="flex items-center gap-2">
			<span class="lg:hidden">
				<IconButton
					icon="menu"
					label="Menü öffnen"
					onclick={openMobileNav}
					testid="mobile-menu-button"
				/>
			</span>
			<a
				href="/dashboard"
				class="flex min-h-12 items-center gap-2 rounded-control px-2"
				data-testid="header-logo"
			>
				<span class="text-accent"><Icon name="home" size={24} /></span>
				<span class="text-xl font-bold text-ink">Dwello</span>
			</a>
		</div>

		{#if user}
			<div
				class="relative"
				onfocusout={(event) => {
					if (!event.currentTarget.contains(event.relatedTarget as Node | null)) menuOpen = false;
				}}
			>
				<button
					bind:this={menuButton}
					type="button"
					onclick={() => (menuOpen = !menuOpen)}
					aria-expanded={menuOpen}
					aria-controls="user-menu"
					class="flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-control px-2 text-ink hover:bg-sunken"
					data-testid="user-menu-button"
				>
					<Icon name="user" size={24} />
					<span class="hidden max-w-64 truncate md:inline" data-testid="user-name"
						>{displayName}</span
					>
					<span class="sr-only">Benutzermenü</span>
				</button>

				{#if menuOpen}
					<button
						type="button"
						class="fixed inset-0 z-10 cursor-default"
						tabindex="-1"
						aria-hidden="true"
						onclick={() => (menuOpen = false)}
					></button>
					<div
						id="user-menu"
						class="absolute right-0 z-20 mt-2 flex w-64 flex-col rounded-panel border border-line bg-surface py-2 shadow-raised"
					>
						<p class="truncate px-4 py-2 text-ink-muted">{user.email}</p>
						<a
							href="/config"
							onclick={() => (menuOpen = false)}
							class="flex min-h-12 items-center gap-2 px-4 text-ink hover:bg-sunken"
							data-testid="user-menu-settings"
						>
							<Icon name="settings" />
							Einstellungen
						</a>
						<button
							type="button"
							onclick={logout}
							class="flex min-h-12 items-center gap-2 px-4 text-left text-critical hover:bg-critical-soft"
							data-testid="logout-button"
						>
							<Icon name="arrow-back" />
							Abmelden
						</button>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</header>
