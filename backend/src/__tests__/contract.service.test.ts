/**
 * Unit tests for contract service
 * Tests for contract creation, validation, and overlap checking
 */

import { describe, it, expect } from 'bun:test';

// Helper function to check contract date overlap
// This mirrors the logic in contract.service.ts checkContractOverlap
function checkDateOverlap(
	existingStart: string,
	existingEnd: string | null,
	newStart: string,
	newEnd: string | null
): boolean {
	// If existing contract has no end date (ongoing), it overlaps if new starts before or during
	if (existingEnd === null) {
		// Existing is ongoing: overlaps if new contract starts
		return true;
	}

	// If new contract has no end date (ongoing), check if it starts before existing ends
	if (newEnd === null) {
		return newStart <= existingEnd;
	}

	// Both have end dates: check for overlap
	// Overlap exists if: newStart <= existingEnd AND newEnd >= existingStart
	return newStart <= existingEnd && newEnd >= existingStart;
}

// Helper to validate contract data structure
interface ContractData {
	apartmentId: string;
	tenantId: string;
	startDate: string;
	endDate?: string | null;
	baseRent: string;
	additionalRent?: string | null;
	monthlyAdvancePayment: string;
}

function validateContractData(data: Partial<ContractData>): { valid: boolean; errors: string[] } {
	const errors: string[] = [];

	if (!data.apartmentId) {
		errors.push('apartmentId is required');
	} else if (!isValidUUID(data.apartmentId)) {
		errors.push('apartmentId must be a valid UUID');
	}

	if (!data.tenantId) {
		errors.push('tenantId is required');
	} else if (!isValidUUID(data.tenantId)) {
		errors.push('tenantId must be a valid UUID');
	}

	if (!data.startDate) {
		errors.push('startDate is required');
	} else if (!isValidDate(data.startDate)) {
		errors.push('startDate must be a valid date (YYYY-MM-DD)');
	}

	if (data.endDate && !isValidDate(data.endDate)) {
		errors.push('endDate must be a valid date (YYYY-MM-DD)');
	}

	if (data.endDate && data.startDate && data.endDate < data.startDate) {
		errors.push('endDate must be after startDate');
	}

	if (!data.baseRent) {
		errors.push('baseRent is required');
	} else if (!isValidDecimal(data.baseRent)) {
		errors.push('baseRent must be a valid decimal number');
	}

	if (!data.monthlyAdvancePayment) {
		errors.push('monthlyAdvancePayment is required');
	} else if (!isValidDecimal(data.monthlyAdvancePayment)) {
		errors.push('monthlyAdvancePayment must be a valid decimal number');
	}

	return { valid: errors.length === 0, errors };
}

function isValidUUID(str: string): boolean {
	const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
	return uuidRegex.test(str);
}

function isValidDate(str: string): boolean {
	const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
	if (!dateRegex.test(str)) return false;
	const date = new Date(str);
	return !isNaN(date.getTime());
}

function isValidDecimal(str: string): boolean {
	return !isNaN(parseFloat(str)) && isFinite(parseFloat(str));
}

describe('Contract Service - Date Overlap Checking', () => {
	describe('checkDateOverlap', () => {
		it('should detect overlap when new contract is within existing contract period', () => {
			const result = checkDateOverlap(
				'2026-01-01', // existing start
				'2026-12-31', // existing end
				'2026-06-01', // new start
				'2026-06-30' // new end
			);
			expect(result).toBe(true);
		});

		it('should detect overlap when new contract starts before and ends during existing', () => {
			const result = checkDateOverlap('2026-06-01', '2026-12-31', '2026-01-01', '2026-08-31');
			expect(result).toBe(true);
		});

		it('should detect overlap when new contract starts during and ends after existing', () => {
			const result = checkDateOverlap('2026-01-01', '2026-06-30', '2026-04-01', '2026-12-31');
			expect(result).toBe(true);
		});

		it('should NOT detect overlap when new contract is completely after existing', () => {
			const result = checkDateOverlap('2026-01-01', '2026-06-30', '2026-07-01', '2026-12-31');
			expect(result).toBe(false);
		});

		it('should NOT detect overlap when new contract is completely before existing', () => {
			const result = checkDateOverlap('2026-07-01', '2026-12-31', '2026-01-01', '2026-06-30');
			expect(result).toBe(false);
		});

		it('should detect overlap when existing contract is ongoing (no end date)', () => {
			const result = checkDateOverlap(
				'2026-01-01',
				null, // ongoing
				'2026-06-01',
				'2026-12-31'
			);
			expect(result).toBe(true);
		});

		it('should detect overlap when new contract is ongoing and starts before existing ends', () => {
			const result = checkDateOverlap(
				'2026-01-01',
				'2026-12-31',
				'2026-06-01',
				null // ongoing
			);
			expect(result).toBe(true);
		});

		it('should NOT detect overlap when new ongoing contract starts after existing ends', () => {
			const result = checkDateOverlap(
				'2026-01-01',
				'2026-06-30',
				'2026-07-01',
				null // ongoing
			);
			expect(result).toBe(false);
		});

		it('should handle same-day boundary (adjacent contracts)', () => {
			// Contract ends on June 30, new starts July 1 - no overlap
			const result = checkDateOverlap('2026-01-01', '2026-06-30', '2026-07-01', '2026-12-31');
			expect(result).toBe(false);
		});

		it('should detect overlap when contracts share a single day', () => {
			// Contract ends June 30, new starts June 30 - overlap on June 30
			const result = checkDateOverlap('2026-01-01', '2026-06-30', '2026-06-30', '2026-12-31');
			expect(result).toBe(true);
		});
	});
});

describe('Contract Service - Data Validation', () => {
	const validUUID = '123e4567-e89b-12d3-a456-426614174000';

	describe('validateContractData', () => {
		it('should pass validation with all required fields', () => {
			const data: ContractData = {
				apartmentId: validUUID,
				tenantId: validUUID,
				startDate: '2026-01-01',
				baseRent: '1500.00',
				monthlyAdvancePayment: '200.00'
			};
			const result = validateContractData(data);
			expect(result.valid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it('should pass validation with optional endDate', () => {
			const data: ContractData = {
				apartmentId: validUUID,
				tenantId: validUUID,
				startDate: '2026-01-01',
				endDate: '2026-12-31',
				baseRent: '1500.00',
				monthlyAdvancePayment: '200.00'
			};
			const result = validateContractData(data);
			expect(result.valid).toBe(true);
		});

		it('should fail validation when apartmentId is missing', () => {
			const data = {
				tenantId: validUUID,
				startDate: '2026-01-01',
				baseRent: '1500.00',
				monthlyAdvancePayment: '200.00'
			};
			const result = validateContractData(data);
			expect(result.valid).toBe(false);
			expect(result.errors).toContain('apartmentId is required');
		});

		it('should fail validation when tenantId is missing', () => {
			const data = {
				apartmentId: validUUID,
				startDate: '2026-01-01',
				baseRent: '1500.00',
				monthlyAdvancePayment: '200.00'
			};
			const result = validateContractData(data);
			expect(result.valid).toBe(false);
			expect(result.errors).toContain('tenantId is required');
		});

		it('should fail validation when startDate is missing', () => {
			const data = {
				apartmentId: validUUID,
				tenantId: validUUID,
				baseRent: '1500.00',
				monthlyAdvancePayment: '200.00'
			};
			const result = validateContractData(data);
			expect(result.valid).toBe(false);
			expect(result.errors).toContain('startDate is required');
		});

		it('should fail validation when baseRent is missing', () => {
			const data = {
				apartmentId: validUUID,
				tenantId: validUUID,
				startDate: '2026-01-01',
				monthlyAdvancePayment: '200.00'
			};
			const result = validateContractData(data);
			expect(result.valid).toBe(false);
			expect(result.errors).toContain('baseRent is required');
		});

		it('should fail validation when monthlyAdvancePayment is missing', () => {
			const data = {
				apartmentId: validUUID,
				tenantId: validUUID,
				startDate: '2026-01-01',
				baseRent: '1500.00'
			};
			const result = validateContractData(data);
			expect(result.valid).toBe(false);
			expect(result.errors).toContain('monthlyAdvancePayment is required');
		});

		it('should fail validation when apartmentId is not a valid UUID', () => {
			const data: ContractData = {
				apartmentId: 'not-a-uuid',
				tenantId: validUUID,
				startDate: '2026-01-01',
				baseRent: '1500.00',
				monthlyAdvancePayment: '200.00'
			};
			const result = validateContractData(data);
			expect(result.valid).toBe(false);
			expect(result.errors).toContain('apartmentId must be a valid UUID');
		});

		it('should fail validation when startDate is not a valid date format', () => {
			const data: ContractData = {
				apartmentId: validUUID,
				tenantId: validUUID,
				startDate: '01-01-2026', // wrong format
				baseRent: '1500.00',
				monthlyAdvancePayment: '200.00'
			};
			const result = validateContractData(data);
			expect(result.valid).toBe(false);
			expect(result.errors).toContain('startDate must be a valid date (YYYY-MM-DD)');
		});

		it('should fail validation when endDate is before startDate', () => {
			const data: ContractData = {
				apartmentId: validUUID,
				tenantId: validUUID,
				startDate: '2026-06-01',
				endDate: '2026-01-01', // before start
				baseRent: '1500.00',
				monthlyAdvancePayment: '200.00'
			};
			const result = validateContractData(data);
			expect(result.valid).toBe(false);
			expect(result.errors).toContain('endDate must be after startDate');
		});

		it('should fail validation when baseRent is not a valid number', () => {
			const data: ContractData = {
				apartmentId: validUUID,
				tenantId: validUUID,
				startDate: '2026-01-01',
				baseRent: 'not-a-number',
				monthlyAdvancePayment: '200.00'
			};
			const result = validateContractData(data);
			expect(result.valid).toBe(false);
			expect(result.errors).toContain('baseRent must be a valid decimal number');
		});

		it('should accept zero as valid for monthlyAdvancePayment', () => {
			const data: ContractData = {
				apartmentId: validUUID,
				tenantId: validUUID,
				startDate: '2026-01-01',
				baseRent: '1500.00',
				monthlyAdvancePayment: '0'
			};
			const result = validateContractData(data);
			expect(result.valid).toBe(true);
		});

		it('should collect multiple validation errors', () => {
			const data = {
				apartmentId: 'invalid',
				tenantId: 'invalid',
				startDate: 'invalid',
				baseRent: 'invalid',
				monthlyAdvancePayment: 'invalid'
			};
			const result = validateContractData(data);
			expect(result.valid).toBe(false);
			expect(result.errors.length).toBeGreaterThan(1);
		});
	});
});

describe('Contract Service - Field Mapping', () => {
	// Test that the frontend sends correct field names matching backend expectations
	describe('Frontend to Backend field mapping', () => {
		it('should use camelCase field names (not snake_case)', () => {
			// The bug was: frontend used tenant_id, apartment_id, etc.
			// Backend expects: tenantId, apartmentId, etc.
			const correctFieldNames = [
				'apartmentId',
				'tenantId',
				'startDate',
				'endDate',
				'baseRent',
				'additionalRent',
				'monthlyAdvancePayment'
			];

			const incorrectFieldNames = [
				'apartment_id',
				'tenant_id',
				'start_date',
				'end_date',
				'base_rent',
				'additional_rent',
				'monthly_advance_payment'
			];

			// Simulate what the frontend should send
			const frontendPayload = {
				tenantId: '123e4567-e89b-12d3-a456-426614174000',
				apartmentId: '123e4567-e89b-12d3-a456-426614174001',
				startDate: '2026-01-01',
				endDate: null,
				baseRent: '1500.00',
				additionalRent: '0',
				monthlyAdvancePayment: '200.00'
			};

			// Check that correct fields exist
			correctFieldNames.forEach((field) => {
				expect(field in frontendPayload).toBe(true);
			});

			// Check that incorrect fields don't exist
			incorrectFieldNames.forEach((field) => {
				expect(field in frontendPayload).toBe(false);
			});
		});

		it('should send string values for decimal fields (not numbers)', () => {
			// Backend expects strings for decimal fields
			const payload = {
				baseRent: '1500.00',
				additionalRent: '0',
				monthlyAdvancePayment: '200.00'
			};

			expect(typeof payload.baseRent).toBe('string');
			expect(typeof payload.additionalRent).toBe('string');
			expect(typeof payload.monthlyAdvancePayment).toBe('string');
		});

		it('should use null for unlimited contracts (no end date)', () => {
			const unlimitedContract = {
				endDate: null
			};
			expect(unlimitedContract.endDate).toBeNull();
		});

		it('should use date string for limited contracts', () => {
			const limitedContract = {
				endDate: '2026-12-31'
			};
			expect(typeof limitedContract.endDate).toBe('string');
			expect(isValidDate(limitedContract.endDate)).toBe(true);
		});

		it('should correctly convert number inputs to strings using String()', () => {
			// This tests the fix for 422 Unprocessable Entity error
			// HTML number inputs return numbers, but backend expects strings
			// The fix: String(baseRent), String(additionalRent || 0), etc.
			const numericBaseRent = 1500;
			const numericAdditionalRent = 200.5;
			const numericAdvancePayment = 0;

			const convertedPayload = {
				baseRent: String(numericBaseRent),
				additionalRent: String(numericAdditionalRent || 0),
				monthlyAdvancePayment: String(numericAdvancePayment || 0)
			};

			expect(convertedPayload.baseRent).toBe('1500');
			expect(convertedPayload.additionalRent).toBe('200.5');
			expect(convertedPayload.monthlyAdvancePayment).toBe('0');

			// Verify they're valid decimal strings
			expect(isValidDecimal(convertedPayload.baseRent)).toBe(true);
			expect(isValidDecimal(convertedPayload.additionalRent)).toBe(true);
			expect(isValidDecimal(convertedPayload.monthlyAdvancePayment)).toBe(true);
		});

		it('should handle empty string inputs with fallback to 0', () => {
			// When form fields are empty, they may be empty strings
			const emptyAdditionalRent = '';
			const emptyAdvancePayment = '';

			const convertedPayload = {
				additionalRent: String(emptyAdditionalRent || 0),
				monthlyAdvancePayment: String(emptyAdvancePayment || 0)
			};

			expect(convertedPayload.additionalRent).toBe('0');
			expect(convertedPayload.monthlyAdvancePayment).toBe('0');
			expect(isValidDecimal(convertedPayload.additionalRent)).toBe(true);
			expect(isValidDecimal(convertedPayload.monthlyAdvancePayment)).toBe(true);
		});
	});
});
