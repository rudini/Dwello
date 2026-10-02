<script lang="ts">
	import { page } from '$app/stores';
	import { isActive, navItems } from '$lib/navigation';
	import { mobileNavOpen, closeMobileNav } from '$lib/stores/navigation';
	import Icon from './Icon.svelte';

	function handleNavClick() {
		closeMobileNav();
	}

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
		class="fixed inset-y-0 left-0 w-72 bg-gray-800 z-50 md:hidden animate-in slide-in-from-left duration-200 flex flex-col"
		role="dialog"
		aria-modal="true"
		aria-label="Hauptnavigation"
	>
		<!-- Header -->
		<div class="flex items-center justify-between p-4 border-b border-gray-700">
			<span class="text-xl font-bold text-white">Dwello</span>
			<button
				type="button"
				onclick={closeMobileNav}
				class="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
				aria-label="Menü schliessen"
			>
				<Icon name="close" size={24} />
			</button>
		</div>

		<!-- Navigation Items -->
		<div class="flex-1 overflow-y-auto p-4">
			<div class="space-y-1">
				{#each navItems as item}
					{@const active = isActive(item.href, $page.url.pathname)}
					<a
						href={item.href}
						onclick={handleNavClick}
						class="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 {active
							? 'bg-gray-900 text-white'
							: 'text-gray-300 hover:bg-gray-700 hover:text-white'}"
					>
						<span class="material-symbols-outlined text-xl" aria-hidden="true">
							{item.icon}
						</span>
						<span>{item.name}</span>
					</a>
				{/each}
			</div>
		</div>

		<!-- Help Section -->
		<div class="p-4 border-t border-gray-700">
			<a
				href="/help"
				onclick={handleNavClick}
				class="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-150"
			>
				<span class="material-symbols-outlined text-xl" aria-hidden="true">help</span>
				<span>Hilfe & Support</span>
			</a>
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
