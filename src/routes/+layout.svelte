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
	import Alert from '$lib/ui/Alert.svelte';
	import { isListSearch } from '$lib/list-url';
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
	afterNavigate((navigation) => {
		if (isListSearch(navigation))
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

<!-- Public demo (DEMO=on): every visitor shares the data, reset every night; at the top of every page -->
{#snippet demoNotice(spacing: string)}
	{#if data.demo}
		<!-- a named region: found with landmark navigation, also before signing in -->
		<section class={spacing} aria-label={m.demo_notice_title()}>
			<Alert tone="caution" title={m.demo_notice_title()} testid="demo-notice">
				<p>{m.demo_notice_text()}</p>
			</Alert>
		</section>
	{/if}
{/snippet}

<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
>
	{m.shell_skip_to_content()}
</a>

{#if showAuthenticatedLayout}
	<div class="flex min-h-screen flex-col bg-canvas">
		<Header user={data.user} />
		<div class="flex flex-1">
			<Navigation />
			<main id="main-content" class="min-w-0 flex-1 px-4 py-8 lg:px-10" tabindex="-1">
				<div class="mx-auto max-w-6xl">
					{@render demoNotice('mb-8')}
					{@render children()}
				</div>
			</main>
		</div>
		<Footer />
	</div>
	<MobileNav />
{:else}
	<div class="flex min-h-screen flex-col bg-canvas">
		<!-- Without the header the language choice stands alone at the top; links to signing in and to help, the footer to the legal pages -->
		<div class="flex items-center justify-end gap-4 px-4 pt-4">
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
		</div>
		{#if contentPage}
			<!-- Help and the legal pages, read before signing in: the same margins as inside the frame -->
			<main id="main-content" class="flex-1 px-4 py-8 lg:px-10" tabindex="-1">
				<div class="mx-auto max-w-6xl">
					{@render demoNotice('mb-8')}
					{@render children()}
				</div>
			</main>
		{:else}
			<main id="main-content" class="flex flex-1 flex-col" tabindex="-1">
				{@render demoNotice('px-4 pt-4')}
				{@render children()}
			</main>
		{/if}
		<Footer />
	</div>
{/if}

<ToastRegion />
