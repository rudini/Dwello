<script lang="ts">
	import '../styles/globals.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { user, clearStores } from '$lib/stores';
	import Header from '$lib/components/Header.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: any } = $props();

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
						const response = await fetch('/auth/refresh', {
							method: 'POST',
							headers: {
								'X-XSRF-TOKEN':
									document.cookie
										.split(';')
										.find((c) => c.trim().startsWith('dwello_xsrf='))
										?.split('=')[1] || ''
							}
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

{#if showAuthenticatedLayout}
	<!-- Authenticated Layout -->
	<div class="min-h-screen flex flex-col bg-slate-50">
		<Header user={data.user} />
		<div class="flex flex-1">
			<Navigation />
			<main class="flex-1 p-6">
				{@render children()}
			</main>
		</div>
		<Footer />
	</div>
{:else}
	<!-- Public Layout (Login, Error pages) -->
	<div class="min-h-screen bg-slate-50">
		{@render children()}
	</div>
{/if}
