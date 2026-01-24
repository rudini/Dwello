<script lang="ts">
	import '../styles/globals.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { user, authLoading, clearStores } from '$lib/stores';
	import Header from '$lib/components/Header.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';

	// Pages that don't require authentication
	const publicPaths = ['/login', '/auth', '/error'];

	function isPublicPath(path: string): boolean {
		return publicPaths.some((p) => path.startsWith(p));
	}

	// Check authentication on mount
	onMount(async () => {
		// Skip auth check for public paths
		if (isPublicPath($page.url.pathname)) {
			authLoading.set(false);
			return;
		}

		try {
			const response = await fetch('/auth/me');
			if (response.ok) {
				const data = await response.json();
				user.set(data.user);
			} else {
				// Not authenticated, redirect to login
				clearStores();
				await goto('/login');
			}
		} catch (error) {
			console.error('Auth check failed:', error);
			clearStores();
			await goto('/login');
		} finally {
			authLoading.set(false);
		}
	});

	// Setup token refresh interval (every 50 minutes)
	onMount(() => {
		const refreshInterval = setInterval(
			async () => {
				if ($user && !isPublicPath($page.url.pathname)) {
					try {
						const response = await fetch('/auth/refresh', {
							method: 'POST',
							headers: {
								'X-XSRF-TOKEN':
									document.cookie
										.split(';')
										.find((c) => c.trim().startsWith('xsrf-token='))
										?.split('=')[1] || ''
							}
						});
						if (!response.ok) {
							console.warn('Token refresh failed, logging out');
							clearStores();
							await goto('/login');
						}
					} catch (error) {
						console.error('Token refresh error:', error);
					}
				}
			},
			50 * 60 * 1000
		); // 50 minutes

		return () => clearInterval(refreshInterval);
	});

	// Derived state for showing authenticated layout
	const showAuthenticatedLayout = $derived(!isPublicPath($page.url.pathname) && $user !== null);
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>Dwello - Property Management</title>
</svelte:head>

{#if $authLoading && !isPublicPath($page.url.pathname)}
	<!-- Loading State -->
	<div class="min-h-screen flex items-center justify-center bg-slate-50">
		<div class="text-center">
			<svg
				class="animate-spin h-8 w-8 mx-auto text-blue-600"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle
					class="opacity-25"
					cx="12"
					cy="12"
					r="10"
					stroke="currentColor"
					stroke-width="4"
				></circle>
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				></path>
			</svg>
			<p class="mt-2 text-gray-600">Loading...</p>
		</div>
	</div>
{:else if showAuthenticatedLayout}
	<!-- Authenticated Layout -->
	<div class="min-h-screen flex flex-col bg-slate-50">
		<Header />
		<div class="flex flex-1">
			<Navigation />
			<main class="flex-1 p-6">
				<slot />
			</main>
		</div>
		<Footer />
	</div>
{:else}
	<!-- Public Layout (Login, Error pages) -->
	<div class="min-h-screen bg-slate-50">
		<slot />
	</div>
{/if}
