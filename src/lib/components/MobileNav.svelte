<script lang="ts">
	import { mobileNavOpen, closeMobileNav } from '$lib/stores/navigation';
	import Icon from './Icon.svelte';
	import NavLinks from './NavLinks.svelte';

	function handleBackdropClick() {
		closeMobileNav();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			closeMobileNav();
		}
	}

	// Trap focus inside the drawer when open
	let drawerElement = $state<HTMLElement | null>(null);

	$effect(() => {
		if ($mobileNavOpen && drawerElement) {
			const focusableElements = drawerElement.querySelectorAll<HTMLElement>(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			);
			const firstElement = focusableElements[0];
			const lastElement = focusableElements[focusableElements.length - 1];

			firstElement?.focus();

			const handleTabKey = (e: KeyboardEvent) => {
				if (e.key !== 'Tab') return;

				if (e.shiftKey) {
					if (document.activeElement === firstElement) {
						e.preventDefault();
						lastElement?.focus();
					}
				} else {
					if (document.activeElement === lastElement) {
						e.preventDefault();
						firstElement?.focus();
					}
				}
			};

			document.addEventListener('keydown', handleTabKey);
			return () => document.removeEventListener('keydown', handleTabKey);
		}
	});
</script>

<svelte:window onkeydown={handleKeydown} />

{#if $mobileNavOpen}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 bg-black/50 z-40 md:hidden"
		onclick={handleBackdropClick}
		onkeydown={(e) => e.key === 'Enter' && handleBackdropClick()}
		role="button"
		tabindex="-1"
		aria-label="Menü schliessen"
	></div>

	<!-- Drawer -->
	<div
		bind:this={drawerElement}
		class="fixed inset-y-0 left-0 w-72 bg-white z-50 md:hidden animate-in slide-in-from-left duration-200 flex flex-col"
		role="dialog"
		aria-modal="true"
		aria-label="Hauptnavigation"
	>
		<div class="flex items-center justify-between h-16 px-4 border-b border-gray-200">
			<span class="text-xl font-bold text-gray-900">Dwello</span>
			<button
				type="button"
				onclick={closeMobileNav}
				class="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
				aria-label="Menü schliessen"
			>
				<Icon name="close" size={24} />
			</button>
		</div>

		<div class="flex-1 overflow-y-auto p-3">
			<NavLinks onnavigate={closeMobileNav} />
		</div>
	</div>
{/if}

<style>
	@keyframes slideInFromLeft {
		from {
			transform: translateX(-100%);
		}
		to {
			transform: translateX(0);
		}
	}

	.slide-in-from-left {
		animation: slideInFromLeft 0.2s ease-out;
	}
</style>
