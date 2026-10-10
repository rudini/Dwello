<script lang="ts">
	import { closeMobileNav, mobileNavOpen } from '$lib/stores/navigation';
	import { navGroups } from '$lib/navigation';
	import IconButton from '$lib/ui/IconButton.svelte';
	import NavList from '$lib/ui/NavList.svelte';

	// The main menu below 1024 px: a modal drawer that holds the focus while open
	let drawer = $state<HTMLElement>();

	$effect(() => {
		if (!$mobileNavOpen || !drawer) return;
		const opener = document.activeElement as HTMLElement | null;
		drawer.querySelector<HTMLElement>('a, button')?.focus();
		return () => opener?.focus();
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
	<div
		class="fixed inset-0 z-40 bg-scrim lg:hidden"
		aria-hidden="true"
		onclick={closeMobileNav}
	></div>
	<div
		bind:this={drawer}
		class="fixed inset-y-0 left-0 z-50 flex w-80 max-w-full flex-col bg-surface shadow-overlay lg:hidden"
		role="dialog"
		aria-modal="true"
		aria-label="Hauptnavigation"
	>
		<div class="flex h-16 items-center justify-between border-b border-line px-4">
			<span class="text-xl font-bold text-ink">Dwello</span>
			<IconButton icon="close" label="Menü schliessen" onclick={closeMobileNav} />
		</div>
		<nav class="flex-1 overflow-y-auto px-4 py-6" aria-label="Hauptnavigation">
			<NavList groups={navGroups} onnavigate={closeMobileNav} />
		</nav>
	</div>
{/if}
