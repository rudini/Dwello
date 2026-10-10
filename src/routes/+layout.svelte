<script lang="ts">
	import '../styles/globals.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { afterNavigate, goto } from '$app/navigation';
	import { user, clearStores } from '$lib/stores';
	import { getXsrfTokenFromCookie } from '$lib/api';
	import Header from '$lib/ui/Header.svelte';
	import Navigation from '$lib/ui/Navigation.svelte';
	import MobileNav from '$lib/ui/MobileNav.svelte';
	import Footer from '$lib/ui/Footer.svelte';
	import ToastRegion from '$lib/ui/ToastRegion.svelte';
	import { isListSearch } from '$lib/list-url';
	import type { LayoutData } from './$types';
	import type { Snippet } from 'svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	// Pages without the app frame; hooks.server.ts lets only signed-in users reach the others
	const publicPaths = ['/login', '/auth'];

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

	// Runs after every component below is mounted: the page now reacts to input (E2E tests wait for it)
	onMount(() => {
		document.body.dataset.hydrated = 'true';
	});

	// After a search on a list the focus goes to its results, so their number is read out
	afterNavigate((navigation) => {
		if (isListSearch(navigation))
			document.querySelector<HTMLElement>('main [data-results]')?.focus();
	});

	// Derived state for showing authenticated layout
	const showAuthenticatedLayout = $derived(!isPublicPath($page.url.pathname) && data.user !== null);
</script>

<svelte:head>
	<title>Dwello</title>
</svelte:head>

<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
>
	Zum Inhalt springen
</a>

{#if showAuthenticatedLayout}
	<div class="flex min-h-screen flex-col bg-canvas">
		<Header user={data.user} />
		<div class="flex flex-1">
			<Navigation />
			<main id="main-content" class="min-w-0 flex-1 px-4 py-8 lg:px-10" tabindex="-1">
				<div class="mx-auto max-w-6xl">
					{@render children()}
				</div>
			</main>
		</div>
		<Footer />
	</div>
	<MobileNav />
{:else}
	<div class="min-h-screen bg-canvas">
		<main id="main-content" tabindex="-1">
			{@render children()}
		</main>
	</div>
{/if}

<ToastRegion />
