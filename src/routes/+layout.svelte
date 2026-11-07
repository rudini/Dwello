<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import '@fontsource-variable/inter';
	import '../styles/globals.css';
	import { onMount, tick } from 'svelte';
	import { page } from '$app/stores';
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
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
	// SvelteKit's announcer is on the page by then; the layout reads the title out itself (#1173, below)
	onMount(() => {
		setTimeout(() => {
			// muted and hidden, so its copy of the title is not read a second time in browse mode (Sven 1173)
			const announcer = document.getElementById('svelte-announcer');
			announcer?.setAttribute('aria-live', 'off');
			announcer?.setAttribute('aria-hidden', 'true');
			document.body.dataset.hydrated = 'true';
		});
	});

	// #1173 (Sven 2 P-4): the title is read out when another page opens; SvelteKit's own announcer would also read it
	// after a form action that stays on the page, so that one is silenced (onMount above)
	let pageTitle = $state('');
	let listResult = $state('');
	let navigations = 0;
	// After a search on a list the focus goes to its results, so their number is read out
	// a filter that applies on change keeps the focus, so the arrow keys go on through its choices (persona Sven S-1, #677)
	afterNavigate((navigation) => {
		const { from, to } = navigation;
		if (from && from.url.pathname !== to?.url.pathname)
			tick().then(() => (pageTitle = document.title));
		// a filter select, or a link that keeps the focus (the status tiles, #1162), stays where it is
		const keep =
			document.activeElement instanceof HTMLSelectElement ||
			document.activeElement?.closest('[data-sveltekit-keepfocus]');
		if (!isListNavigation(navigation)) return;
		const results = document.querySelector<HTMLElement>('main [data-results]');
		if (!keep) return results?.focus();
		// the focus stays in the filter, so the result is read out instead (#662, persona Sven S-1), unless the next
		// navigation has started meanwhile (S-5)
		const turn = navigations;
		tick().then(() => {
			if (turn === navigations) listResult = results?.textContent?.trim() ?? '';
		});
	});
	// every navigation empties the status: no earlier result is read on the next page or after «Suchen», and the same
	// count after another choice is read out again (code review 662-2 C-5, C-6)
	beforeNavigate(() => {
		navigations++;
		listResult = '';
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

<div aria-live="assertive" aria-atomic="true" class="sr-only" data-testid="page-title-announcer">
	{pageTitle}
</div>
<!-- the result of a list filter that keeps the focus (#662) -->
<div role="status" class="sr-only" data-testid="list-result-status">{listResult}</div>

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
