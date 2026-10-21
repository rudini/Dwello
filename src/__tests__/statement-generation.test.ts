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
import statementPreview from '../../tests/contracts/statement-preview.json';
import statement from '../../tests/contracts/statement.json';
import invoiceCompleteness from '../../tests/contracts/invoice-completeness.json';
import calculationRefused from '../../tests/contracts/statement-calculation-refused.json';
import statements from '../../tests/contracts/statements.json';
import statementChangedInvoices from '../../tests/contracts/statement-changed-invoices.json';
import heatingProfiles from '../../tests/contracts/heating-profiles.json';
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

function backend(statements: { contractId: string; periodStart: string; periodEnd: string; status?: string }[] = [], inBuilding: object[] = contracts) {
	const posts: { url: string; body: Record<string, string> }[] = [];
	const fetch = async (url: string, init?: RequestInit) => {
		if (url === `${API}/statements?buildingId=b1&limit=1000`) return Response.json({ data: statements });
		if (url === `${API}/contracts?buildingId=b1&limit=1000`) {
			return Response.json({ contracts: inBuilding });
		}
		if (url === `${API}/buildings/b1`) return Response.json(building);
		const body = JSON.parse(String(init?.body));
		posts.push({ url, body });
		if (url === `${API}/statements/preview`) {
			return Response.json({
				...statementPreview,
				totalCosts: body.contractId === 'auszug' ? 300 : 400,
				balance: -50
			});
		}
		return Response.json({ ...statement, id: `s-${body.contractId}` }, { status: 201 });
	};
	return { posts, fetch: fetch as typeof globalThis.fetch };
}

describe('Schon abgerechnete Mietverträge je Gebäude', () => {
	it('zählt die Mietverträge der Periode und die mit einer Abrechnung darin, nach der Regel des Laufs', async () => {
		// a replaced statement and its berichtigte Abrechnung count once; a statement of an earlier period counts not
		const { fetch } = backend([
			{ contractId: 'einzug', periodStart: '2024-01-01', periodEnd: '2024-12-31', status: 'replaced' },
			{ contractId: 'einzug', periodStart: '2024-01-01', periodEnd: '2024-12-31' },
			{ contractId: 'auszug', periodStart: '2023-01-01', periodEnd: '2023-12-31' }
		]);

		expect(await billedContracts(fetch, period)).toEqual([
			{ buildingId: 'b1', contracts: 2, billed: 1, overlap: null, withoutFee: [] }
		]);
	});
});

// #199, #408 point 2: one Abrechnungsperiode per day and building; a run whose period overlaps a statement period of
// the building without being equal would share an invoice out above 100 %
describe('Abrechnungsperiode, die eine bestehende des Gebäudes schneidet', () => {
	const switched = [
		{ contractId: 'auszug', periodStart: '2023-07-01', periodEnd: '2024-06-30' },
		{ contractId: 'einzug', periodStart: '2023-07-01', periodEnd: '2024-06-30' },
		{ contractId: 'vorher', periodStart: '2023-07-01', periodEnd: '2024-06-30' }
	];

	it('lehnt den Lauf für das Gebäude ab und nennt die bestehende Periode und die übrigen Tage', async () => {
		const { fetch } = backend(switched);

		expect((await billedContracts(fetch, period))[0].overlap).toEqual({
			periods: [{ start: '2023-07-01', end: '2024-06-30' }],
			choose: [],
			short: [{ start: '2024-07-01', end: '2024-12-31' }],
			vacant: false,
			statements: 3
		});
	});

	it('bietet die bestehende Periode an, wenn ein Mietvertrag darin noch keine Abrechnung hat', async () => {
		const { fetch } = backend(switched.filter((s) => s.contractId !== 'vorher'));

		expect((await billedContracts(fetch, period))[0].overlap?.choose).toEqual([
			{ start: '2023-07-01', end: '2024-06-30' }
		]);
	});

	it('bietet keine kurze Periode für Tage ohne Mietstage an', async () => {
		// only «einzug» has days after 30.06.2024, and they are billed outside Dwello (#133)
		const { fetch } = backend(switched, [
			contract('auszug', '2020-01-01', '2024-03-31'),
			{ ...contract('einzug', '2024-05-01', null), billedUntil: '2024-12-31' }
		]);

		const { overlap } = (await billedContracts(fetch, period))[0];
		expect(overlap?.short).toEqual([]);
		// Fachreview 199-1 V-3: step 2 says there is nothing to bill
		expect(overlap?.vacant).toBe(true);
	});

	it('lässt eine ersetzte Abrechnung und eine Abrechnung genau dieser Periode zu', async () => {
		const { fetch } = backend([
			{ contractId: 'auszug', periodStart: '2023-07-01', periodEnd: '2024-06-30', status: 'replaced' },
			{ contractId: 'einzug', periodStart: '2024-01-01', periodEnd: '2024-12-31' }
		]);

		expect((await billedContracts(fetch, period))[0].overlap).toBeNull();
	});

	// code review 199-2 C-8: a replaced statement without its berichtigte Abrechnung still holds its period, else its
	// correction would overlap the run (#120)
	it('zählt eine ersetzte Abrechnung ohne berichtigte als Periode des Gebäudes', async () => {
		const { fetch } = backend([
			{ contractId: 'auszug', periodStart: '2023-07-01', periodEnd: '2024-06-30', status: 'replaced' }
		]);

		expect((await billedContracts(fetch, period))[0].overlap?.periods).toEqual([
			{ start: '2023-07-01', end: '2024-06-30' }
		]);
	});

	// code review 199-1 C-1: the period of a replaced statement is one of the building's: its berichtigte Abrechnung is
	// created there, also when another, older statement overlaps it
	it('lässt die Periode einer ersetzten Abrechnung zu, auch wenn eine andere sie schneidet', async () => {
		const { fetch } = backend([
			{ contractId: 'auszug', periodStart: '2024-01-01', periodEnd: '2024-12-31', status: 'replaced' },
			{ contractId: 'einzug', periodStart: '2024-07-01', periodEnd: '2025-06-30' }
		]);

		expect((await billedContracts(fetch, period))[0].overlap).toBeNull();
	});

	// Fachreview 199-1 V-2: a statement period inside the run leaves two pieces, each its own short period
	it('bietet für jedes Stück übriger Tage eine eigene kurze Periode an', async () => {
		const { fetch } = backend([
			{ contractId: 'einzug', periodStart: '2024-03-01', periodEnd: '2024-09-30' }
		]);

		expect((await billedContracts(fetch, period))[0].overlap?.short).toEqual([
			{ start: '2024-01-01', end: '2024-02-29' },
			{ start: '2024-10-01', end: '2024-12-31' }
		]);
	});

	// Fachreview 199-1 V-4: a short period only for days of an ended period, none for days still to come
	it('bietet keine kurze Periode für Tage an, die noch nicht vorbei sind', async () => {
		const { fetch } = backend(
			[{ contractId: 'einzug', periodStart: '2099-01-01', periodEnd: '2099-06-30' }],
			[contract('einzug', '2024-05-01', null)]
		);
		const later = { ...period, periodStart: '2099-01-01', periodEnd: '2099-12-31' };

		const { overlap } = (await billedContracts(fetch, later))[0];
		expect(overlap?.short).toEqual([]);
		expect(overlap?.vacant).toBe(false);
	});

	// Fachreview 199-1 V-5: «without a statement» counts Mietstage (after «Abgerechnet bis») and no replaced statement
	it('bietet die bestehende Periode nach den Mietstagen und ohne ersetzte Abrechnungen an', async () => {
		const billedOutside = backend(switched.slice(0, 2), [
			contract('auszug', '2020-01-01', '2024-03-31'),
			contract('einzug', '2024-05-01', null),
			{ ...contract('vorher', '2020-01-01', '2023-12-31'), billedUntil: '2023-12-31' }
		]);
		const replaced = backend([...switched.slice(0, 2), { ...switched[2], status: 'replaced' }]);

		expect((await billedContracts(billedOutside.fetch, period))[0].overlap?.choose).toEqual([]);
		expect((await billedContracts(replaced.fetch, period))[0].overlap?.choose).toEqual([
			{ start: '2023-07-01', end: '2024-06-30' }
		]);
	});

	// Fachreview 199-1 V-1, product owner: statements made before this rule may overlap each other; a period equal to
	// one of them is allowed, only one that overlaps and equals none is refused
	it('lässt bei überschneidenden Altdaten eine Periode zu, die einer bestehenden gleicht', async () => {
		const { fetch } = backend([
			{ contractId: 'einzug', periodStart: '2023-07-01', periodEnd: '2024-06-30' },
			{ contractId: 'auszug', periodStart: '2024-01-01', periodEnd: '2024-12-31' }
		]);
		const shifted = { ...period, periodStart: '2024-07-01', periodEnd: '2025-06-30' };

		expect((await billedContracts(fetch, period))[0].overlap).toBeNull();
		// «einzug» has days in 2024 but a statement that overlaps it: the run would bill him no more there
		expect((await billedContracts(fetch, shifted))[0].overlap?.choose).toEqual([]);
	});

	it('nennt in der Ablehnung jede überschnittene Periode', async () => {
		const { fetch } = backend([
			...switched,
			{ contractId: 'einzug', periodStart: '2024-07-01', periodEnd: '2024-09-30' }
		]);

		await expect(previewStatements(fetch, period)).rejects.toThrow(
			'(01.07.2023 – 30.06.2024, 01.07.2024 – 30.09.2024)'
		);
	});

	// code review 199-3 C-12: a replaced statement and its berichtigte Abrechnung are one statement for step 2's text
	it('zählt eine ersetzte Abrechnung mit ihrer berichtigten einmal', async () => {
		const { fetch } = backend([
			{ contractId: 'einzug', periodStart: '2023-07-01', periodEnd: '2024-06-30', status: 'replaced' },
			{ contractId: 'einzug', periodStart: '2023-07-01', periodEnd: '2024-06-30' }
		]);

		expect((await billedContracts(fetch, period))[0].overlap?.statements).toBe(1);
	});

	// code review 199-3 C-12: days a replaced statement holds are no days for a short period
	it('bietet keine kurze Periode für Tage einer ersetzten Abrechnung an', async () => {
		const { fetch } = backend([
			{ contractId: 'einzug', periodStart: '2023-07-01', periodEnd: '2024-06-30' },
			{ contractId: 'einzug', periodStart: '2024-07-01', periodEnd: '2024-09-30', status: 'replaced' }
		]);

		expect((await billedContracts(fetch, period))[0].overlap?.short).toEqual([
			{ start: '2024-10-01', end: '2024-12-31' }
		]);
	});

	// persona Dr. Weber P-5: a calendar year by its days, not «2024»
	it('nennt in der Ablehnung ein Kalenderjahr mit seinen Tagen', async () => {
		const { fetch } = backend([
			{ contractId: 'einzug', periodStart: '2024-01-01', periodEnd: '2024-12-31' }
		]);

		await expect(
			previewStatements(fetch, { ...period, periodStart: '2024-07-01', periodEnd: '2025-06-30' })
		).rejects.toThrow('von Seeblick (01.01.2024 – 31.12.2024)');
	});

	// code review 199-2 C-10: every refused building is named
	it('nennt in der Ablehnung jedes abgelehnte Gebäude', async () => {
		const fetch = (async (url: string) => {
			const id = new URL(url).searchParams.get('buildingId') ?? url.split('/').at(-1)!;
			if (url.includes('/statements?')) return Response.json({ data: switched });
			if (url.includes('/contracts?')) return Response.json({ contracts });
			return Response.json({ ...building, id, name: id === 'b1' ? 'Seeblick' : 'Bergsicht' });
		}) as typeof globalThis.fetch;

		await expect(previewStatements(fetch, { ...period, buildingIds: ['b1', 'b2'] })).rejects.toThrow(
			/von Seeblick \(01\.07\.2023 – 30\.06\.2024\)\..* von Bergsicht \(01\.07\.2023 – 30\.06\.2024\)\./
		);
	});

	it('erstellt und berechnet für ein solches Gebäude nichts', async () => {
		const { fetch, posts } = backend(switched);

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
	it('nennt die Mietverträge der Periode, die eine Abrechnung erhalten, ohne vereinbarte Pauschale', async () => {
		const { fetch } = backend(
			[{ contractId: 'einzug', periodStart: '2024-01-01', periodEnd: '2024-12-31' }],
			[
				{ ...contract('auszug', '2020-01-01', '2024-03-31'), managementFeeAgreed: false },
				// already billed: this run makes no statement for it
				{ ...contract('einzug', '2024-05-01', null), managementFeeAgreed: false },
				{ ...contract('vorher', '2020-01-01', '2023-12-31'), managementFeeAgreed: false },
				{ ...contract('eigen', '2024-01-01', null), managementFeePercent: '2.00' } as never
			]
		);

		expect((await billedContracts(fetch, period))[0].withoutFee).toEqual([
			{ id: 'auszug', tenantName: 'Mieter auszug', apartmentNumber: '2.01' }
		]);
	});
});

describe('Abrechnungen erstellen', () => {
	it('zeigt in der Vorschau jeden Mietvertrag, der in die Periode fällt', async () => {
		const { fetch } = backend();

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

	// #133: bis «Abgerechnet bis» ausserhalb von Dwello abgerechnet; ohne Mietstage danach erhält er keine Abrechnung
	it('übergeht einen Mietvertrag, der in der Periode nach «Abgerechnet bis» keine Mietstage hat', async () => {
		const inBuilding = [
			{ ...contract('auszug', '2020-01-01', '2024-03-31'), billedUntil: '2024-03-31' },
			{ ...contract('einzug', '2024-05-01', null), billedUntil: '2023-12-31' }
		];
		const { fetch, posts } = backend([], inBuilding);

		expect(await generateStatements(fetch, period)).toEqual(['s-einzug']);
		expect(posts.map((post) => post.body.contractId)).toEqual(['einzug']);
		expect(await billedContracts(fetch, period)).toEqual([
			{
				buildingId: 'b1',
				contracts: 1,
				billed: 0,
				overlap: null,
				withoutFee: [],
				skipped: [{ id: 'auszug', tenantName: 'Mieter auszug', billedUntil: '2024-03-31' }]
			}
		]);
	});

	// #453 (#327): the preview names a contract «Abgerechnet bis» covers in full, not only those it shortens
	it('nennt die Mietverträge, die «Abgerechnet bis» in der Periode ganz abdeckt', async () => {
		const inBuilding = [
			{ ...contract('auszug', '2020-01-01', '2024-03-31'), billedUntil: '2024-03-31' },
			{ ...contract('einzug', '2024-05-01', null), billedUntil: '2023-12-31' },
			{ ...contract('vorher', '2020-01-01', '2023-12-31'), billedUntil: '2023-12-31' }
		];
		const { fetch } = backend([], inBuilding);

		expect((await billedContracts(fetch, period))[0].skipped).toEqual([
			{ id: 'auszug', tenantName: 'Mieter auszug', billedUntil: '2024-03-31' }
		]);
	});

	// fach review 453-1 V-2: billed outside Dwello beyond its end, the contract has no Mietstage left in the period
	it('nennt einen Mietvertrag, der über sein Vertragsende hinaus ausserhalb von Dwello abgerechnet ist', async () => {
		const { fetch } = backend([], [{ ...contract('auszug', '2020-01-01', '2024-03-31'), billedUntil: '2024-06-30' }]);

		expect((await billedContracts(fetch, period))[0].skipped).toEqual([
			{ id: 'auszug', tenantName: 'Mieter auszug', billedUntil: '2024-06-30' }
		]);
	});

	// #453 (#327): each row names its billed days; «Abgerechnet bis» only where it shortens them in the period
	it('nennt in jeder Zeile die abgerechneten Tage und «Abgerechnet bis», wo es sie kürzt', async () => {
		const inBuilding = [
			{ ...contract('auszug', '2020-01-01', '2024-03-31'), billedUntil: '2024-02-29' },
			{ ...contract('einzug', '2024-05-01', null), billedUntil: '2023-12-31' }
		];
		const { fetch } = backend([], inBuilding);

		const rows = await previewStatements(fetch, period);
		expect(rows.map(({ contractId, rentalStart, rentalEnd, billedUntil }) => ({ contractId, rentalStart, rentalEnd, billedUntil }))).toEqual([
			{ contractId: 'auszug', rentalStart: statementPreview.rentalStart, rentalEnd: statementPreview.rentalEnd, billedUntil: '2024-02-29' },
			{ contractId: 'einzug', rentalStart: statementPreview.rentalStart, rentalEnd: statementPreview.rentalEnd, billedUntil: undefined }
		]);
	});

	// Abrechnung 2024 im Jahr 2026 erstellt, Auszug im März 2025: der Mieter ist schon weg, eine Akonto-Erhöhung nützt nichts
	it('zählt einen Mieter, der bis heute ausgezogen ist, als ausgezogen', async () => {
		const { fetch } = backend([], [contract('spaeter', '2020-01-01', '2025-03-31'), contract('bleibt', '2020-01-01', '2099-12-31')]);

		expect((await previewStatements(fetch, period)).map((row) => [row.contractId, row.movedOut])).toEqual([
			['spaeter', true],
			['bleibt', false]
		]);
	});

	// #76: ein befristeter Mietvertrag läuft ohne Kündigungstermin bis zum vereinbarten Vertragsende
	it('erkennt einen laufenden befristeten Mietvertrag', async () => {
		const { fetch } = backend(
			[],
			[
				contract('befristet', '2020-01-01', '2099-12-31'),
				{ ...contract('gekuendigt', '2020-01-01', '2099-12-31'), terminated: true },
				contract('unbefristet', '2020-01-01', null),
				contract('beendet', '2020-01-01', '2024-03-31')
			]
		);

		expect((await previewStatements(fetch, period)).map((row) => [row.contractId, row.fixedTerm])).toEqual([
			['befristet', true],
			['gekuendigt', false],
			['unbefristet', false],
			['beendet', false]
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

	// Erneut erstellen ergänzt nur: die Abrechnung eines Mietvertrags wird nicht verdoppelt
	it('übergeht Mietverträge, die in der Periode schon eine Abrechnung haben', async () => {
		const { fetch, posts } = backend([
			{ contractId: 'auszug', periodStart: '2024-01-01', periodEnd: '2024-12-31' },
			{ contractId: 'einzug', periodStart: '2023-01-01', periodEnd: '2023-12-31' } // other period
		]);

		expect((await previewStatements(fetch, period)).map((row) => row.contractId)).toEqual([
			'einzug'
		]);
		expect(await generateStatements(fetch, period)).toEqual(['s-einzug']);
		expect(posts.map((post) => post.body.contractId)).toEqual(['einzug', 'einzug']);
	});

	// #120: eine ersetzte Abrechnung zählt nicht als Abrechnung der Periode; der Lauf erstellt die berichtigte
	it('erstellt für einen Mietvertrag mit einer ersetzten Abrechnung die berichtigte', async () => {
		const { fetch, posts } = backend([
			{ contractId: 'auszug', periodStart: '2024-01-01', periodEnd: '2024-12-31', status: 'replaced' },
			{ contractId: 'einzug', periodStart: '2024-01-01', periodEnd: '2024-12-31', status: 'paid' }
		]);

		expect(await generateStatements(fetch, period)).toEqual(['s-auszug']);
		expect(posts.map((post) => post.body.contractId)).toEqual(['auszug']);
	});

	// Fachreview W2e V-3: eine ersetzte Abrechnung einer anderen, nur überlappenden Periode bleibt abgerechnet; seit
	// #199 hält sie ihre Periode, und der Lauf wird abgelehnt (code review 199-2 C-8)
	it('erstellt nichts, wenn eine ersetzte Abrechnung eine andere, überlappende Periode hat', async () => {
		const { fetch, posts } = backend([
			{ contractId: 'auszug', periodStart: '2023-07-01', periodEnd: '2024-06-30', status: 'replaced' }
		]);

		await expect(generateStatements(fetch, period)).rejects.toThrow('überschneidet sich');
		expect(posts).toEqual([]);
	});

	it('meldet in Worten, wenn das Backend die Berechnung ablehnt', async () => {
		const fetch = (async (url: string) =>
			url.includes('contracts')
				? Response.json({ contracts: [contract('auszug', '2020-01-01', null)] })
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

	// #339 (#451, Punkt 6): nur bei einem Ein- oder Auszug in der Periode und mit Heizprofil zählt eine Heizrechnung mit
	// Leistungszeitraum nur seine Monate; nur dann nennt die Vorschau die Heizrechnungen ohne
	it.each([
		['bei einem Einzug mit Heizprofil', [contract('einzug', '2024-05-01', null)], 'hp1', 1],
		['nicht bei einem Mietvertrag über die ganze Periode', [contract('ganz', '2020-01-01', null)], 'hp1', 0],
		['nicht ohne Heizprofil', [contract('einzug', '2024-05-01', null)], '', 0]
	] as const)('nennt Heizrechnungen ohne Leistungszeitraum neben solchen mit %s', async (_, inBuilding, heatingProfileId, count) => {
		const [hinted] = invoiceCompleteness.heatingWithoutServicePeriod;
		const fetch = (async (url: string) =>
			url.includes('/invoices/completeness/')
				? Response.json(invoiceCompleteness)
				: url.includes('/contracts?')
					? Response.json({ contracts: inBuilding })
					: url.includes('/statements?')
						? Response.json({ ...statements, data: [] })
						: url.includes('/categories')
							? Response.json({ categories: [{ ...category, id: hinted.categoryId, nameDE: 'Heizung' }] })
							: Response.json([])) as typeof globalThis.fetch;

		const [row] = await invoicesInPeriod(fetch, { ...period, heatingProfileId });

		// named by its category in the UI language
		expect(row.check?.heatingWithoutServicePeriod).toEqual(count ? [{ ...hinted, categoryName: 'Heizung' }] : []);
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
	const ownRate = { ...buildingContracts.contracts[0], id: 'eigen', managementFeePercent: '2.50' };
	const notAgreed = { ...buildingContracts.contracts[0], id: 'ohne', managementFeeAgreed: false };
	const profile = (id: string, nameDE: string, updatedAt = '2024-01-01T00:00:00.000Z') => ({ ...heatingProfiles.data[0], id, nameDE, updatedAt });
	const profiles = [profile('hp1', 'Heizung Mittelland'), profile('hp2', 'Winter')];
	const fetchWith = (
		data: object[],
		changed: Record<string, string[]> = {},
		asked: string[] = [],
		known = profiles,
		fuelStock: string[] = []
	) =>
		(async (url: string) => {
			const id = url.match(/statements\/([^/]+)\/changed-invoices/)?.[1];
			if (id) {
				asked.push(id);
				return Response.json({ ...statementChangedInvoices, invoiceIds: changed[id] ?? [], fuelStockChanged: fuelStock.includes(id) });
			}
			if (url.includes('/statements?')) return Response.json({ ...statements, data });
			if (url.includes('/contracts?')) return Response.json({ contracts: [...buildingContracts.contracts, ownRate, notAgreed] });
			if (url.includes('/heating-profiles?')) return Response.json({ ...heatingProfiles, data: known });
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
		const fetch = fetchWith([statement('1', c1, 'draft', 'hp1', '4.50')], {}, [], profiles, ['1']);

		expect(await changedOf(fetch)).toEqual([named('1', { fuelStock: true })]);
	});

	// sent and paid statements are corrected by a berichtigte Abrechnung (#120), not by a new run
	it('fragt nur bei Entwürfen nach geänderten Rechnungen', async () => {
		const asked: string[] = [];

		expect(await changedOf(fetchWith([statement('1', c1, 'sent', 'hp1', '4.50')], { '1': ['i2'] }, asked))).toEqual([]);
		expect(asked).toEqual([]);
	});

	it('nennt Abrechnungen mit einem anderen Heizprofil, auch versendete, mit beiden Namen', async () => {
		const fetch = fetchWith([statement('1', c1, 'paid', 'hp2', '4.50')]);

		expect(await changedOf(fetch)).toEqual([named('1', { profile: { used: 'Winter', run: 'Heizung Mittelland' } })]);
	});

	// a deleted Heizprofil is stored as none; the statement keeps its name since #209
	it('nennt ein gelöschtes Heizprofil mit dem Namen, den die Abrechnung gespeichert hat', async () => {
		const names = { name: 'Alt', nameDE: 'Alt', nameFR: null, nameIT: null, nameEN: null };
		const fetch = fetchWith([{ ...statement('1', c1, 'sent', null, '4.50'), heatingShare: { byDays: false, percent: 43, months: [], names } }]);

		expect(await changedOf(fetch)).toEqual([named('1', { profile: { used: 'Alt', run: 'Heizung Mittelland' } })]);
	});

	// persona Dr. Weber P-2, Fachreview V-8: by days (a contract over the whole period) the Heizprofil changes nothing
	it('nennt kein anderes Heizprofil, wenn die Abrechnung die Heizkosten nach Tagen verteilt hat', async () => {
		const fetch = fetchWith([{ ...statement('1', c1, 'sent', 'hp2', '4.50'), heatingShare: { byDays: true, reason: 'wholePeriod' } }]);

		expect(await changedOf(fetch)).toEqual([]);
	});

	// code review C-13: without heating months in the rented months, or without a profile, another one may share differently
	it('nennt ein anderes Heizprofil, wenn die Abrechnung nach Tagen verteilt hat, weil ihr Heizprofil keine Heizmonate hatte', async () => {
		const fetch = fetchWith([{ ...statement('1', c1, 'sent', 'hp2', '4.50'), heatingShare: { byDays: true, reason: 'noHeatingMonths' } }]);

		expect(await changedOf(fetch)).toEqual([named('1', { profile: { used: 'Winter', run: 'Heizung Mittelland' } })]);
	});

	// Fachreview V-1: the statement keeps the Monatsanteile of its time, the run takes the profile as it is now
	it('nennt eine Abrechnung, deren Heizprofil nach dem Erstellen bearbeitet wurde', async () => {
		const share = { byDays: false, percent: 43, months: [], names: { name: 'Heizung Mittelland', nameDE: 'Heizung Mittelland', nameFR: null, nameIT: null, nameEN: null } };
		const made = { ...statement('1', c1, 'sent', 'hp1', '4.50'), heatingShare: share, createdAt: '2025-01-10T08:00:00.000Z' };
		const later = [profile('hp1', 'Heizung Mittelland', '2025-02-01T08:00:00.000Z')];

		expect(await changedOf(fetchWith([made], {}, [], later))).toEqual([named('1', { profileEdited: 'Heizung Mittelland' })]);
		expect(await changedOf(fetchWith([made]))).toEqual([]); // edited before
		// by days, the profile's shares do not count
		expect(await changedOf(fetchWith([{ ...made, heatingShare: { byDays: true } }], {}, [], later))).toEqual([]);
	});

	// Fachreview M-1: the rate the run would store for the contract: its own rate before the run's, 0 without an agreed
	// fee (#89); each case says where the rate comes from
	it('vergleicht die Verwaltungspauschale mit dem Satz, den der Lauf für den Mietvertrag speichern würde', async () => {
		const fetch = fetchWith([
			statement('1', c1, 'sent', 'hp1', '3.00'),
			statement('2', 'eigen', 'sent', 'hp1', '2.50'),
			statement('3', 'eigen', 'sent', 'hp1', '3.00'),
			statement('4', 'ohne', 'sent', 'hp1', '0.00'),
			statement('5', 'ohne', 'sent', 'hp1', '3.00'),
			statement('6', c1, 'sent', 'hp1', null)
		]);

		expect(await changedOf(fetch)).toEqual([
			named('1', { fee: { used: 3, now: 4.5, source: 'run' } }),
			named('3', { fee: { used: 3, now: 2.5, source: 'contract' } }),
			named('5', { fee: { used: 3, now: 0, source: 'none' } }),
			named('6', { fee: { used: 0, now: 4.5, source: 'run' } })
		]);
	});

	// Fachreview V-4: settings only compare within the same Abrechnungsperiode; a draft of an overlapping one still
	// misses invoices
	it('vergleicht die Einstellungen nur mit Abrechnungen derselben Abrechnungsperiode', async () => {
		const other = { ...statement('1', c1, 'draft', 'hp2', '1.00'), periodStart: '2023-07-01', periodEnd: '2024-06-30' };

		expect(await changedOf(fetchWith([other]))).toEqual([]);
		expect(await changedOf(fetchWith([other], { '1': ['i2'] }))).toEqual([named('1', { outdated: true })]);
	});

	it('übergeht Abrechnungen ausserhalb der Abrechnungsperiode', async () => {
		const before = { ...statement('1', c1, 'draft', 'hp2', '1.00'), periodStart: '2023-01-01', periodEnd: '2023-12-31' };

		expect(await changedOf(fetchWith([before], { '1': ['i2'] }))).toEqual([]);
	});

	// #335 (#451, Punkt 5): die versendete Abrechnung des Vormieters rechnet die Heizkosten noch ohne die Monate im
	// Leistungszeitraum (laut Prüfung); erstellt der Lauf die Abrechnung des Nachmieters derselben Wohnung, nennt die
	// Vorschau sie, sonst nicht
	it.each([
		['erstellt der Lauf eine Abrechnung derselben Wohnung', [], true],
		['hat der Nachmieter schon eine Abrechnung', [{ contractId: 'einzug' }], false]
	] as const)('nennt eine versendete Abrechnung nach der alten Regel: %s', async (_, more, oldRule) => {
		const moved = [contract('auszug', '2020-01-01', '2024-03-31'), contract('einzug', '2024-05-01', null)];
		const sent = statement('1', 'auszug', 'sent', 'hp1', '4.50');
		const others = more.map((other, i) => ({ ...statement(`n${i}`, other.contractId, 'draft', 'hp1', '4.50') }));
		const fetch = (async (url: string) =>
			url.includes('/invoices/completeness/')
				? Response.json({ ...invoiceCompleteness, oldHeatingRule: ['1'] })
				: url.includes('/contracts?')
					? Response.json({ contracts: moved })
					: fetchWith([sent, ...others])(url)) as typeof globalThis.fetch;

		expect((await changedOf(fetch)).filter((one) => one.id === '1')).toEqual(oldRule ? [named('1', { oldRule: true })] : []);
	});

	// code review C-1: the settings are only a hint; without contracts or Heizprofile the preview still shows
	it('zeigt die Vorschau auch, wenn Mietverträge oder Heizprofile nicht laden', async () => {
		const fetch = (async (url: string) =>
			url.includes('/heating-profiles?') || url.includes('/contracts?')
				? Response.json({ error: 'kaputt' }, { status: 500 })
				: fetchWith([statement('1', c1, 'draft', 'hp2', '1.00')], { '1': ['i2'] })(url)) as typeof globalThis.fetch;

		expect(await changedOf(fetch)).toEqual([named('1', { outdated: true })]);
	});

	// only a hint: without the answer the draft is not named outdated, and the preview still shows
	it('zeigt die Vorschau auch, wenn die geänderten Rechnungen nicht laden', async () => {
		const fetch = (async (url: string) =>
			url.includes('/changed-invoices')
				? Response.json({ error: 'kaputt' }, { status: 500 })
				: fetchWith([statement('1', c1, 'draft', 'hp1', '4.50')])(url)) as typeof globalThis.fetch;

		expect(await changedOf(fetch)).toEqual([]);
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
		if (url === `${API}/statements?buildingId=b1&limit=1000`) return Response.json({ data: [] });
		if (url === `${API}/contracts?buildingId=b1&limit=1000`) return Response.json({ contracts: [contracts[2]] });
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
