import { describe, expect, it } from 'vitest';
import { periodOf, periodQuery } from '$lib/accounting-period';

// #912: the backend's query names of a period are spelled in one place
describe('Abrechnungsperiode in einer Anfrage', () => {
	it('nennt Beginn und Ende so, wie die Routen des Backends sie lesen', () => {
		expect(periodQuery({ start: '2025-01-01', end: '2025-12-31' })).toEqual({
			periodStart: '2025-01-01',
			periodEnd: '2025-12-31'
		});
	});

	it('liest die Periode aus einer Anfrage und lässt fehlende Tage leer', () => {
		expect(
			periodOf(new URLSearchParams({ periodStart: '2025-01-01', periodEnd: '2025-12-31' }))
		).toEqual({
			periodStart: '2025-01-01',
			periodEnd: '2025-12-31'
		});
		expect(periodOf(new URLSearchParams())).toEqual({ periodStart: '', periodEnd: '' });
	});
});
