/**
 * Navigation State Store
 *
 * Manages mobile navigation drawer state
 */

import { writable } from 'svelte/store';

/**
 * Mobile navigation open state
 */
export const mobileNavOpen = writable(false);

/**
 * Toggle mobile navigation
 */
export function toggleMobileNav(): void {
	mobileNavOpen.update((open) => !open);
}

/**
 * Open mobile navigation
 */
export function openMobileNav(): void {
	mobileNavOpen.set(true);
}

/**
 * Close mobile navigation
 */
export function closeMobileNav(): void {
	mobileNavOpen.set(false);
}
