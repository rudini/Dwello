/**
 * Svelte Stores for Application State
 *
 * Core entity types are imported from types.ts to ensure consistency
 * with the backend schema.
 */

import { writable, derived, type Readable } from 'svelte/store';
import type {
	BuildingWithStats,
	Apartment as TypesApartment,
	Tenant as TypesTenant,
	Statement as TypesStatement
} from './types';

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

// Re-export types for convenience (use types from types.ts)
export type Building = BuildingWithStats;
export type Apartment = TypesApartment;
export type Tenant = TypesTenant;
export type Statement = TypesStatement;

/**
 * User store - holds current authenticated user
 */
export const user = writable<User | null>(null);

/**
 * Derived store for authentication status
 */
export const isAuthenticated: Readable<boolean> = derived(user, ($user) => $user !== null);

/**
 * Buildings store
 */
export const buildings = writable<Building[]>([]);

/**
 * Selected building store
 */
export const selectedBuilding = writable<Building | null>(null);

/**
 * Apartments store
 */
export const apartments = writable<Apartment[]>([]);

/**
 * Tenants store
 */
export const tenants = writable<Tenant[]>([]);

/**
 * Statements store
 */
export const statements = writable<Statement[]>([]);

/**
 * Global loading state
 */
export const isLoading = writable<boolean>(false);

/**
 * Global error message
 */
export const errorMessage = writable<string | null>(null);

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
export function addToast(
	type: Toast['type'],
	message: string,
	duration = 5000
): void {
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
	buildings.set([]);
	selectedBuilding.set(null);
	apartments.set([]);
	tenants.set([]);
	statements.set([]);
	errorMessage.set(null);
}
