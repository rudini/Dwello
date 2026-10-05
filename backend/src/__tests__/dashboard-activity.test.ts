import { describe, expect, it } from 'bun:test';
import { statementActivities } from '../routes/dashboard';

const statement = {
	id: 's1',
	statementNumber: 'NK-2025-001',
	status: 'sent',
	createdAt: new Date('2026-03-01T09:00:00Z'),
	updatedAt: new Date('2026-03-02T10:00:00Z')
};

describe('Letzte Aktivitäten', () => {
	it('meldet eine neue Abrechnung mit ihrem Erstellungszeitpunkt', () => {
		expect(statementActivities(statement)).toEqual([
			{
				id: 's1-created',
				type: 'statement_created',
				title: 'Abrechnung erstellt',
				description: 'Abrechnung NK-2025-001',
				timestamp: '2026-03-01T09:00:00.000Z'
			}
		]);
	});

	// Paid statements stay unchanged, so their last update is the moment the payment was recorded
	it('meldet die Zahlung, wenn sie erfasst wurde, zusätzlich zur Erstellung', () => {
		const activities = statementActivities({
			...statement,
			status: 'paid',
			updatedAt: new Date('2026-04-15T14:30:00Z')
		});

		expect(activities.map((a) => [a.title, a.timestamp])).toEqual([
			['Abrechnung erstellt', '2026-03-01T09:00:00.000Z'],
			['Zahlung eingegangen', '2026-04-15T14:30:00.000Z']
		]);
	});
});
