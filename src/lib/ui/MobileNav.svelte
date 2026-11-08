<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { closeMobileNav, mobileNavOpen } from '$lib/stores/navigation';
	import { mobileNavGroups } from './navigation';
	import IconButton from '$lib/ui/IconButton.svelte';
	import LanguageSwitcher from '$lib/ui/LanguageSwitcher.svelte';
	import NavList from '$lib/ui/NavList.svelte';
	import { makeInert } from '$lib/inert';
	import { MediaQuery } from 'svelte/reactivity';

	// The main menu below 768 px (#740): a modal drawer that holds the focus while open;
	// the page behind it is inert (#651), its scrim not, so a click on it still closes the menu
	let modal = $state<HTMLElement>();
	let drawer = $state<HTMLElement>();

	$effect(() => {
		if (!$mobileNavOpen || !drawer || !modal) return;
		const opener = document.activeElement as HTMLElement | null;
		const restore = makeInert(modal);
		drawer.querySelector<HTMLElement>('a, button')?.focus();
		return () => {
			restore();
			// closed by a wide window, the menu button is hidden: the focus goes to the current area of the main
			// navigation, not to the page (fallback review of #1115)
			const shown = (element: HTMLElement | null | undefined) =>
				element?.checkVisibility?.() ?? !!element;
			const current = [...document.querySelectorAll<HTMLElement>('[aria-current="page"]')].find(
				shown
			);
			(shown(opener) ? opener : current)?.focus();
		};
	});

	// at md (48rem, 768 px at the default font size, #740) the main navigation shows and the drawer hides: a menu left open would keep the page inert
	const wide = new MediaQuery('min-width: 48rem');
	$effect(() => {
		if (wide.current) closeMobileNav();
	});

	function keydown(event: KeyboardEvent) {
		if (!$mobileNavOpen) return;
		// Escape in the open language list closes only the list (#657); this handler runs before the list's own
		if (event.key === 'Escape' && !drawer?.querySelector('#language-menu')) closeMobileNav();
		if (event.key !== 'Tab' || !drawer) return;
		event.preventDefault();
		// without the layer behind an open list, which closes it on a click (#657)
		const focusable = [...drawer.querySelectorAll<HTMLElement>('a, button:not([tabindex="-1"])')];
		const at = focusable.indexOf(document.activeElement as HTMLElement);
		const next = (at + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length;
		focusable[next]?.focus();
	}
</script>

<svelte:window onkeydown={keydown} />

{#if $mobileNavOpen}
	<div bind:this={modal}>
		<div
			class="fixed inset-0 z-40 bg-scrim md:hidden"
			data-testid="mobile-nav-scrim"
			aria-hidden="true"
			onclick={closeMobileNav}
		></div>
		<div
			bind:this={drawer}
			class="fixed inset-y-0 left-0 z-50 flex w-80 max-w-full flex-col bg-surface shadow-overlay md:hidden"
			role="dialog"
			aria-modal="true"
			aria-label={m.nav_main()}
		>
			<div class="flex h-16 items-center justify-between border-b border-line px-4">
				<span class="text-xl font-bold text-ink">Dwello</span>
				<IconButton icon="close" label={m.nav_close_menu()} onclick={closeMobileNav} />
			</div>
			<!-- the header has no room for the language choice below 768 px (#657) -->
			<nav class="flex justify-end border-b border-line px-4 py-2" aria-label={m.language_choice()}>
				<LanguageSwitcher />
			</nav>
			<nav class="flex-1 overflow-y-auto px-4 py-6" aria-label={m.nav_main()}>
				<NavList groups={mobileNavGroups} onnavigate={closeMobileNav} />
			</nav>
		</div>
	</div>
{/if}
