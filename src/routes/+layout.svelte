<script lang="ts">
	import '../styles/globals.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { user, clearStores } from '$lib/stores';
	import { getXsrfTokenFromCookie } from '$lib/api';
	import { initI18n } from '$lib/i18n';
	import { isLoading as i18nLoading } from 'svelte-i18n';
	import Header from '$lib/components/Header.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import MobileNav from '$lib/components/MobileNav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import ToastContainer from '$lib/components/ToastContainer.svelte';
	import type { LayoutData } from './$types';
	import type { Snippet } from 'svelte';

	// Initialize i18n
	initI18n();

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	// Pages that don't require authentication
	const publicPaths = ['/login', '/auth', '/error'];

	function isPublicPath(path: string): boolean {
		return publicPaths.some((p) => path.startsWith(p));
	}

	// Sync server-loaded user to store
	$effect(() => {
		if (data.user) {
			user.set(data.user);
		} else {
			user.set(null);
		}
	});

	// Redirect to login if not authenticated on protected pages
	$effect(() => {
		if (!isPublicPath($page.url.pathname) && !data.user) {
			goto('/login');
		}
	});

	// Setup token refresh interval (every 50 minutes)
	onMount(() => {
		const refreshInterval = setInterval(
			async () => {
				if ($user && !isPublicPath($page.url.pathname)) {
					try {
						const xsrfToken = getXsrfTokenFromCookie();
						const response = await fetch('/auth/refresh', {
							method: 'POST',
							headers: xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : {}
						});
						if (!response.ok) {
							console.warn('Token refresh failed, logging out');
							clearStores();
							goto('/login');
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
	const showAuthenticatedLayout = $derived(!isPublicPath($page.url.pathname) && data.user !== null);
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>Dwello - Property Management</title>
</svelte:head>

<!-- Skip to main content link for accessibility -->
<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
>
	Zum Hauptinhalt springen
</a>

{#if showAuthenticatedLayout}
	<!-- Authenticated Layout -->
	<div class="min-h-screen flex flex-col bg-slate-50">
		<Header user={data.user} />
		<div class="flex flex-1">
			<Navigation class="hidden md:block" />
			<main id="main-content" class="flex-1 p-4 md:p-6" tabindex="-1">
				{@render children()}
			</main>
		</div>
		<Footer />
	</div>
	<!-- Mobile navigation drawer -->
	<MobileNav />
{:else}
	<!-- Public Layout (Login, Error pages) -->
	<div class="min-h-screen bg-slate-50">
		<main id="main-content" tabindex="-1">
			{@render children()}
		</main>
	</div>
{/if}

<!-- Toast notifications -->
<ToastContainer />
