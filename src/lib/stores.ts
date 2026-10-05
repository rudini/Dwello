/**
 * Svelte Stores for Application State
 */

import { writable } from 'svelte/store';

/**
 * User interface from JWT payload
 */
export interface User {
	sub: string;
	email: string;
	name: string;
	picture?: string;
	provider?: string;
}

/**
 * User store - holds current authenticated user
 */
export const user = writable<User | null>(null);

/**
 * Toast notifications
 */
export interface Toast {
	id: number;
	type: 'success' | 'error' | 'warning' | 'info';
	message: string;
	duration?: number;
}

export const toasts = writable<Toast[]>([]);

let toastId = 0;

/**
 * Add a toast notification
 */
export function addToast(type: Toast['type'], message: string, duration = 5000): void {
	const id = ++toastId;
	toasts.update((all) => [...all, { id, type, message, duration }]);

	if (duration > 0) {
		setTimeout(() => {
			dismissToast(id);
		}, duration);
	}
}

/**
 * Dismiss a toast notification
 */
export function dismissToast(id: number): void {
	toasts.update((all) => all.filter((t) => t.id !== id));
}

/**
 * Clear all stores (used on logout)
 */
export function clearStores(): void {
	user.set(null);
}
