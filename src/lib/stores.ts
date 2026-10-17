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
	provider?: string;
}

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
 * Add a toast notification: long enough to read (WCAG 2.2.1); an error stays until it is closed.
 * The reading time starts when the toast region shows it.
 */
export function addToast(
	type: Toast['type'],
	message: string,
	duration = type === 'error' ? 0 : 8000
): void {
	const id = ++toastId;
	toasts.update((all) => [...all, { id, type, message, duration }]);
}

/**
 * Dismiss a toast notification
 */
export function dismissToast(id: number): void {
	toasts.update((all) => all.filter((t) => t.id !== id));
}
