/**
 * Svelte Stores for Application State
 */

import { writable, derived, type Readable } from 'svelte/store';

/**
 * User interface from JWT payload
 */
export interface User {
	id: string;
	email: string;
	name: string;
	picture?: string;
	provider?: string;
}

/**
 * Building interface
 */
export interface Building {
	id: number;
	name: string;
	address: string;
	city: string;
	postalCode: string;
	canton: string;
	latitude?: number;
	longitude?: number;
	apartmentCount?: number;
	occupiedCount?: number;
}

/**
 * Apartment interface
 */
export interface Apartment {
	id: number;
	buildingId: number;
	number: string;
	floor: number;
	area: number;
	rooms: number;
	status: 'occupied' | 'vacant' | 'reserved';
	currentTenantId?: number;
}

/**
 * Tenant interface
 */
export interface Tenant {
	id: number;
	firstName: string;
	lastName: string;
	email?: string;
	phone?: string;
	language: 'de' | 'fr' | 'it' | 'rm' | 'en';
}

/**
 * Statement interface
 */
export interface Statement {
	id: number;
	tenantId: number;
	apartmentId: number;
	periodStart: string;
	periodEnd: string;
	status: 'draft' | 'sent' | 'paid' | 'overdue';
	totalAmount: number;
	paidAmount: number;
	dueDate?: string;
}

/**
 * User store - holds current authenticated user
 */
export const user = writable<User | null>(null);

/**
 * Derived store for authentication status
 */
export const isAuthenticated: Readable<boolean> = derived(user, ($user) => $user !== null);

/**
 * Loading state for authentication check
 */
export const authLoading = writable<boolean>(true);

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
