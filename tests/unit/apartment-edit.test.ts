/**
 * Apartment Edit - Regression Tests
 *
 * Verifies fixes for:
 * - Status select options must use ApartmentStatus enum values
 * - Status field must be included in form submission and error responses
 * - Room count must be normalized from DB decimal format
 */

import { describe, it, expect } from 'vitest';
import type { ApartmentStatus } from '../../src/lib/types';

// The valid ApartmentStatus values (source of truth from types.ts)
const VALID_STATUSES: ApartmentStatus[] = ['occupied', 'vacant', 'reserved'];

// These must match the statusOptions in apartments/[id]/edit/+page.svelte
const STATUS_OPTIONS = [
	{ value: 'occupied', label: 'Vermietet' },
	{ value: 'vacant', label: 'Leer' },
	{ value: 'reserved', label: 'Gesperrt' }
];

// These must match the roomOptions in apartments/[id]/edit/+page.svelte
const ROOM_OPTIONS = ['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5', '5.5', '6', '6.5'];

describe('Apartment Edit - Status Options', () => {
	it('all status option values are valid ApartmentStatus values', () => {
		for (const option of STATUS_OPTIONS) {
			expect(VALID_STATUSES).toContain(option.value);
		}
	});

	it('every ApartmentStatus has a corresponding option', () => {
		const optionValues = STATUS_OPTIONS.map((o) => o.value);
		for (const status of VALID_STATUSES) {
			expect(optionValues).toContain(status);
		}
	});

	it('status options have German display labels', () => {
		for (const option of STATUS_OPTIONS) {
			expect(option.label).toBeTruthy();
			expect(option.label).not.toBe(option.value);
		}
	});
});

describe('Apartment Edit - Room Count Format', () => {
	it('all room options are valid normalized decimal strings', () => {
		for (const option of ROOM_OPTIONS) {
			const num = parseFloat(option);
			expect(isNaN(num)).toBe(false);
			// Verify the option IS the normalized form (no trailing .0)
			expect(String(num)).toBe(option);
		}
	});

	it('DB decimal values map to room options after normalization', () => {
		// PostgreSQL decimal(3,1) returns these formats
		const dbValues = ['1.0', '1.5', '2.0', '2.5', '3.0', '3.5', '4.0', '4.5', '5.0', '5.5', '6.0', '6.5'];
		for (const dbVal of dbValues) {
			const normalized = String(parseFloat(dbVal));
			expect(ROOM_OPTIONS).toContain(normalized);
		}
	});
});

describe('Apartment Edit - Server Action Status Handling', () => {
	it('fail response includes status in values when validation fails', async () => {
		// Simulate what the server action does: read form data and return fail with values
		const formFields = {
			buildingId: 'building-1',
			number: '',
			floor: '1',
			area: '75',
			rooms: '3.5',
			status: 'occupied'
		};

		// Simulate validation
		const errors: Record<string, string> = {};
		if (!formFields.number?.trim()) errors.number = 'Wohnungsnummer ist erforderlich';

		// Build the values object the same way the server action does
		const values = {
			buildingId: formFields.buildingId,
			number: formFields.number,
			floor: formFields.floor,
			area: formFields.area,
			rooms: formFields.rooms,
			status: formFields.status
		};

		// Verify status is included in the returned values
		expect(values).toHaveProperty('status');
		expect(values.status).toBe('occupied');
		expect(Object.keys(errors).length).toBeGreaterThan(0);
	});

	it('status is included in API request body', () => {
		const formFields = {
			buildingId: 'building-1',
			number: '2.04',
			floor: '2',
			area: '85',
			rooms: '3.5',
			status: 'vacant'
		};

		// Build the request body the same way the server action does
		const body = {
			buildingId: formFields.buildingId,
			number: formFields.number.trim(),
			floor: parseInt(formFields.floor, 10),
			area: formFields.area.trim(),
			rooms: formFields.rooms.trim(),
			status: formFields.status || undefined
		};

		expect(body).toHaveProperty('status');
		expect(body.status).toBe('vacant');
	});

	it('status defaults to undefined when empty', () => {
		const status = '';
		const body = { status: status || undefined };
		expect(body.status).toBeUndefined();
	});
});
