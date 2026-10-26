/**
 * The overview's deadlines (#64, #87; #815): open Zahlungsfristen within the configured days and passed ones, and
 * contract ends within 60 days, with the days from today, earliest first; the page only words them
 */

import { describe, expect, it } from 'bun:test';
import { deadlinesOf } from '../services/overview-deadlines';

const today = '2026-10-10';
const of = (fields: Partial<Parameters<typeof deadlinesOf>[0]>) =>
	deadlinesOf({ today, dueStatements: [], endingContracts: [], paymentDeadlineDays: 30, ...fields });

describe('Fristen der Übersicht', () => {
	it('nennt Zahlungsfristen und Vertragsenden nach Datum, mit den Tagen ab heute', () => {
		const deadlines = of({
			dueStatements: [
				{ id: 's1', tenantName: 'Anna Keller', paymentDeadline: '2026-10-20' },
				{ id: 's2', tenantName: 'Bruno Meier', paymentDeadline: '2026-10-05' }
			],
			endingContracts: [{ id: 'c1', tenantName: 'Eva Frei', endDate: '2026-10-11' }]
		});
		expect(deadlines).toEqual([
			{ id: 's2', kind: 'Zahlungsfrist', name: 'Bruno Meier', date: '2026-10-05', days: -5 },
			{ id: 'c1', kind: 'Vertragsende', name: 'Eva Frei', date: '2026-10-11', days: 1 },
			{ id: 's1', kind: 'Zahlungsfrist', name: 'Anna Keller', date: '2026-10-20', days: 10 }
		]);
	});

	// the Zahlungsfrist is 30 days here: a statement just sent is in the deadlines at once
	it('lässt ferne Termine weg: Zahlungsfrist nach den eingestellten 30, Vertragsende nach 60 Tagen', () => {
		const deadlines = of({
			dueStatements: [
				{ id: 's1', tenantName: 'Anna Keller', paymentDeadline: '2026-11-10' },
				{ id: 's2', tenantName: 'Hans Müller', paymentDeadline: '2026-11-09' }
			],
			endingContracts: [
				{ id: 'c1', tenantName: 'Eva Frei', endDate: '2026-12-10' },
				{ id: 'c2', tenantName: 'Ueli Graf', endDate: '2026-12-09' },
				{ id: 'c3', tenantName: 'Lea Roth', endDate: '2026-10-01' }
			]
		});
		expect(deadlines.map((d) => d.name)).toEqual(['Hans Müller', 'Ueli Graf']);
	});

	// #87: a statement just sent is in the deadlines with any configured Zahlungsfrist
	it('zeigt jede offene Zahlungsfrist innerhalb der eingestellten Tage', () => {
		const deadlines = of({
			paymentDeadlineDays: 60,
			dueStatements: [
				{ id: 's1', tenantName: 'Anna Keller', paymentDeadline: '2026-12-10' },
				{ id: 's2', tenantName: 'Hans Müller', paymentDeadline: '2026-12-09' }
			]
		});
		expect(deadlines.map((d) => d.name)).toEqual(['Hans Müller']);
	});
});
