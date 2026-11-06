<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import '@fontsource-variable/inter';
	import '../styles/globals.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { afterNavigate, goto } from '$app/navigation';
	import { getXsrfTokenFromCookie } from '$lib/api';
	import Header from '$lib/ui/Header.svelte';
	import Navigation from '$lib/ui/Navigation.svelte';
	import MobileNav from '$lib/ui/MobileNav.svelte';
	import Footer from '$lib/ui/Footer.svelte';
	import ToastRegion from '$lib/ui/ToastRegion.svelte';
	import LanguageSwitcher from '$lib/ui/LanguageSwitcher.svelte';
	import { isListNavigation } from '$lib/list-url';
	import type { LayoutData } from './$types';
	import type { Snippet } from 'svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	// Pages without the app frame; hooks.server.ts lets only signed-in users reach the others
	const publicPaths = ['/login', '/auth'];

	function isPublicPath(path: string): boolean {
		return publicPaths.some((p) => path.startsWith(p));
	}

	// Setup token refresh interval (every 50 minutes)
	onMount(() => {
		const refreshInterval = setInterval(
			async () => {
				if (data.user && !isPublicPath($page.url.pathname)) {
					try {
						const xsrfToken = getXsrfTokenFromCookie();
						const response = await fetch('/auth/refresh', {
							method: 'POST',
							headers: xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : {}
						});
						if (!response.ok) {
							console.warn('Token refresh failed, logging out');
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

	// Runs after every component below is mounted; SvelteKit starts its router later in the same task, and a submit
	// before that is lost in Firefox (#869). One task later the page reacts to input (E2E tests wait for it)
	onMount(() => {
		setTimeout(() => (document.body.dataset.hydrated = 'true'));
	});

	// After a search on a list the focus goes to its results, so their number is read out
	// a filter that applies on change keeps the focus, so the arrow keys go on through its choices (persona Sven S-1, #677)
	afterNavigate((navigation) => {
		if (isListNavigation(navigation) && !(document.activeElement instanceof HTMLSelectElement))
			document.querySelector<HTMLElement>('main [data-results]')?.focus();
	});

	// Derived state for showing authenticated layout
	const showAuthenticatedLayout = $derived(!isPublicPath($page.url.pathname) && data.user !== null);
	const publicLink = 'inline-flex min-h-12 items-center text-accent underline underline-offset-4';
	const contentPage = $derived(['/help', '/privacy', '/terms'].includes($page.url.pathname));
</script>

<svelte:head>
	<title>Dwello</title>
</svelte:head>

<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
>
	{m.shell_skip_to_content()}
</a>

<!-- Public demo (DEMO=on): one line before the header, outside main, so the skip link leads to the h1 (#675);
     the sign-in page shows the full notice itself, the help explains it under #demo -->
{#snippet demoLine()}
	{#if data.demo && $page.url.pathname !== '/login'}
		<p class="bg-caution-soft px-4 py-2 text-ink" data-testid="demo-notice">
			{m.demo_line_text()}
			<a href="/help#demo" class={publicLink}>{m.demo_line_link()}</a>
		</p>
	{/if}
{/snippet}

{#if showAuthenticatedLayout}
	<div class="flex min-h-screen flex-col bg-canvas">
		<!-- inside the frame, so a short page still fits the screen (code review 675 C-2) -->
		{@render demoLine()}
		<Header user={data.user} />
		<div class="flex flex-1">
			<Navigation />
			<main id="main-content" class="min-w-0 flex-1 px-4 py-8 lg:px-10" tabindex="-1">
				<div class="mx-auto max-w-6xl">
					{@render children()}
				</div>
			</main>
		</div>
		<!-- the menu before the toasts: on the same layer, the later one lies on top (#669, code review C-1) -->
		<MobileNav />
		<ToastRegion />
		<Footer />
	</div>
{:else}
	<div class="flex min-h-screen flex-col bg-canvas">
		<!-- inside the frame, so a short page still fits the screen (code review 675 C-2) -->
		{@render demoLine()}
		<!-- Without the header the language choice stands alone at the top; links to signing in and to help, the footer to the legal pages;
		     a header of its own, so the links sit in a landmark (#656) -->
		<header class="flex items-center justify-end gap-4 px-4 pt-4">
			<div class="mr-auto flex gap-4">
				{#if contentPage}
					<a href="/login" class={publicLink} data-testid="public-login-link">{m.login_title()}</a>
				{/if}
				{#if $page.url.pathname !== '/help'}
					<a href="/help" class={publicLink} data-testid="public-help-link">{m.nav_help()}</a>
				{/if}
			</div>
			<nav aria-label={m.language_choice()}>
				<LanguageSwitcher />
			</nav>
		</header>
		{#if contentPage}
			<!-- Help and the legal pages, read before signing in: the same margins as inside the frame -->
			<main id="main-content" class="flex-1 px-4 py-8 lg:px-10" tabindex="-1">
				<div class="mx-auto max-w-6xl">
					{@render children()}
				</div>
			</main>
		{:else}
			<main id="main-content" class="flex flex-1 flex-col" tabindex="-1">
				{@render children()}
			</main>
		{/if}
		<ToastRegion />
		<Footer />
	</div>
{/if}
