import { describe, it, expect } from 'vitest';
import {
	billedContracts,
	contractAgreements as contractAgreement,
	generateStatements,
	invoicesInPeriod,
	previewStatements
} from '../lib/server/statement-generation';
// Backend answers as checked against the real API (backend/src/__tests__/api-contracts.pg.test.ts)
import buildingContracts from '../../tests/contracts/building-contracts.json';
import statementRun from '../../tests/contracts/statement-run.json';
import statementPreview from '../../tests/contracts/statement-preview.json';
import statement from '../../tests/contracts/statement.json';
import invoiceCompleteness from '../../tests/contracts/invoice-completeness.json';
import calculationRefused from '../../tests/contracts/statement-calculation-refused.json';
import statements from '../../tests/contracts/statements.json';
import runDifferences from '../../tests/contracts/statement-run-differences.json';
import runHeating from '../../tests/contracts/statement-run-heating.json';
import contractAgreements from '../../tests/contracts/contract-agreements.json';
import category from '../../tests/contracts/category.json';
import building from '../../tests/contracts/building.json';

const API = 'http://localhost:3001/api/v1';
const period = {
	buildingIds: ['b1'],
	periodStart: '2024-01-01',
	periodEnd: '2024-12-31',
	heatingProfileId: 'hp1',
	managementFeePercent: 4.5
};

const contract = (id: string, startDate: string, endDate: string | null) => ({
	...buildingContracts.contracts[0],
	id,
	startDate,
	endDate,
	tenantName: `Mieter ${id}`,
	apartmentNumber: '2.01'
});

const contracts = [
	contract('vorher', '2020-01-01', '2023-12-31'),
	contract('auszug', '2020-01-01', '2024-03-31'),
	contract('einzug', '2024-05-01', null),
	contract('nachher', '2025-01-01', null)
];

type Planned = { contracts?: object[]; withoutFee?: object[]; overlap?: object | null; skipped?: object[] };

// The backend decides which contracts a run bills (H-28): by default the two of 2024, neither billed yet
function backend(
	statements: {
		contractId: string;
		periodStart: string;
		periodEnd: string;
		status?: string;
	}[] = [],
	inBuilding: object[] = contracts,
	plan: Planned = {}
) {
	const posts: { url: string; body: Record<string, string> }[] = [];
	const running = inBuilding === contracts ? contracts.slice(1, 3) : inBuilding;
	const plannedRun = () =>
		Response.json({
			contracts: (plan.contracts ?? running).map((c) => ({
				...statementRun.contracts[0],
				billed: false,
				movedOut: false,
				fixedTerm: false,
				shortenedTo: null,
				...c
			})),
			withoutFee: plan.withoutFee ?? [],
			overlap: plan.overlap ?? null,
			skipped: plan.skipped ?? []
		});
	// the reads by their address; the run of any period of b1
	const reads: Record<string, () => Response> = {
		[`${API}/statements?buildingId=b1&limit=1000`]: () => Response.json({ data: statements }),
		[`${API}/contracts?buildingId=b1&limit=1000`]: () => Response.json({ contracts: inBuilding }),
		[`${API}/buildings/b1`]: () => Response.json(building)
	};
	const read = (url: string) =>
		url.startsWith(`${API}/statements/run?buildingId=b1&`) ? plannedRun() : reads[url]?.();
	// the posts: a preview with the costs per contract, otherwise the created statement
	const post = (url: string, body: Record<string, string>) =>
		url === `${API}/statements/preview`
			? Response.json({
					...statementPreview,
					totalCosts: body.contractId === 'auszug' ? 300 : 400,
					balance: -50
				})
			: Response.json({ ...statement, id: `s-${body.contractId}` }, { status: 201 });
	const fetch = async (url: string, init?: RequestInit) => {
		const answer = read(url);
		if (answer) return answer;
		const body = JSON.parse(String(init?.body));
		posts.push({ url, body });
		return post(url, body);
	};
	return { posts, fetch: fetch as typeof globalThis.fetch };
}

describe('Schon abgerechnete Mietverträge je Gebäude', () => {
	it('zählt die Mietverträge der Periode und die mit einer Abrechnung darin, wie das Backend sie plant', async () => {
		const { fetch } = backend([], contracts, {
			contracts: [
				contract('auszug', '2020-01-01', '2024-03-31'),
				{ ...contract('einzug', '2024-05-01', null), billed: true }
			]
		});

		expect(await billedContracts(fetch, period)).toEqual([
			{ buildingId: 'b1', contracts: 2, billed: 1, overlap: null, withoutFee: [] }
		]);
	});

	it('erstellt nur für die Mietverträge, die das Backend noch nicht abgerechnet nennt', async () => {
		const { fetch, posts } = backend([], contracts, {
			contracts: [
				contract('auszug', '2020-01-01', '2024-03-31'),
				{ ...contract('einzug', '2024-05-01', null), billed: true }
			]
		});

		expect(await generateStatements(fetch, period)).toEqual(['s-auszug']);
		expect(posts.map((post) => post.body.contractId)).toEqual(['auszug']);
	});
});

// #199, #408 point 2: one Abrechnungsperiode per day and building; the backend finds the overlap (statement-run.test.ts),
// the BFF names it in the refusal
describe('Abrechnungsperiode, die eine bestehende des Gebäudes schneidet', () => {
	const refused = (...periods: [string, string][]) => ({
		...statementRun.overlap,
		periods: periods.map(([start, end]) => ({ start, end }))
	});

	it('gibt die Überschneidung des Backends an Schritt 2 weiter', async () => {
		const { fetch } = backend([], contracts, { overlap: statementRun.overlap });

		expect((await billedContracts(fetch, period))[0].overlap).toEqual(statementRun.overlap);
	});

	it('nennt in der Ablehnung jede überschnittene Periode', async () => {
		const { fetch } = backend([], contracts, {
			overlap: refused(['2023-07-01', '2024-06-30'], ['2024-07-01', '2024-09-30'])
		});

		await expect(previewStatements(fetch, period)).rejects.toThrow(
			'(01.07.2023 – 30.06.2024, 01.07.2024 – 30.09.2024)'
		);
	});

	// persona Dr. Weber P-5: a calendar year by its days, not «2024»
	it('nennt in der Ablehnung ein Kalenderjahr mit seinen Tagen', async () => {
		const { fetch } = backend([], contracts, { overlap: refused(['2024-01-01', '2024-12-31']) });

		await expect(
			previewStatements(fetch, { ...period, periodStart: '2024-07-01', periodEnd: '2025-06-30' })
		).rejects.toThrow('von Seeblick (01.01.2024 – 31.12.2024)');
	});

	// code review 199-2 C-10: every refused building is named
	it('nennt in der Ablehnung jedes abgelehnte Gebäude', async () => {
		const fetch = (async (url: string) => {
			const id = new URL(url).searchParams.get('buildingId') ?? url.split('/').at(-1)!;
			if (url.includes('/statements/run?'))
				return Response.json({ ...statementRun, overlap: refused(['2023-07-01', '2024-06-30']) });
			return Response.json({ ...building, id, name: id === 'b1' ? 'Seeblick' : 'Bergsicht' });
		}) as typeof globalThis.fetch;

		await expect(previewStatements(fetch, { ...period, buildingIds: ['b1', 'b2'] })).rejects.toThrow(
			/von Seeblick \(01\.07\.2023 – 30\.06\.2024\)\..* von Bergsicht \(01\.07\.2023 – 30\.06\.2024\)\./
		);
	});

	it('erstellt und berechnet für ein solches Gebäude nichts', async () => {
		const { fetch, posts } = backend([], contracts, {
			overlap: refused(['2023-07-01', '2024-06-30'])
		});

		// the building by its name, every overlapped period by its days (Fachreview 199-1 V-7, code review C-3)
		await expect(generateStatements(fetch, period)).rejects.toThrow(
			'Die gewählte Abrechnungsperiode überschneidet sich mit bestehenden Abrechnungen von Seeblick (01.07.2023 – 30.06.2024).'
		);
		await expect(previewStatements(fetch, period)).rejects.toThrow('überschneidet sich');
		expect(posts).toEqual([]);
	});
});

// #89: the run's rate applies only where the Verwaltungspauschale is agreed; step «Einstellungen» names the others
describe('Mietverträge ohne vereinbarte Verwaltungspauschale', () => {
	// H-28 (#717): which contracts these are, the backend decides (statement-run.test.ts)
	it('gibt die Mietverträge ohne vereinbarte Pauschale weiter, die das Backend nennt', async () => {
		const { fetch } = backend([], contracts, { withoutFee: statementRun.withoutFee });

		expect((await billedContracts(fetch, period))[0].withoutFee).toEqual(statementRun.withoutFee);
	});
});

describe('Abrechnungen erstellen', () => {
	it('zeigt in der Vorschau jeden Mietvertrag, der in die Periode fällt', async () => {
		// the backend says who moved out (H-28, #717)
		const { fetch } = backend([], contracts, { contracts: [{ ...contracts[1], movedOut: true }, contracts[2]] });

		expect(await previewStatements(fetch, period)).toEqual([
			{
				contractId: 'auszug',
				tenantName: 'Mieter auszug',
				apartmentNumber: '2.01',
				totalCosts: 300,
				totalAdvancePayments: 1800,
				balance: -50,
				rentalDays: 366,
				totalPeriodDays: 366,
				rentalStart: '2024-01-01',
				rentalEnd: '2024-12-31',
				movedOut: true,
				fixedTerm: false,
				oldAddress: false,
				buildingId: 'b1'
			},
			{
				contractId: 'einzug',
				tenantName: 'Mieter einzug',
				apartmentNumber: '2.01',
				totalCosts: 400,
				totalAdvancePayments: 1800,
				balance: -50,
				rentalDays: 366,
				totalPeriodDays: 366,
				rentalStart: '2024-01-01',
				rentalEnd: '2024-12-31',
				movedOut: false,
				fixedTerm: false,
				oldAddress: false,
				buildingId: 'b1'
			}
		]);
	});

	// #453 (#327): the backend names the contracts «Abgerechnet bis» covers (statement-run.test.ts); step 2 shows them
	it('gibt die Mietverträge weiter, die «Abgerechnet bis» in der Periode abdeckt', async () => {
		const { fetch } = backend([], contracts, {
			contracts: [contract('einzug', '2024-05-01', null)],
			skipped: statementRun.skipped
		});

		expect(await billedContracts(fetch, period)).toEqual([
			{
				buildingId: 'b1',
				contracts: 1,
				billed: 0,
				overlap: null,
				withoutFee: [],
				skipped: statementRun.skipped
			}
		]);
	});

	// H-28 (#717): «ausgezogen», «befristet» and «Abgerechnet bis» where it shortens the Mietstage, as the backend decides
	// them (statement-run.test.ts); each row names its billed days
	it('übernimmt je Zeile die Kennzeichen des Backends', async () => {
		// flags the contract's own dates would not give: the BFF passes them on, it does not decide them
		const { fetch } = backend([], contracts, {
			contracts: [
				{ ...contract('a', '2020-01-01', null), movedOut: true, fixedTerm: true, shortenedTo: '2024-02-29' },
				{ ...contract('b', '2020-01-01', '2024-03-31'), billedUntil: '2024-02-29', movedOut: false, fixedTerm: false, shortenedTo: null }
			]
		});

		const rows = await previewStatements(fetch, period);
		expect(rows.map(({ contractId, rentalStart, movedOut, fixedTerm, billedUntil }) => ({ contractId, rentalStart, movedOut, fixedTerm, billedUntil }))).toEqual([
			{ contractId: 'a', rentalStart: statementPreview.rentalStart, movedOut: true, fixedTerm: true, billedUntil: '2024-02-29' },
			{ contractId: 'b', rentalStart: statementPreview.rentalStart, movedOut: false, fixedTerm: false, billedUntil: undefined }
		]);
	});

	// A-5 (#114): der Mietvertrag sagt, ob der ausgezogene Mieter noch die Adresse der Wohnung hat
	it('übernimmt die alte Adresse eines ausgezogenen Mieters aus dem Mietvertrag', async () => {
		const { fetch } = backend([], [{ ...contract('auszug', '2020-01-01', '2024-03-31'), oldAddress: true }]);

		expect((await previewStatements(fetch, period)).map((row) => row.oldAddress)).toEqual([true]);
	});

	it('berechnet die Vorschau mit Periode, Heizprofil und Verwaltungspauschale', async () => {
		const { fetch, posts } = backend();
		await previewStatements(fetch, period);

		expect(posts[0]).toEqual({
			url: `${API}/statements/preview`,
			body: {
				contractId: 'auszug',
				periodStart: '2024-01-01',
				periodEnd: '2024-12-31',
				heatingProfileId: 'hp1',
				managementFeePercent: 4.5
			}
		});
	});

	// the run's statements, e.g. for the ZIP of their PDFs (#356)
	it('erstellt für jeden Mietvertrag der Periode eine Abrechnung und nennt sie', async () => {
		const { fetch, posts } = backend();

		expect(await generateStatements(fetch, period)).toEqual(['s-auszug', 's-einzug']);
		expect(posts.map((post) => post.url)).toEqual([
			`${API}/statements/generate`,
			`${API}/statements/generate`
		]);
		expect(posts[1].body).toEqual({
			contractId: 'einzug',
			buildingId: 'b1',
			periodStart: '2024-01-01',
			periodEnd: '2024-12-31',
			heatingProfileId: 'hp1',
			managementFeePercent: 4.5
		});
	});

	it('meldet in Worten, wenn das Backend die Berechnung ablehnt', async () => {
		const fetch = (async (url: string) =>
			url.includes('/statements/run?')
				? Response.json({
						...statementRun,
						contracts: [{ ...contract('auszug', '2020-01-01', null), billed: false }],
						overlap: null,
						skipped: []
					})
				: Response.json(calculationRefused, { status: 400 })) as typeof globalThis.fetch;

		await expect(previewStatements(fetch, period)).rejects.toThrow(
			'Die Abrechnung konnte nicht berechnet werden. Versuchen Sie es später erneut.'
		);
	});
});

describe('Rechnungen der Abrechnungsperiode', () => {
	// The statement counts the utility invoices of the building dated in the period
	it('zählt pro Gebäude die umlagefähigen Rechnungen und die schon erstellten Abrechnungen der Periode', async () => {
		const urls: string[] = [];
		const fetch = (async (url: string) => {
			urls.push(url);
			if (url.includes('/statements?'))
				return Response.json({
					data: url.includes('b2')
						? [
								{ periodStart: '2024-01-01', periodEnd: '2024-12-31' },
								{ periodStart: '2023-07-01', periodEnd: '2024-06-30' }, // overlaps
								{ periodStart: '2023-01-01', periodEnd: '2023-12-31' } // before the period
							]
						: []
				});
			if (url.includes('/invoices/completeness/'))
				return Response.json({ ...invoiceCompleteness, buildingId: url.includes('b1') ? 'b1' : 'b2' });
			const invoices = url.includes('/for-statement/b1')
				? [{ invoiceDate: '2024-06-30', categoryId: 'c1' }, { invoiceDate: '2024-01-15', categoryId: 'c1' }]
				: [];
			return Response.json(invoices);
		}) as typeof globalThis.fetch;

		expect(await invoicesInPeriod(fetch, { ...period, buildingIds: ['b1', 'b2'] })).toEqual([
			{ buildingId: 'b1', count: 2, first: '2024-01-15', last: '2024-06-30', statements: 0, check: { ...invoiceCompleteness, buildingId: 'b1', heatingWithoutServicePeriod: [] }, changed: [], uncategorized: [] },
			{ buildingId: 'b2', count: 0, first: null, last: null, statements: 2, check: { ...invoiceCompleteness, buildingId: 'b2', heatingWithoutServicePeriod: [] }, changed: [], uncategorized: [] }
		]);
		// each category compared with the same dates one year earlier
		expect(urls).toContain(`${API}/invoices/completeness/b1?periodStart=2024-01-01&periodEnd=2024-12-31`);
		// statements of the building whose period overlaps the chosen one
		expect(urls).toContain(`${API}/statements?buildingId=b2&limit=1000`);
		// the invoices the statement takes: by Leistungszeitraum, otherwise by Rechnungsdatum
		expect(urls[0]).toBe(`${API}/invoices/for-statement/b1?periodStart=2024-01-01&periodEnd=2024-12-31`);
	});

	// Die Rechnung vom Januar 2025 für das 4. Quartal 2024 deckt das Ende der Periode ab, nicht den Januar
	it('nimmt für den Zeitraum der Rechnungen den Leistungszeitraum in der Periode', async () => {
		const fetch = (async (url: string) =>
			Response.json(
				url.includes('/for-statement/')
					? [
							{ invoiceDate: '2024-03-31', servicePeriodEnd: null, inPeriod: { start: '2024-01-01', end: '2024-12-31' } },
							{ invoiceDate: '2025-01-20', servicePeriodEnd: '2024-12-31', inPeriod: { start: '2024-10-01', end: '2024-12-31' } }
						]
					: url.includes('/statements?')
						? { data: [] }
						: invoiceCompleteness
			)) as typeof globalThis.fetch;

		expect(await invoicesInPeriod(fetch, period)).toMatchObject([{ count: 2, first: '2024-03-31', last: '2024-12-31' }]);
	});

	// #452 Punkt 4 (#382): the run waits for a category on each allocable invoice it would bill, also without the check
	it('nennt die Rechnungen der Periode ohne Kategorie', async () => {
		const uncategorized = { id: 'i1', billingEntityName: 'Garten AG', description: 'Rasen', invoiceDate: '2024-06-30', amount: '120.00' };
		const fetch = (async (url: string) =>
			url.includes('/invoices/completeness/')
				? Response.json({ error: 'kaputt' }, { status: 500 })
				: url.includes('/for-statement/')
					? Response.json([{ ...uncategorized, categoryId: null, buildingId: 'b1' }, { ...uncategorized, id: 'i2', categoryId: 'c1' }])
					: Response.json({ data: [], total: 0 })) as typeof globalThis.fetch;

		expect(await invoicesInPeriod(fetch, period)).toMatchObject([{ count: 2, uncategorized: [uncategorized] }]);
	});

	// Without the check per category the preview still shows; the look at start and end of the period stays
	it('zeigt die Rechnungen auch, wenn die Prüfung pro Kategorie scheitert', async () => {
		const fetch = (async (url: string) =>
			url.includes('/invoices/completeness/')
				? Response.json({ error: 'kaputt' }, { status: 500 })
				: url.includes('/for-statement/')
					? Response.json([])
					: Response.json({ data: [], total: 0 })) as typeof globalThis.fetch;

		expect(await invoicesInPeriod(fetch, period)).toEqual([
			{ buildingId: 'b1', count: 0, first: null, last: null, statements: 0, check: undefined, changed: [], uncategorized: [] }
		]);
	});

	// #339, H-28: which heating invoices without Leistungszeitraum concern the run, the backend decides; here only names
	const heatingFetch = (forRun: object | null, asked: string[] = [], check: object = invoiceCompleteness) =>
		(async (url: string) => {
			const [hinted] = invoiceCompleteness.heatingWithoutServicePeriod;
			if (url.includes('/statements/run-heating?')) {
				asked.push(url);
				return forRun ? Response.json(forRun) : Response.json({ error: 'kaputt' }, { status: 500 });
			}
			return url.includes('/invoices/completeness/')
				? Response.json(check)
				: url.includes('/statements?')
					? Response.json({ ...statements, data: [] })
					: url.includes('/categories')
						? Response.json({ categories: [{ ...category, id: hinted.categoryId, nameDE: 'Heizung' }] })
						: Response.json([]);
		}) as typeof globalThis.fetch;

	it('nennt die Heizrechnungen ohne Leistungszeitraum, die das Backend für den Lauf nennt, mit ihrer Kategorie', async () => {
		const [hinted] = runHeating.heatingWithoutServicePeriod;
		const asked: string[] = [];

		const [row] = await invoicesInPeriod(heatingFetch(runHeating, asked), period);

		expect(row.check?.heatingWithoutServicePeriod).toEqual([{ ...hinted, categoryName: 'Heizung' }]);
		expect(asked).toEqual([`${API}/statements/run-heating?buildingId=b1&periodStart=2024-01-01&periodEnd=2024-12-31&heatingProfileId=hp1`]);
	});

	it('nennt keine Heizrechnungen ohne Leistungszeitraum, wenn das Backend sie für den Lauf nicht nennt oder nicht antwortet', async () => {
		const [quiet] = await invoicesInPeriod(heatingFetch({ heatingWithoutServicePeriod: [], oldHeatingRule: [] }), period);
		const [failed] = await invoicesInPeriod(heatingFetch(null), period);

		expect(quiet.check?.heatingWithoutServicePeriod).toEqual([]);
		expect(failed.check?.heatingWithoutServicePeriod).toEqual([]);
	});

	it('fragt nur nach den Hinweisen des Laufs, wenn die Prüfung Hinweise zu Heizkosten hat', async () => {
		const asked: string[] = [];

		await invoicesInPeriod(heatingFetch(runHeating, asked, { ...invoiceCompleteness, heatingWithoutServicePeriod: [], oldHeatingRule: [] }), period);

		expect(asked).toEqual([]);
	});
});

// #132: a new run keeps the existing statements; the preview names drafts that miss invoices of the period as they
// are now (#96's stored link) and statements of the period made with another Heizprofil or rate than the run's
describe('Bestehende Abrechnungen in der Vorschau', () => {
	const listed = statements.data[0];
	const statement = (id: string, contractId: string, status: string, heatingProfileId: string | null, managementFeePercent: string | null) => ({
		...listed,
		id,
		statementNumber: `NK-2024-${id}`,
		contractId,
		status,
		heatingProfileId,
		managementFeePercent,
		periodStart: '2024-01-01',
		periodEnd: '2024-12-31'
	});
	const c1 = buildingContracts.contracts[0].id;
	const fetchWith = (
		data: object[],
		changed: Record<string, string[]> = {},
		asked: string[] = [],
		fuelStock: string[] = []
	) =>
		(async (url: string) => {
			asked.push(url);
			// H-28 (#717): the backend names the drafts invoices or the Tankbestand changed since
			if (url.includes('/statements/run-differences?')) {
				const ids = [...new Set([...Object.keys(changed), ...fuelStock])];
				const none = { profile: null, profileEdited: null, fee: null };
				return Response.json({
					statements: ids.map((id) => ({ ...runDifferences.statements[0], ...none, id, outdated: !!changed[id]?.length, fuelStock: fuelStock.includes(id) }))
				});
			}
			if (url.includes('/statements?')) return Response.json({ ...statements, data });
			if (url.includes('/contracts?')) return Response.json(buildingContracts);
			if (url.includes('/invoices/completeness/')) return Response.json(invoiceCompleteness);
			return Response.json([]);
		}) as typeof globalThis.fetch;
	const named = (id: string, more: object) => ({
		id,
		statementNumber: `NK-2024-${id}`,
		tenantName: 'Nina Brunner',
		outdated: false,
		fuelStock: false,
		profile: null,
		profileEdited: null,
		fee: null,
		oldRule: false,
		...more
	});
	const changedOf = async (fetch: typeof globalThis.fetch) => (await invoicesInPeriod(fetch, period))[0].changed;

	it('nennt einen Entwurf, dem Rechnungen der Periode fehlen, wie sie jetzt sind', async () => {
		const fetch = fetchWith([statement('1', c1, 'draft', 'hp1', '4.50'), statement('2', c1, 'draft', 'hp1', '4.50')], { '1': ['i2'] });

		expect(await changedOf(fetch)).toEqual([named('1', { outdated: true })]);
	});

	// #454 (#408 point 8), Fachreview 454-2 V-19
	it('nennt einen Entwurf, dessen Tankbestand sich seither geändert hat', async () => {
		const fetch = fetchWith([statement('1', c1, 'draft', 'hp1', '4.50')], {}, [], ['1']);

		expect(await changedOf(fetch)).toEqual([named('1', { fuelStock: true })]);
	});

	// H-28 (#717): only a draft is outdated, sent and paid ones are corrected (#120): the backend decides
	it('nimmt die veralteten Entwürfe aus der Antwort des Backends, ohne je Abrechnung nachzufragen', async () => {
		const asked: string[] = [];

		expect(await changedOf(fetchWith([statement('1', c1, 'draft', 'hp1', '4.50')], { '1': ['i2'] }, asked))).toEqual([
			named('1', { outdated: true })
		]);
		expect(asked.filter((url) => url.includes('/changed-invoices'))).toEqual([]);
	});

	// H-28 (#16): the backend decides what a kept statement does differently from the run; here only the names
	const differing = runDifferences.statements[0];
	const differs = (more: object) => ({ ...differing, id: '1', profile: null, profileEdited: null, fee: null, ...more });
	const withDifferences = (found: object[], asked: string[] = []) =>
		(async (url: string) => {
			if (url.includes('/statements/run-differences?')) {
				asked.push(url);
				return Response.json({ statements: found });
			}
			return fetchWith([statement('1', c1, 'paid', 'hp2', '3.00')])(url);
		}) as typeof globalThis.fetch;

	it('nennt, was das Backend an Heizprofil und Verwaltungspauschale abweichend findet, in der Sprache der Oberfläche', async () => {
		const asked: string[] = [];
		const fetch = withDifferences([differs({ profile: differing.profile, fee: differing.fee })], asked);

		expect(await changedOf(fetch)).toEqual([
			named('1', { profile: { used: 'Winter', run: 'Heizung Mittelland' }, fee: { used: 3, now: 4.5, source: 'run' } })
		]);
		expect(asked).toEqual([
			`${API}/statements/run-differences?buildingId=b1&periodStart=2024-01-01&periodEnd=2024-12-31&heatingProfileId=hp1&managementFeePercent=4.5`
		]);
	});

	it('nennt ein Heizprofil, das das Backend nicht mehr kennt, unbekannt', async () => {
		const fetch = withDifferences([differs({ profile: { used: null, run: differing.profile.run } })]);

		expect(await changedOf(fetch)).toEqual([named('1', { profile: { used: 'Unbekannt', run: 'Heizung Mittelland' } })]);
	});

	it('nennt das seither bearbeitete Heizprofil einer Abrechnung beim Namen', async () => {
		const fetch = withDifferences([differs({ profileEdited: differing.profile.run })]);

		expect(await changedOf(fetch)).toEqual([named('1', { profileEdited: 'Heizung Mittelland' })]);
	});

	// code review C-1: the settings and later changes are only a hint
	it('zeigt die Vorschau auch, wenn die abweichenden Einstellungen nicht laden', async () => {
		const fetch = (async (url: string) =>
			url.includes('/statements/run-differences?')
				? Response.json({ error: 'kaputt' }, { status: 500 })
				: fetchWith([statement('1', c1, 'draft', 'hp2', '1.00')], { '1': ['i2'] })(url)) as typeof globalThis.fetch;

		expect(await changedOf(fetch)).toEqual([]);
	});

	it('übergeht Abrechnungen ausserhalb der Abrechnungsperiode', async () => {
		const before = { ...statement('1', c1, 'draft', 'hp2', '1.00'), periodStart: '2023-01-01', periodEnd: '2023-12-31' };

		expect(await changedOf(fetchWith([before], { '1': ['i2'] }))).toEqual([]);
	});

	// #335, H-28: a sent statement under the old rule the backend names for the run
	it('nennt eine versendete Abrechnung nach der alten Regel, die das Backend für den Lauf nennt', async () => {
		const fetch = (async (url: string) =>
			url.includes('/invoices/completeness/')
				? Response.json({ ...invoiceCompleteness, oldHeatingRule: ['1', '2'] })
				: url.includes('/statements/run-heating?')
					? Response.json({ heatingWithoutServicePeriod: [], oldHeatingRule: ['1'] })
					: fetchWith([statement('1', c1, 'sent', 'hp1', '4.50'), statement('2', c1, 'sent', 'hp1', '4.50')])(url)) as typeof globalThis.fetch;

		expect(await changedOf(fetch)).toEqual([named('1', { oldRule: true })]);
	});

});

// #91, step «Einstellungen»: what the run's contracts have not answered, and what they do not agree
describe('Vereinbarte Nebenkosten der Mietverträge des Laufs', () => {
	const [, open, notAgreed] = contractAgreements;
	const names = [
		{ ...category, id: open.categoryId, nameDE: 'Internet' },
		{ ...category, id: notAgreed.categoryId, nameDE: 'Lift' }
	];
	const asked: string[] = [];
	const fetch = (async (url: string) => {
		asked.push(url);
		if (url.startsWith(`${API}/statements/run?`))
			return Response.json({
				...statementRun,
				contracts: [{ ...contracts[2], billed: false }],
				overlap: null,
				skipped: []
			});
		if (url === `${API}/categories?limit=1000`) return Response.json({ categories: names });
		return Response.json(contractAgreements);
	}) as typeof globalThis.fetch;

	it('nennt je Mietvertrag die unbeantworteten und die nicht vereinbarten Kategorien der Periode', async () => {
		expect(await contractAgreement(fetch, period)).toEqual([
			{
				contractId: 'einzug',
				tenantName: 'Mieter einzug',
				apartmentNumber: '2.01',
				open: [{ categoryId: open.categoryId, name: 'Internet' }],
				notAgreed: [{ categoryId: notAgreed.categoryId, name: 'Lift' }]
			}
		]);
		expect(asked).toContain(`${API}/contracts/einzug/agreements?periodStart=2024-01-01&periodEnd=2024-12-31`);
	});
});
