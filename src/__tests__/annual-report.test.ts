import { afterEach, describe, expect, it, vi } from 'vitest';
import { annualReportCsv, annualReportPdf, loadAnnualReport } from '$lib/server/annual-report';
import report from '../../tests/contracts/report-annual.json';
import buildings from '../../tests/contracts/buildings.json';

// #1409: which Jahresbericht «Auswertungen» shows first, and the years to choose from
function backend(firstYear: number) {
	const asked: string[] = [];
	const posted: unknown[] = [];
	const fetch = (async (url: string, init?: RequestInit) => {
		const { pathname, searchParams } = new URL(url);
		if (pathname.endsWith('/buildings')) return Response.json(buildings);
		if (pathname.endsWith('/reports/pdf')) {
			posted.push(JSON.parse(String(init?.body)));
			return new Response('%PDF-');
		}
		asked.push(searchParams.get('year')!);
		return Response.json({ ...report, year: Number(searchParams.get('year')), firstYear });
	}) as typeof globalThis.fetch;
	return { fetch, asked, posted };
}
const page = (query = '') => new URL(`http://dwello.test/analytics${query}`);

afterEach(() => vi.useRealTimers());

describe('Jahresbericht beim Öffnen von «Auswertungen»', () => {
	it('zeigt ohne Wahl das letzte Kalenderjahr, die Jahre ab dem ersten Jahr des Gebäudes bis heute', async () => {
		vi.useFakeTimers({ toFake: ['Date'], now: new Date('2026-11-09T12:00:00Z') });
		const { fetch, asked } = backend(2023);
		const loaded = await loadAnnualReport(fetch, page());
		expect(asked).toEqual(['2025']);
		expect(loaded.years).toEqual(['2026', '2025', '2024', '2023']);
	});

	it('zeigt ohne Wahl das erste Jahr des Gebäudes, wenn seine Daten erst im laufenden Jahr beginnen', async () => {
		vi.useFakeTimers({ toFake: ['Date'], now: new Date('2026-11-09T12:00:00Z') });
		const { fetch, asked } = backend(2026);
		const loaded = await loadAnnualReport(fetch, page());
		expect(asked).toEqual(['2025', '2026']);
		expect(loaded.report?.year).toBe(2026);
	});

	it('zeigt das gewählte Jahr auch vor dem ersten Jahr des Gebäudes', async () => {
		vi.useFakeTimers({ toFake: ['Date'], now: new Date('2026-11-09T12:00:00Z') });
		const { fetch, asked } = backend(2024);
		const loaded = await loadAnnualReport(fetch, page('?building=b1&year=2020'));
		expect(asked).toEqual(['2020']);
		expect(loaded.years?.[0]).toBe('2026');
		expect(loaded.years).toContain('2020');
	});
});

describe('Jahresbericht zum Herunterladen', () => {
	const chosen = page('?building=b1&year=2025');

	it('gibt als CSV jede Zeile mit Bereich, Position und Betrag als Zahl, unter dem Namen des Berichts', async () => {
		const response = await annualReportCsv(backend(2024).fetch, chosen);
		expect(response.headers.get('content-disposition')).toContain(
			`filename*=UTF-8''${encodeURIComponent('Jahresbericht Seeblick 2025.csv')}`
		);
		const lines = new TextDecoder('utf-8', { ignoreBOM: true })
			.decode(await response.arrayBuffer())
			.split('\r\n');
		expect(lines.slice(0, 3)).toEqual([
			'\ufeffBereich;Position;Betrag CHF',
			'Mietertrag laut Mietverträgen;Nettomiete;29800.00',
			'Mietertrag laut Mietverträgen;Zusatzmiete;0.00'
		]);
		expect(lines).toContain('Mietertrag laut Mietverträgen;Total Mietertrag;32675.81');
	});

	it('lässt das PDF mit Titel, Gebäude, Zeitraum und den Beträgen der Seite machen', async () => {
		const { fetch, posted } = backend(2024);
		const response = await annualReportPdf(fetch, chosen);
		expect(response.headers.get('content-disposition')).toContain(
			encodeURIComponent('Jahresbericht Seeblick 2025.pdf')
		);
		expect(posted).toMatchObject([
			{
				title: 'Jahresbericht 2025',
				lines: ['Seeblick, Seestrasse 12, 8002 Zürich', 'Zeitraum: 01.01.2025 bis 31.12.2025'],
				sections: [
					{
						heading: 'Mietertrag laut Mietverträgen',
						rows: expect.arrayContaining([
							{ label: 'Total Mietertrag', amount: 'CHF 32’675.81', total: true }
						])
					}
				]
			}
		]);
	});

	// review 1409-1 C-9: the PDF of the running year says it is not over, as the page does
	it('sagt im PDF des laufenden Jahres, dass es noch nicht vorbei ist', async () => {
		vi.useFakeTimers({ toFake: ['Date'], now: new Date('2026-11-09T12:00:00Z') });
		const { fetch, posted } = backend(2024);
		await annualReportPdf(fetch, page('?building=b1&year=2026'));
		expect(posted).toMatchObject([
			{
				lines: [
					'Seeblick, Seestrasse 12, 8002 Zürich',
					'Zeitraum: 01.01.2026 bis 31.12.2026',
					expect.stringContaining('Das Jahr 2026 ist noch nicht vorbei')
				]
			}
		]);
	});
});
