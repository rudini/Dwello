<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { closeMobileNav, mobileNavOpen } from '$lib/stores/navigation';
	import { navGroups } from './navigation';
	import IconButton from '$lib/ui/IconButton.svelte';
	import NavList from '$lib/ui/NavList.svelte';
	import { makeInert } from './inert';
	import { MediaQuery } from 'svelte/reactivity';

	// The main menu below 1024 px: a modal drawer that holds the focus while open;
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
			opener?.focus();
		};
	});

	// at lg (64rem, 1024 px at the default font size) the main navigation shows and the drawer hides: a menu left open would keep the page inert
	const wide = new MediaQuery('min-width: 64rem');
	$effect(() => {
		if (wide.current) closeMobileNav();
	});

	function keydown(event: KeyboardEvent) {
		if (!$mobileNavOpen) return;
		if (event.key === 'Escape') closeMobileNav();
		if (event.key !== 'Tab' || !drawer) return;
		event.preventDefault();
		const focusable = [...drawer.querySelectorAll<HTMLElement>('a, button')];
		const at = focusable.indexOf(document.activeElement as HTMLElement);
		const next = (at + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length;
		focusable[next]?.focus();
	}
</script>

<svelte:window onkeydown={keydown} />

{#if $mobileNavOpen}
	<div bind:this={modal}>
		<div
			class="fixed inset-0 z-40 bg-scrim lg:hidden"
			data-testid="mobile-nav-scrim"
			aria-hidden="true"
			onclick={closeMobileNav}
		></div>
		<div
			bind:this={drawer}
			class="fixed inset-y-0 left-0 z-50 flex w-80 max-w-full flex-col bg-surface shadow-overlay lg:hidden"
			role="dialog"
			aria-modal="true"
			aria-label={m.nav_main()}
		>
			<div class="flex h-16 items-center justify-between border-b border-line px-4">
				<span class="text-xl font-bold text-ink">Dwello</span>
				<IconButton icon="close" label={m.nav_close_menu()} onclick={closeMobileNav} />
			</div>
			<nav class="flex-1 overflow-y-auto px-4 py-6" aria-label={m.nav_main()}>
				<NavList groups={navGroups} onnavigate={closeMobileNav} />
			</nav>
		</div>
	</div>
{/if}
