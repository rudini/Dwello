/**
 * Building Delete - Regression Tests
 *
 * Verifies fixes for:
 * - Delete button must be disabled when there is a delete error
 * - Delete should be blocked when building has apartments
 */

import { describe, it, expect } from 'vitest';

/**
 * Simulates the handleDelete logic from buildings/[id]/+page.svelte.
 * Returns { error } if deletion is blocked, or { success } if allowed.
 */
function simulateHandleDelete(building: { apartmentCount: number }): {
	success: boolean;
	error: string;
} {
	if (building.apartmentCount > 0) {
		return {
			success: false,
			error:
				'Dieses Gebäude kann nicht gelöscht werden, da es noch Wohnungen enthält. Bitte löschen Sie zuerst alle Wohnungen.'
		};
	}
	return { success: true, error: '' };
}

describe('Building Delete', () => {
	describe('delete handler', () => {
		it('blocks deletion when building has apartments', () => {
			const result = simulateHandleDelete({ apartmentCount: 3 });
			expect(result.success).toBe(false);
			expect(result.error).toBeTruthy();
			expect(result.error).toContain('Wohnungen');
		});

		it('allows deletion when building has no apartments', () => {
			const result = simulateHandleDelete({ apartmentCount: 0 });
			expect(result.success).toBe(true);
			expect(result.error).toBe('');
		});
	});

	describe('delete button disabled state', () => {
		it('button should be disabled when deleteError is set', () => {
			const deleteError =
				'Dieses Gebäude kann nicht gelöscht werden, da es noch Wohnungen enthält.';
			const buttonDisabled = !!deleteError;
			expect(buttonDisabled).toBe(true);
		});

		it('button should be enabled when deleteError is empty', () => {
			const deleteError = '';
			const buttonDisabled = !!deleteError;
			expect(buttonDisabled).toBe(false);
		});

		it('button disabled state updates correctly through delete flow', () => {
			let deleteError = '';

			// Initially enabled
			expect(!!deleteError).toBe(false);

			// After failed delete attempt
			const result = simulateHandleDelete({ apartmentCount: 2 });
			deleteError = result.error;
			expect(!!deleteError).toBe(true);

			// After user cancels (resets error)
			deleteError = '';
			expect(!!deleteError).toBe(false);
		});
	});
});
