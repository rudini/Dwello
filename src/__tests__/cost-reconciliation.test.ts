import { describe, expect, it } from 'vitest';
import {
	reportPeriods,
	reportReconciliation,
	runReconciliations
} from '$lib/server/cost-reconciliation';
import periods from '../../tests/contracts/report-periods.json';
import report from '../../tests/contracts/report-reconciliation.json';
import run from '../../tests/contracts/statement-run-reconciliation.json';

const period = { buildingId: 'b1', periodStart: '2024-01-01', periodEnd: '2024-12-31' };

// #1126: the BFF names the positions of a Kostenabstimmung in the UI language and the periods of «Berichte»
const category = {
	id: report.positions[0].categoryId,
	nameDE: 'Hauswart',
	nameFR: 'Concierge',
	nameIT: '',
	nameEN: ''
};
const key = {
	id: report.positions[0].distributionKeyId,
	nameDE: 'Pro Fläche (m²)',
	nameFR: '',
	nameIT: '',
	nameEN: ''
};

function backend(answers: Record<string, unknown>) {
	const asked: string[] = [];
	const fetch = (async (url: string) => {
		asked.push(url);
		const path = new URL(url).pathname.replace('/api/v1/', '');
		const body =
			path === 'categories'
				? { categories: [category] }
				: path === 'distribution-keys'
					? { data: [key] }
					: answers[path];
		return new Response(JSON.stringify(body), { status: body ? 200 : 500 });
	}) as typeof globalThis.fetch;
	return { fetch, asked };
}

describe('Kostenabstimmung im BFF', () => {
	it('benennt die Positionen mit der Kategorie in der Sprache der Oberfläche', async () => {
		const { fetch } = backend({ 'reports/reconciliation': report });
		const result = await reportReconciliation(fetch, period);
		expect(result.positions).toEqual([
			{ label: 'Hauswart', buildingCosts: 1200, tenants: 1101.64, landlord: 98.36 }
		]);
		expect(result).toMatchObject({
			withoutStatement: 1,
			drafts: report.drafts,
			notUpToDate: report.notUpToDate
		});
	});

	// #1138 (PO 06.11.2026): the sentences under the table name the position with its Tankbestand and the vacant apartments
	it('nennt den Tankbestand einer Position mit ihrem Namen und die Wohnungen mit Leerstand', async () => {
		const { fetch } = backend({ 'reports/reconciliation': report });
		expect(await reportReconciliation(fetch, period)).toMatchObject({
			fuelStocks: [{ position: 'Hauswart', opening: 1792, closing: 1494 }],
			vacancies: [{ apartmentNumber: 'OG2', days: 30 }]
		});
	});

	it('nennt keinen Tankbestand bei einer Position ohne', async () => {
		const without = { ...report, positions: [{ ...report.positions[0], fuelStock: null }] };
		const { fetch } = backend({ 'reports/reconciliation': without });
		expect((await reportReconciliation(fetch, period)).fuelStocks).toEqual([]);
	});

	it('nennt bei einer Kategorie mit mehreren Verteilschlüsseln den Schlüssel', async () => {
		const several = { ...report, positions: [{ ...report.positions[0], severalKeys: true }] };
		const { fetch } = backend({ 'reports/reconciliation': several });
		const result = await reportReconciliation(fetch, period);
		expect(result.positions[0].label).toBe('Hauswart (Pro Fläche (m²))');
	});

	// code review 1126-2 C-3: a deleted Verteilschlüssel leaves no empty brackets
	it('nennt bei einem gelöschten Verteilschlüssel nur die Kategorie', async () => {
		const several = {
			...report,
			positions: [{ ...report.positions[0], severalKeys: true, distributionKeyId: null }]
		};
		const { fetch } = backend({ 'reports/reconciliation': several });
		const result = await reportReconciliation(fetch, period);
		expect(result.positions[0].label).toBe('Hauswart');
	});

	// code review 1126-1: an invoice without a Kategorie recorded since, or a line whose Kategorie is deleted
	it('nennt eine Position ohne Kategorie «Ohne Kategorie»', async () => {
		const none = { ...report, positions: [{ ...report.positions[0], categoryId: null }] };
		const { fetch } = backend({ 'reports/reconciliation': none });
		const result = await reportReconciliation(fetch, period);
		expect(result.positions[0].label).toBe('Ohne Kategorie');
	});

	it('fragt die Kostenabstimmung der Vorschau je Gebäude mit dem Lauf ab; ohne Hinweise', async () => {
		const { fetch, asked } = backend({ 'statements/run-reconciliation': run });
		const [result] = await runReconciliations(fetch, {
			buildingIds: ['b1'],
			periodStart: '2024-01-01',
			periodEnd: '2024-12-31',
			heatingProfileId: 'h1',
			managementFeePercent: 3
		});
		expect(asked[0]).toContain(
			'statements/run-reconciliation?buildingId=b1&periodStart=2024-01-01&periodEnd=2024-12-31&managementFeePercent=3&heatingProfileId=h1'
		);
		expect(result).toMatchObject({
			buildingId: 'b1',
			reconciliation: {
				managementFee: 33.05,
				withoutStatement: 0,
				drafts: [],
				notUpToDate: [],
				fuelStocks: [{ position: 'Hauswart', opening: 1792, closing: 1494 }],
				vacancies: run.vacancies
			}
		});
	});

	it('nennt jede Periode der Berichte mit Gebäude und Periode und verlinkt ihre Kostenabstimmung', async () => {
		const { fetch } = backend({ 'reports/reconciliations': periods });
		expect((await reportPeriods(fetch))[0]).toMatchObject({
			name: 'Lindenhof, 01.01.2024 – 31.12.2024',
			href: `/reports/${periods.periods[0].buildingId}?periodStart=2024-01-01&periodEnd=2024-12-31`
		});
	});
});
