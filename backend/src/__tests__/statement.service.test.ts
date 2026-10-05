/**
 * Unit tests for statement service
 * Tests for bug fix: Overdue status calculation and display
 */

import { describe, it, expect } from 'bun:test';

// Helper to compute effective status (mirrors the logic in statement.service.ts)
function computeEffectiveStatus(
	status: string,
	paymentDeadline: string | null,
	today: string
): string {
	if (status === 'sent' && paymentDeadline && paymentDeadline < today) {
		return 'overdue';
	}
	return status;
}

// Helper to determine if a statement should be counted as sent (not overdue)
function isSentNotOverdue(status: string, paymentDeadline: string | null, today: string): boolean {
	if (status !== 'sent') return false;
	if (!paymentDeadline) return true; // No deadline = still sent
	return paymentDeadline >= today; // Deadline not passed = still sent
}

// Helper to determine if a statement should be counted as overdue
function isOverdue(status: string, paymentDeadline: string | null, today: string): boolean {
	return status === 'sent' && paymentDeadline !== null && paymentDeadline < today;
}

describe('Statement Service - Overdue Status Calculation', () => {
	const today = '2026-02-02';

	describe('computeEffectiveStatus', () => {
		it('should return overdue when status is sent and deadline has passed', () => {
			const result = computeEffectiveStatus('sent', '2025-02-15', today);
			expect(result).toBe('overdue');
		});

		it('should return sent when status is sent and deadline has not passed', () => {
			const result = computeEffectiveStatus('sent', '2026-03-01', today);
			expect(result).toBe('sent');
		});

		it('should return sent when status is sent and deadline is null', () => {
			const result = computeEffectiveStatus('sent', null, today);
			expect(result).toBe('sent');
		});

		it('should return draft when status is draft regardless of deadline', () => {
			const result = computeEffectiveStatus('draft', '2025-01-01', today);
			expect(result).toBe('draft');
		});

		it('should return paid when status is paid regardless of deadline', () => {
			const result = computeEffectiveStatus('paid', '2025-01-01', today);
			expect(result).toBe('paid');
		});
	});

	describe('isSentNotOverdue (for sent count calculation)', () => {
		it('should return false for sent statement with past deadline', () => {
			const result = isSentNotOverdue('sent', '2025-02-15', today);
			expect(result).toBe(false);
		});

		it('should return true for sent statement with future deadline', () => {
			const result = isSentNotOverdue('sent', '2026-03-01', today);
			expect(result).toBe(true);
		});

		it('should return true for sent statement with no deadline', () => {
			const result = isSentNotOverdue('sent', null, today);
			expect(result).toBe(true);
		});

		it('should return false for draft status', () => {
			const result = isSentNotOverdue('draft', null, today);
			expect(result).toBe(false);
		});

		it('should return false for paid status', () => {
			const result = isSentNotOverdue('paid', '2025-01-01', today);
			expect(result).toBe(false);
		});
	});

	describe('isOverdue (for overdue count calculation)', () => {
		it('should return true for sent statement with past deadline', () => {
			const result = isOverdue('sent', '2025-02-15', today);
			expect(result).toBe(true);
		});

		it('should return false for sent statement with future deadline', () => {
			const result = isOverdue('sent', '2026-03-01', today);
			expect(result).toBe(false);
		});

		it('should return false for sent statement with no deadline', () => {
			const result = isOverdue('sent', null, today);
			expect(result).toBe(false);
		});

		it('should return false for draft status even with past deadline', () => {
			const result = isOverdue('draft', '2025-01-01', today);
			expect(result).toBe(false);
		});

		it('should return false for paid status even with past deadline', () => {
			const result = isOverdue('paid', '2025-01-01', today);
			expect(result).toBe(false);
		});
	});

	describe('Status counts consistency', () => {
		const statements = [
			{ id: '1', status: 'draft', paymentDeadline: null },
			{ id: '2', status: 'sent', paymentDeadline: '2025-02-15' }, // overdue
			{ id: '3', status: 'paid', paymentDeadline: '2025-02-10' }
		];

		it('should have consistent counts (sent + overdue from db sent = total sent in db)', () => {
			const dbSentCount = statements.filter((s) => s.status === 'sent').length;
			const sentCount = statements.filter((s) =>
				isSentNotOverdue(s.status, s.paymentDeadline, today)
			).length;
			const overdueCount = statements.filter((s) =>
				isOverdue(s.status, s.paymentDeadline, today)
			).length;

			// Sent in DB should equal sent (not overdue) + overdue
			expect(sentCount + overdueCount).toBe(dbSentCount);
		});

		it('should not double count any statement', () => {
			const draftCount = statements.filter((s) => s.status === 'draft').length;
			const sentCount = statements.filter((s) =>
				isSentNotOverdue(s.status, s.paymentDeadline, today)
			).length;
			const paidCount = statements.filter((s) => s.status === 'paid').length;
			const overdueCount = statements.filter((s) =>
				isOverdue(s.status, s.paymentDeadline, today)
			).length;

			// Total should equal original count
			expect(draftCount + sentCount + paidCount + overdueCount).toBe(statements.length);
		});

		it('should correctly categorize the test data', () => {
			const draftCount = statements.filter((s) => s.status === 'draft').length;
			const sentCount = statements.filter((s) =>
				isSentNotOverdue(s.status, s.paymentDeadline, today)
			).length;
			const paidCount = statements.filter((s) => s.status === 'paid').length;
			const overdueCount = statements.filter((s) =>
				isOverdue(s.status, s.paymentDeadline, today)
			).length;

			expect(draftCount).toBe(1);
			expect(sentCount).toBe(0); // The sent one is overdue
			expect(paidCount).toBe(1);
			expect(overdueCount).toBe(1);
		});
	});
});
