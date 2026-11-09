import { afterEach, describe, expect, it, vi } from 'vitest';
import { annualReportCsv, annualReportPdf, loadAnnualReport } from '$lib/server/annual-report';
import report from '../../tests/contracts/report-annual.json';
import buildings from '../../tests/contracts/buildings.json';
import categoryList from '../../tests/contracts/categories.json';

// the report's categories by their names, in the shape of the category list
const names = ['Heizung', 'Hauswart', 'Reparaturen', 'Wertvermehrende Investitionen'];
const categories = {
	...categoryList,
	categories: names.map((name, i) => ({
		...categoryList.categories[0],
		id: `c0000000-0000-4000-8000-00000000000${i + 1}`,
		name,
		nameDE: name
	}))
};
type Body = typeof report;

// #1409: which Jahresbericht «Auswertungen» shows first, and the years to choose from
function backend(
	firstYear: number,
	body: Body = report,
	list: unknown = buildings,
	cats: unknown = categories
) {
	const asked: string[] = [];
	const posted: unknown[] = [];
	const fetch = (async (url: string, init?: RequestInit) => {
		const { pathname, searchParams } = new URL(url);
		if (pathname.endsWith('/buildings')) return Response.json(list);
		if (pathname.endsWith('/categories')) return Response.json(cats);
		if (pathname.endsWith('/reports/pdf')) {
			posted.push(JSON.parse(String(init?.body)));
			return new Response('%PDF-');
		}
		asked.push(searchParams.get('year')!);
		return Response.json({ ...body, year: Number(searchParams.get('year')), firstYear });
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

	// persona Marco 1409-2 P-5: the buildings by name, the first of them preselected
	it('nennt die Gebäude nach Namen und wählt ohne Wahl das erste', async () => {
		const [one] = buildings.buildings;
		const list = {
			...buildings,
			buildings: [
				{ ...one, id: 'b2', name: 'Talhof' },
				{ ...one, id: 'b3', name: 'Alpenhof' }
			]
		};
		const loaded = await loadAnnualReport(backend(2024, report, list).fetch, page());
		expect([loaded.buildings.map(({ label }) => label), loaded.buildingId]).toEqual([
			['Alpenhof', 'Talhof'],
			'b3'
		]);
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
			`filename*=UTF-8''${encodeURIComponent('Jahresbericht-Seeblick-2025.csv')}`
		);
		const lines = new TextDecoder('utf-8', { ignoreBOM: true })
			.decode(await response.arrayBuffer())
			.split('\r\n');
		const income = 'Mietertrag laut Mietverträgen';
		const costs = 'Kosten, die Sie selbst tragen';
		expect(lines.filter(Boolean)).toEqual([
			'\ufeffBereich;Position;Betrag CHF',
			`${income};Nettomiete;29800.00`,
			`${income};Zusatzmiete;0.00`,
			`${income};Nebenkostenpauschale;475.81`,
			`${income};Total Mietertrag;30275.81`,
			expect.stringMatching(
				new RegExp(
					`^${costs};Ihr Anteil an den Nebenkosten der Abrechnungsperiode 01\\.01\\.2025 – 31\\.12\\.2025, .*;$`
				)
			),
			`${costs};Heizung;920.00`,
			`${costs};Hauswart;121.64`,
			`${costs};Total Nebenkosten, die Sie tragen;1041.64`,
			`${costs};Reparaturen;800.00`,
			`${costs};Total Unterhalt und Verwaltung;800.00`,
			`${costs};Total Kosten ohne wertvermehrende Investitionen;1841.64`,
			`${costs};Wertvermehrende Investitionen;15000.00`,
			`${costs};Total wertvermehrende Investitionen;15000.00`
		]);
	});

	// fallback review of #1421: a name a spreadsheet would run as a formula gets a leading «'», an amount stays a number
	it('setzt in der CSV vor einen Namen wie eine Formel einen Apostroph', async () => {
		const named = {
			...categories,
			categories: [{ ...categories.categories[0], name: '=HYPERLINK(1)', nameDE: '=HYPERLINK(1)' }]
		};
		const response = await annualReportCsv(backend(2024, report, buildings, named).fetch, chosen);
		const text = new TextDecoder().decode(await response.arrayBuffer());
		expect(text).toContain("Kosten, die Sie selbst tragen;'=HYPERLINK(1);920.00");
	});

	it('lässt das PDF mit Titel, Gebäude, Zeitraum und den Beträgen der Seite machen', async () => {
		const { fetch, posted } = backend(2024);
		const response = await annualReportPdf(fetch, chosen);
		expect(response.headers.get('content-disposition')).toContain(
			encodeURIComponent('Jahresbericht-Seeblick-2025.pdf')
		);
		expect(posted).toMatchObject([
			{
				title: 'Jahresbericht Seeblick 2025',
				lines: ['Seeblick, Seestrasse 12, 8002 Zürich', 'Zeitraum: 01.01.2025 bis 31.12.2025'],
				sections: [
					{
						heading: 'Mietertrag laut Mietverträgen',
						rows: expect.arrayContaining([
							{ label: 'Total Mietertrag', amount: 'CHF 30’275.81', total: true }
						])
					},
					{
						heading: 'Kosten, die Sie selbst tragen',
						// the note on the Abrechnungsperiode under the help text (Fachreview 1409-2 V-17)
						help: expect.stringMatching(
							/Steuererklärung\.\n\nIhr Anteil an den Nebenkosten der Abrechnungsperiode 01\.01\.2025 – 31\.12\.2025/
						),
						rows: expect.arrayContaining([
							{
								label: 'Total Kosten ohne wertvermehrende Investitionen',
								amount: 'CHF 1’841.64',
								total: true
							}
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

// #1409 (Fachreview 1409-2 V-14): what the report says about the landlord's share of the Nebenkosten
describe('Hinweise zum Anteil an den Nebenkosten', () => {
	const notesOf = async (utility: Partial<Body['costs']['utility']>) => {
		const body = {
			...report,
			costs: { ...report.costs, utility: { ...report.costs.utility, ...utility } }
		};
		const loaded = await loadAnnualReport(
			backend(2024, body).fetch,
			page('?building=b1&year=2025')
		);
		const costs = loaded.report!.sections[1];
		return { notes: costs.notes, labels: costs.rows.map(({ label }) => label) };
	};

	it('sagt ohne Abrechnungen der Periode, dass der Anteil fehlt, und zeigt keine Nebenkosten', async () => {
		const { notes, labels } = await notesOf({ billed: false, categories: [], total: 0 });
		expect(notes).toEqual([
			expect.stringContaining(
				'Für die Abrechnungsperiode 01.01.2025 – 31.12.2025 gibt es noch keine Abrechnungen.'
			)
		]);
		expect(labels).not.toContain('Total Nebenkosten, die Sie tragen');
		// persona Dr. Weber 1409 P-2: without the share no total of the landlord's costs, which would read as complete
		expect(labels).not.toContain('Total Kosten ohne wertvermehrende Investitionen');
		expect(labels).toContain('Total Unterhalt und Verwaltung');
	});

	it('nennt die Hinweise der Kostenabstimmung und Tage ausserhalb von Dwello', async () => {
		const { notes } = await notesOf({ notes: true, outside: true });
		expect(notes).toEqual([
			expect.stringContaining(
				'Ihr Anteil an den Nebenkosten der Abrechnungsperiode 01.01.2025 – 31.12.2025'
			),
			expect.stringContaining(
				'Die Kostenabstimmung der Abrechnungsperiode 01.01.2025 – 31.12.2025 hat Hinweise'
			),
			expect.stringContaining('ausserhalb von Dwello abgerechnet')
		]);
	});

	it('zeigt die wertvermehrenden Investitionen nur, wenn es welche gibt', async () => {
		const body = { ...report, costs: { ...report.costs, capital: { categories: [], total: 0 } } };
		const loaded = await loadAnnualReport(
			backend(2024, body).fetch,
			page('?building=b1&year=2025')
		);
		expect(loaded.report!.sections[1].rows.map(({ label }) => label).at(-1)).toBe(
			'Total Kosten ohne wertvermehrende Investitionen'
		);
	});

	// code review 1409-2 C-11: an invoice without a Kategorie still names its row
	it('nennt eine Rechnung ohne Kategorie «Ohne Kategorie»', async () => {
		const maintenance = { categories: [{ categoryId: null, amount: 50 }], total: 50 };
		const body = { ...report, costs: { ...report.costs, maintenance } } as unknown as Body;
		const loaded = await loadAnnualReport(
			backend(2024, body).fetch,
			page('?building=b1&year=2025')
		);
		expect(loaded.report!.sections[1].rows).toContainEqual({ label: 'Ohne Kategorie', amount: 50 });
	});
});
